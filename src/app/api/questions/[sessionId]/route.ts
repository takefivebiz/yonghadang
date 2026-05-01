import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GeneratedQuestion {
  title: string;
  description: string;
  question_axis: 'future' | 'others' | 'self';
  hooking_type:
    | 'regret'
    | 'fomo'
    | 'avoidance'
    | 'core'
    | 'external_lens'
    | 'timing'
    | 'origin'
    | 'decision';
  is_recommended: boolean;
}

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) => {
  const { sessionId } = await params;

  try {
    const supabase = await createClient();

    // 1. 세션 조회
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

    // 2. 기존 질문이 있으면 반환
    const { data: existingQuestions } = await supabase
      .from('questions')
      .select('id, title, description, question_axis, hooking_type')
      .eq('session_id', sessionId)
      .eq('loop_depth', 1);

    if (existingQuestions && existingQuestions.length > 0) {
      return NextResponse.json({ questions: existingQuestions });
    }

    // 3. question_sets 생성
    const { data: questionSet, error: setError } = await supabase
      .from('question_sets')
      .insert({
        session_id: sessionId,
        loop_depth: 1,
      })
      .select()
      .single();

    if (setError || !questionSet) {
      throw setError || new Error('질문 세트 생성 실패');
    }

    // 4. Anthropic API로 8개 질문 생성
    const categoryLabels = {
      love: '연애',
      relationship: '인간관계',
      career: '직업/진로',
      emotion: '감정',
    } as const;

    const categoryLabel = categoryLabels[session.category as keyof typeof categoryLabels] || session.category;

    const prompt = `사용자가 "${categoryLabel}" 주제로 심리 분석을 요청했습니다.

**사용자 성향 데이터**:
${JSON.stringify(session.user_type_scores || {}, null, 2)}

**세부 카테고리**: ${session.subcategory || '일반'}

이 사용자를 더 깊이 있게 분석하기 위한 **8개의 유료 심화 질문**을 생성해주세요.

각 질문은 다음 구조로 JSON 배열로 반환하세요:
\`\`\`json
[
  {
    "title": "질문 제목 (한 문장)",
    "description": "질문 설명 및 배경 (2-3문장)",
    "question_axis": "future" | "others" | "self",
    "hooking_type": "regret" | "fomo" | "avoidance" | "core" | "external_lens" | "timing" | "origin" | "decision",
    "is_recommended": true | false
  },
  ...
]
\`\`\`

**가이드라인**:
- question_axis: "self" (자기 이해), "others" (타인 이해), "future" (미래 지향)
- hooking_type:
  - "regret": 후회와 아쉬움 자극
  - "fomo": 기회 상실 우려 자극
  - "avoidance": 회피 패턴 자극
  - "core": 핵심 신념 탐색
  - "external_lens": 외부 관점 제시
  - "timing": 타이밍과 시간 관련
  - "origin": 근원과 배경 탐색
  - "decision": 의사결정 구조 분석
- is_recommended: 특히 추천하는 질문은 true

**요구사항**:
- JSON 배열만 응답하세요 (마크다운 포장 없음)
- 각 질문이 사용자의 성향과 카테고리에 맞아야 합니다
- 깊이 있고 실질적인 질문들이어야 합니다`;

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // JSON 파싱
    let generatedQuestions: GeneratedQuestion[] = [];
    try {
      // JSON 코드 블록 제거
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        generatedQuestions = JSON.parse(jsonMatch[0]);
      } else {
        generatedQuestions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse generated questions:', parseError);
      throw new Error('질문 생성 응답 파싱 실패');
    }

    // 5. questions 테이블에 저장
    const questionsToInsert = generatedQuestions.map((q, index) => ({
      question_set_id: questionSet.id,
      session_id: sessionId,
      loop_depth: 1,
      title: q.title,
      description: q.description,
      question_axis: q.question_axis,
      hooking_type: q.hooking_type,
      display_order: index + 1,
      is_recommended: q.is_recommended ?? false,
    }));

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (insertError || !insertedQuestions) {
      throw insertError || new Error('질문 저장 실패');
    }

    // 6. 응답
    return NextResponse.json({
      questions: insertedQuestions.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        question_axis: q.question_axis,
        hooking_type: q.hooking_type,
      })),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('Questions API error:', error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
