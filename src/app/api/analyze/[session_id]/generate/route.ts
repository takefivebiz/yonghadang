import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  buildFreeGeneratePrompt,
  buildPaidGeneratePrompt,
  parseClaudeResult,
  mapClaudeToResultScenes,
  ClaudeGeneratedResult,
  UserInputPayload,
  FreeSceneContext,
} from "@/lib/prompts/generate-result";
import { SceneConfig } from "@/lib/types/content";
import { ResultScene, SceneMessage } from "@/lib/types/result";

// TODO: [백엔드 연동] Supabase service_role 클라이언트로 세션·콘텐츠 조회로 교체

// ── 현재 상태: 실제 Claude 호출 (ANTHROPIC_API_KEY 필요)
// result 페이지는 아직 generateMockResultScenes()를 사용 중이며 이 route와 미연결 상태.
// 연결 순서:
//   1. result 페이지에서 localStorage 대신 이 API 호출로 교체
//   2. 응답의 result_scenes를 ResultScene[]로 사용
//   3. carry_over는 이미 result_scenes에서 제거되어 있으므로 프론트에 노출 없음

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateRequestBody {
  content_title: string;
  category: string;
  user_input: UserInputPayload;
  scene_config: SceneConfig;
  scene_indexes?: number[];  // 선택적: 특정 scenes만 생성. 기본값은 전체
  free_scene_context?: FreeSceneContext;  // 유료 scene 생성 시 필요: 무료 scene의 마지막 메시지
}

export interface GenerateResponseBody {
  session_id: string;
  /** 프론트 렌더링용: carry_over 제거, id/is_unlocked/preview_messages 포함 */
  result_scenes: ResultScene[];
  /** 개발·검수용: carry_over 포함 원본. 프론트에서 사용하지 않는다. */
  _debug_raw_result: ClaudeGeneratedResult;
}

/**
 * POST /api/analyze/[session_id]/generate
 * single Claude call로 전체 scene 결과를 생성한다.
 *
 * - 현재: 실제 Anthropic API 호출. ANTHROPIC_API_KEY 환경변수 필수.
 * - 응답의 result_scenes는 ResultScene[] 타입과 호환. 즉시 result 페이지에 연결 가능.
 * - _debug_raw_result는 개발 검수용이며 프론트에서 사용하지 않는다.
 */
export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> }
): Promise<NextResponse> => {
  const { session_id } = await params;

  // API key 없으면 요청이 올 때 즉시 에러 반환 (런타임 크래시 방지)
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요." },
      { status: 503 }
    );
  }

  try {
    const body = (await req.json()) as GenerateRequestBody;
    const { content_title, category, user_input, scene_config, scene_indexes, free_scene_context } = body;

    if (!content_title || !category || !user_input || !scene_config) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다 (content_title, category, user_input, scene_config)" },
        { status: 400 }
      );
    }

    if (!user_input.text?.trim()) {
      return NextResponse.json(
        { error: "사용자 입력 텍스트가 비어있습니다" },
        { status: 400 }
      );
    }

    if (!Array.isArray(scene_config.scenes) || scene_config.scenes.length === 0) {
      return NextResponse.json(
        { error: "scene_config.scenes가 비어있습니다" },
        { status: 400 }
      );
    }

    // scene_indexes가 있으면 유효성 검사 및 무료/유료 판단
    let sceneIndexesToUse = scene_indexes || scene_config.scenes.map(s => s.index);
    let hasAnyPaidScene = false;

    if (Array.isArray(sceneIndexesToUse)) {
      const validIndexes = scene_config.scenes.map(s => s.index);
      const invalidIndexes = sceneIndexesToUse.filter(i => !validIndexes.includes(i));
      if (invalidIndexes.length > 0) {
        return NextResponse.json(
          { error: `유효하지 않은 scene_index: ${invalidIndexes.join(", ")}` },
          { status: 400 }
        );
      }

      // 유료 scene이 있는지 확인
      hasAnyPaidScene = sceneIndexesToUse.some(idx => {
        const scene = scene_config.scenes.find(s => s.index === idx);
        return scene && !scene.is_free;
      });
    }

    // 유료 scene 생성 시 context 검증
    if (hasAnyPaidScene && !free_scene_context) {
      return NextResponse.json(
        { error: "유료 scene 생성 시 free_scene_context가 필수입니다" },
        { status: 400 }
      );
    }

    // 무료/유료 구분해서 prompt 생성
    let system: string;
    let userMessage: string;

    if (hasAnyPaidScene) {
      // 유료 scene 생성
      const promptResult = buildPaidGeneratePrompt({
        contentTitle: content_title,
        category,
        userInput: user_input,
        sceneConfig: scene_config,
        sceneIndexes: sceneIndexesToUse,
        freeSceneContext: free_scene_context!,
      });
      system = promptResult.system;
      userMessage = promptResult.userMessage;
    } else {
      // 무료 scene 생성
      const promptResult = buildFreeGeneratePrompt({
        contentTitle: content_title,
        category,
        userInput: user_input,
        sceneConfig: scene_config,
        sceneIndexes: sceneIndexesToUse,
      });
      system = promptResult.system;
      userMessage = promptResult.userMessage;
    }

    // 기본 모델: claude-sonnet-4-6 (ANTHROPIC_MODEL env로 오버라이드 가능)
    // scenes가 8개 이상이거나 품질 이슈 발생 시 claude-opus-4-7로 교체 검토.
    const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    if (!rawText) {
      throw new Error("Claude 응답이 비어있습니다");
    }

    console.log(`[generate] Claude 원본 응답 길이: ${rawText.length}`);
    console.log(`[generate] Claude 원본 응답 처음 500자:\n${rawText.slice(0, 500)}`);

    const rawResult = parseClaudeResult(rawText);

    // carry_over를 제거하고 ResultScene[]로 변환 (scene_config의 intro 포함)
    const result_scenes = mapClaudeToResultScenes(
      session_id,
      rawResult.scenes,
      scene_config
    );

    // TODO: [백엔드 연동] result_scenes를 Supabase scenes 테이블에 저장

    return NextResponse.json(
      {
        session_id,
        result_scenes,
        _debug_raw_result: rawResult,
      } satisfies GenerateResponseBody,
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";

    console.error(`[generate] session=${session_id} error:`, message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
