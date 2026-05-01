import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Anthropic } from '@anthropic-ai/sdk';

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) => {
  const { sessionId } = await params;

  try {
    // 환경변수 로드 (요청 시점)
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('[API Route] ANTHROPIC_API_KEY exists:', !!apiKey);
    console.log('[API Route] ANTHROPIC_API_KEY length:', apiKey?.length);
    console.log('[API Route] ANTHROPIC_API_KEY prefix:', apiKey?.substring(0, 10));

    if (!apiKey) {
      console.error('[API Route] ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const supabase = await createClient();

    // 1. 세션 데이터 조회
    const { data: session, error: sessionError } = await supabase
      .from('analysis_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: '세션을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 2. 카테고리 한글 변환
    const categoryLabels: Record<string, string> = {
      love: '연애',
      emotion: '감정',
      relationship: '인간관계',
      career: '직업/진로',
    };
    const categoryLabel = categoryLabels[session.category] || session.category;

    // 3. Claude API로 무료 리포트 생성
    const prompt = `당신은 사람의 심리 패턴과 선택 구조를 읽는 심리 분석가입니다.
사용자에게 친구가 조언해주듯, 따뜻하면서도 통찰력 있게 말하세요.

# 사용자 정보
- 분석 카테고리: ${categoryLabel}
- 성향 점수: ${JSON.stringify(session.user_type_scores || {}, null, 2)}

# 작업
사용자의 ${categoryLabel} 상황을 분석하여 다음 구조의 리포트를 생성하세요:

1. headline:
   - 한 구 또는 한 단어로 핵심만 표현
   - 짧고 강하게, 대화체

2. sections (5개 섹션, 각각 2-3문장으로 짧게):
   - 섹션 1: 상황/감정을 질문형으로 (예: "넌 지금 어떤 상태야?", "뭘 느끼고 있어?")
   - 섹션 2: 관찰하듯이 패턴 드러내기 (예: "항상 비슷한 패턴이...", "계속 같은 선택을...")
   - 섹션 3: 탐색하듯이 이유 설명 (예: "그 뒤에는...", "그렇게 하는 이유는...")
   - 섹션 4: 현실적으로 예측 (예: "이대로 가면", "계속 미루면")
   - 섹션 5: 따뜻한 결론 (예: "너에게 필요한 것", "너를 위한 깨달음")

3. deficitSentence: 행동을 유도하는 구조 (완결형 X, 반드시 질문으로 끝낼 것)
   - 현재 상태 재정의 (1문장): "그래서 지금 너한테 필요한 건 ~이야"
   - 핵심 문제 한 단계 더 깊게 (1문장): "문제는 ~"
   - 판단을 위한 질문 1-2개: "~일까?", "~은 뭘까?"
   - 완결형 금지, 반드시 질문으로 끝낼 것

# 작성 규칙
- 반말만 사용 (존댓말 절대 금지)
- 친구가 상담해주듯, 공감과 통찰의 균형
- 설명이 아니라 대화: "~이다" → "~야", "~이므로" → "~이기도 해"
- 마크다운 기호(**, #, ---, *) 절대 금지
- 이모지 사용 금지
- 한 문단은 최대 3문장, 대부분 1-2문장

응답은 JSON만 반환:
{
  "headline": "한 구 또는 한 단어",
  "sections": [
    { "title": "질문형 제목", "paragraphs": ["...", "..."] },
    { "title": "관찰형 제목", "paragraphs": ["...", "..."] },
    { "title": "탐색형 제목", "paragraphs": ["...", "..."] },
    { "title": "예측형 제목", "paragraphs": ["...", "..."] },
    { "title": "결론형 제목", "paragraphs": ["..."] }
  ],
  "deficitSentence": "..."
}`;

    console.log('[API Route] Starting Anthropic stream for sessionId:', sessionId);
    const stream = await anthropic.messages.stream({
      model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    console.log('[API Route] Stream created successfully');

    // 4. SSE로 스트리밍 응답
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const text = chunk.delta.text;
              const data = JSON.stringify({
                content: text,
                done: false,
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Free report API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '리포트 생성 실패' },
      { status: 500 }
    );
  }
};
