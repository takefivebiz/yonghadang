import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Answer } from "@/lib/types/analyze";
import type { ResultScene, SceneMessage } from "@/lib/types/result";

// ── DB row 타입 ──────────────────────────────────────────────────────────
interface GuestCredentialRow {
  id: string;
  pin_hash: string;
}

interface ContentInfo {
  slug: string;
  title: string;
  category: string;
}

interface SessionRow {
  id: string;
  created_at: string;
  contents: ContentInfo | null;
}

interface AnswerRow {
  session_id: string;
  step_id: string;
  question_text: string;
  answer_text: string | null;
  answer_options: unknown;
}

interface SceneRow {
  session_id: string;
  scene_index: number;
  scene_title: string;
  messages: unknown;
  preview_messages: unknown;
  is_free: boolean;
}

interface UnlockRow {
  session_id: string;
  scene_index: number;
}

// ── API 응답 타입 ────────────────────────────────────────────────────────
export interface GuestSessionData {
  session_id: string;
  content_id: string;        // contents.slug (예: "love-1")
  content_title: string;
  content_category: string;
  created_at: string;
  free_input: string;
  answers: Answer[];
  scenes: ResultScene[];
  unlocked_scene_indexes: number[];
}

export interface GuestVerifyResponse {
  guest_id: string;
  sessions: GuestSessionData[];
}

// ── 유틸 ────────────────────────────────────────────────────────────────
const hashSHA256 = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

// ────────────────────────────────────────────────────────────────────────

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = (await req.json()) as { phone?: unknown; pin?: unknown };

    if (typeof body.phone !== "string" || typeof body.pin !== "string") {
      return NextResponse.json(
        { error: "전화번호와 비밀번호를 입력해줘" },
        { status: 400 },
      );
    }

    const phoneDigits = body.phone.replace(/\D/g, "");
    const pin = body.pin.trim();

    if (!/^\d{10,11}$/.test(phoneDigits)) {
      return NextResponse.json(
        { error: "전화번호 형식이 올바르지 않아" },
        { status: 400 },
      );
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "비밀번호는 4자리 숫자야" },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();
    const phoneHash = hashSHA256(phoneDigits);
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      null;

    // ── 브루트포스 방지: 10분 내 5회 이상 실패 시 차단 ──────────────────
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count: recentFailures } = await supabase
      .from("guest_lookup_attempts")
      .select("*", { count: "exact", head: true })
      .eq("phone_hash", phoneHash)
      .eq("is_success", false)
      .gte("attempted_at", tenMinutesAgo);

    if ((recentFailures ?? 0) >= 5) {
      return NextResponse.json(
        { error: "잠시 후 다시 시도해줘" },
        { status: 429 },
      );
    }

    // ── phone_hash로 guest_credentials 조회 ──────────────────────────
    const { data: credentialRaw, error: credError } = await supabase
      .from("guest_credentials")
      .select("id, pin_hash")
      .eq("phone_hash", phoneHash)
      .maybeSingle();

    const logAttempt = async (isSuccess: boolean): Promise<void> => {
      await supabase.from("guest_lookup_attempts").insert({
        phone_hash: phoneHash,
        ip_address: ip,
        is_success: isSuccess,
      });
    };

    if (credError || !credentialRaw) {
      await logAttempt(false);
      return NextResponse.json(
        { error: "전화번호 또는 비밀번호가 일치하지 않아" },
        { status: 401 },
      );
    }

    const credential = credentialRaw as GuestCredentialRow;

    // ── PIN 검증 (bcrypt) ─────────────────────────────────────────────
    const isPinValid = await bcrypt.compare(pin, credential.pin_hash);
    if (!isPinValid) {
      await logAttempt(false);
      return NextResponse.json(
        { error: "전화번호 또는 비밀번호가 일치하지 않아" },
        { status: 401 },
      );
    }

    await logAttempt(true);

    const guestId = credential.id;

    // ── completed 세션 목록 조회 (contents join) ──────────────────────
    const { data: sessionRaws, error: sessionError } = await supabase
      .from("analysis_sessions")
      .select("id, created_at, contents(slug, title, category)")
      .eq("guest_id", guestId)
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    if (sessionError) {
      console.error("[POST /api/guest/verify] 세션 조회 실패:", sessionError);
      return NextResponse.json(
        { error: "오류가 발생했어. 다시 시도해줘" },
        { status: 500 },
      );
    }

    if (!sessionRaws || sessionRaws.length === 0) {
      return NextResponse.json(
        { guest_id: guestId, sessions: [] },
        { status: 200 },
      );
    }

    const sessions = sessionRaws as unknown as SessionRow[];
    const sessionIds = sessions.map((s) => s.id);

    // ── answers / scenes / unlocks 병렬 조회 ─────────────────────────
    const [answersRes, scenesRes, unlocksRes] = await Promise.all([
      supabase
        .from("session_answers")
        .select("session_id, step_id, question_text, answer_text, answer_options")
        .in("session_id", sessionIds)
        .order("created_at", { ascending: true }),
      supabase
        .from("result_scenes")
        .select(
          "session_id, scene_index, scene_title, messages, preview_messages, is_free",
        )
        .in("session_id", sessionIds)
        .eq("status", "completed")
        .order("scene_index", { ascending: true }),
      supabase
        .from("scene_unlocks")
        .select("session_id, scene_index")
        .in("session_id", sessionIds),
    ]);

    // ── 세션별 그룹핑 ────────────────────────────────────────────────
    const answersBySession: Record<string, Answer[]> = {};
    for (const row of (answersRes.data ?? []) as AnswerRow[]) {
      if (!answersBySession[row.session_id]) {
        answersBySession[row.session_id] = [];
      }
      answersBySession[row.session_id].push({
        step_id: row.step_id,
        question_text: row.question_text,
        ...(row.answer_text != null ? { answer_text: row.answer_text } : {}),
        ...(Array.isArray(row.answer_options)
          ? { answer_options: row.answer_options as string[] }
          : {}),
      });
    }

    const scenesBySession: Record<string, ResultScene[]> = {};
    for (const row of (scenesRes.data ?? []) as SceneRow[]) {
      if (!scenesBySession[row.session_id]) {
        scenesBySession[row.session_id] = [];
      }
      scenesBySession[row.session_id].push({
        id: `${row.session_id}-scene-${row.scene_index}`,
        scene_index: row.scene_index,
        scene_title: row.scene_title,
        is_free: row.is_free,
        is_unlocked: false,
        messages:
          Array.isArray(row.messages) && (row.messages as unknown[]).length > 0
            ? (row.messages as SceneMessage[])
            : null,
        preview_messages:
          Array.isArray(row.preview_messages) &&
          (row.preview_messages as unknown[]).length > 0
            ? (row.preview_messages as SceneMessage[])
            : null,
      });
    }

    const paidUnlocksBySession: Record<string, number[]> = {};
    for (const row of (unlocksRes.data ?? []) as UnlockRow[]) {
      if (!paidUnlocksBySession[row.session_id]) {
        paidUnlocksBySession[row.session_id] = [];
      }
      paidUnlocksBySession[row.session_id].push(row.scene_index);
    }

    // ── 최종 응답 조립 ────────────────────────────────────────────────
    const guestSessions: GuestSessionData[] = sessions
      .filter((s) => s.contents !== null)
      .map((s) => {
        const answers = answersBySession[s.id] ?? [];
        const freeInput =
          answers.find((a) => a.step_id === "free_input")?.answer_text ?? "";
        const allScenes = scenesBySession[s.id] ?? [];
        const paidUnlocked = paidUnlocksBySession[s.id] ?? [];
        const freeIndexes = allScenes
          .filter((sc) => sc.is_free)
          .map((sc) => sc.scene_index);
        const unlockedIndexes = [...new Set([...freeIndexes, ...paidUnlocked])];

        // 유료씬은 unlock된 것만 messages 포함 (미구매는 null 유지)
        const scenesWithAccess: ResultScene[] = allScenes.map((sc) => ({
          ...sc,
          messages:
            sc.is_free || paidUnlocked.includes(sc.scene_index)
              ? sc.messages
              : null,
        }));

        return {
          session_id: s.id,
          content_id: s.contents!.slug,
          content_title: s.contents!.title,
          content_category: s.contents!.category,
          created_at: s.created_at,
          free_input: freeInput,
          answers,
          scenes: scenesWithAccess,
          unlocked_scene_indexes: unlockedIndexes,
        };
      });

    return NextResponse.json(
      { guest_id: guestId, sessions: guestSessions },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
    console.error("[POST /api/guest/verify] 오류:", message);
    return NextResponse.json(
      { error: "오류가 발생했어. 다시 시도해줘" },
      { status: 500 },
    );
  }
};
