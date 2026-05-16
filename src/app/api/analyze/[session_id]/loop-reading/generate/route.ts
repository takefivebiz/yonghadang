import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  buildLoopReadingUserPrompt,
  parseLoopResult,
  LoopReadingSceneInsight,
} from "@/lib/prompts/generate-result";
import { LoopType, LoopAnswer } from "@/lib/types/quiz";

// TODO: [백엔드 연동] Supabase service_role로 세션 검증 및 loop_answers 테이블 저장

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface LoopReadingRequestBody {
  loopType: LoopType;
  loopTitle: string;
  context: {
    freeInput: string;
    stateSummary: string[];
    /** 기존 scene의 carry_over 배열. 반복 금지 판단에 사용한다. */
    sceneInsights: LoopReadingSceneInsight[];
  };
}

/** 응답 타입: LoopAnswer와 동일. localStorage에 그대로 저장 가능. */
export type LoopReadingResponseBody = LoopAnswer;

const VALID_LOOP_TYPES: LoopType[] = ["action", "standard", "evaluate"];

/**
 * POST /api/analyze/[session_id]/loop-reading/generate
 * 무료·유료 결과를 다 읽은 뒤 요청하는 후속 루프 리딩을 생성한다.
 *
 * - scene 전체 messages는 받지 않는다. carry_over(sceneInsights)만 사용.
 * - 응답은 LoopAnswer 형태이며 클라이언트에서 localStorage에 직접 저장한다.
 */
export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> },
): Promise<NextResponse> => {
  const { session_id } = await params;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as LoopReadingRequestBody;
    const { loopType, loopTitle, context } = body;

    // ── 필수 필드 검증 ──────────────────────────────────────────────
    if (!loopType || !loopTitle || !context?.freeInput) {
      return NextResponse.json(
        {
          error:
            "필수 필드가 누락되었습니다 (loopType, loopTitle, context.freeInput)",
        },
        { status: 400 },
      );
    }

    if (!VALID_LOOP_TYPES.includes(loopType)) {
      return NextResponse.json(
        { error: `유효하지 않은 loopType: ${loopType}` },
        { status: 400 },
      );
    }

    if (!context.freeInput.trim()) {
      return NextResponse.json(
        { error: "context.freeInput이 비어있습니다" },
        { status: 400 },
      );
    }

    // ── 프롬프트 생성 ────────────────────────────────────────────────
    const { system, userMessage } = buildLoopReadingUserPrompt({
      loopType,
      loopTitle,
      context: {
        freeInput: context.freeInput,
        stateSummary: context.stateSummary ?? [],
        sceneInsights: context.sceneInsights ?? [],
      },
    });

    const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

    console.log(
      `[loop-reading] session=${session_id} loopType=${loopType} insights=${context.sceneInsights?.length ?? 0}개`,
    );

    // ── Claude 호출 ──────────────────────────────────────────────────
    const response = await anthropic.messages.create({
      model,
      max_tokens: 2000,
      system,
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    if (!rawText) {
      throw new Error("Claude 응답이 비어있습니다");
    }

    console.log(`[loop-reading] Claude 응답 길이: ${rawText.length}`);

    // ── 파싱 및 응답 조립 ────────────────────────────────────────────
    const rawResult = parseLoopResult(rawText);

    const answer: LoopAnswer = {
      loopType,
      title: loopTitle,
      generatedAt: new Date().toISOString(),
      messages: rawResult.messages.map((m) => ({
        type: m.type,
        text: m.text,
      })),
    };

    // TODO: [백엔드 연동] Supabase loop_answers 테이블에 저장
    return NextResponse.json(answer satisfies LoopReadingResponseBody, {
      status: 200,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";

    console.error(`[loop-reading] session=${session_id} error:`, message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
