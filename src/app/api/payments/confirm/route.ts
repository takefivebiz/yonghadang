import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSceneConfig } from "@/lib/data/scene-configs";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── DB row 타입 ──────────────────────────────────────────────────────────
interface GuestCredentialRow {
  id: string;
  pin_hash: string;
}

interface SessionRow {
  id: string;
  guest_id: string | null;
  contents: { slug: string } | null;
}

interface OrderRow {
  id: string;
  status: string;
}

interface UnlockRow {
  scene_index: number;
}

// ── 요청 body 타입 ────────────────────────────────────────────────────────
interface ConfirmBody {
  payment_key: string;
  order_id: string;
  amount: number;
  session_id: string;
  payment_type: "single" | "all";
  scene_index?: number;
  guest_phone: string;
  guest_pin: string;
}

// ── 응답 타입 ─────────────────────────────────────────────────────────────
interface ConfirmResponse {
  unlocked_scene_indexes: number[];
}

const hashSHA256 = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

/**
 * POST /api/payments/confirm
 * 비회원 결제 성공 확인 및 DB 저장.
 * Toss 실제 서버 검증은 수행하지 않음 (mock phase).
 *
 * - guest_credentials UPSERT (phone_hash 기준, 기존 있으면 PIN 검증)
 * - analysis_sessions.guest_id 연결 (null인 경우에만 UPDATE)
 * - orders INSERT (ON CONFLICT id → 업데이트, 멱등)
 * - scene_unlocks INSERT (ON CONFLICT session_id+scene_index → 무시, 멱등)
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = (await req.json()) as Partial<ConfirmBody>;

    const {
      payment_key,
      order_id,
      amount,
      session_id,
      payment_type,
      scene_index,
      guest_phone,
      guest_pin,
    } = body;

    // ── 입력 검증 ──────────────────────────────────────────────────────────
    if (
      !payment_key ||
      !order_id ||
      !amount ||
      !session_id ||
      !payment_type ||
      !guest_phone ||
      !guest_pin
    ) {
      return NextResponse.json(
        { error: "필수 파라미터가 없어" },
        { status: 400 },
      );
    }

    if (!UUID_REGEX.test(session_id)) {
      return NextResponse.json(
        { error: "유효하지 않은 session_id" },
        { status: 400 },
      );
    }

    if (payment_type !== "single" && payment_type !== "all") {
      return NextResponse.json(
        { error: "유효하지 않은 payment_type" },
        { status: 400 },
      );
    }

    if (payment_type === "single" && (!scene_index || scene_index < 1)) {
      return NextResponse.json(
        { error: "single 구매는 scene_index가 필요해" },
        { status: 400 },
      );
    }

    const phoneDigits = guest_phone.replace(/\D/g, "");
    if (!/^\d{10,11}$/.test(phoneDigits)) {
      return NextResponse.json(
        { error: "전화번호 형식이 올바르지 않아" },
        { status: 400 },
      );
    }

    if (!/^\d{4}$/.test(guest_pin)) {
      return NextResponse.json(
        { error: "비밀번호는 4자리 숫자야" },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();

    // ── 1. 세션 존재 확인 ──────────────────────────────────────────────────
    const { data: sessionRaw, error: sessionError } = await supabase
      .from("analysis_sessions")
      .select("id, guest_id, contents(slug)")
      .eq("id", session_id)
      .maybeSingle();

    if (sessionError || !sessionRaw) {
      return NextResponse.json(
        { error: "세션을 찾을 수 없어" },
        { status: 404 },
      );
    }

    const session = sessionRaw as unknown as SessionRow;
    const contentSlug = session.contents?.slug;

    if (!contentSlug) {
      return NextResponse.json(
        { error: "콘텐츠 정보를 찾을 수 없어" },
        { status: 404 },
      );
    }

    // ── 2. 멱등 처리: 이미 paid 주문이면 기존 unlocks 반환 ────────────────
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", order_id)
      .maybeSingle();

    if (existingOrder && (existingOrder as OrderRow).status === "paid") {
      const { data: existingUnlocks } = await supabase
        .from("scene_unlocks")
        .select("scene_index")
        .eq("session_id", session_id)
        .eq("order_id", order_id);

      const unlocked = (existingUnlocks ?? []).map(
        (u) => (u as UnlockRow).scene_index,
      );
      return NextResponse.json(
        { unlocked_scene_indexes: unlocked } satisfies ConfirmResponse,
        { status: 200 },
      );
    }

    // ── 3. guest_credentials UPSERT ──────────────────────────────────────
    // 기존 credential이 있으면 PIN 검증, 없으면 새로 생성
    const phoneHash = hashSHA256(phoneDigits);

    const { data: existingCred } = await supabase
      .from("guest_credentials")
      .select("id, pin_hash")
      .eq("phone_hash", phoneHash)
      .maybeSingle();

    let guestId: string;

    if (existingCred) {
      const cred = existingCred as GuestCredentialRow;
      const isPinValid = await bcrypt.compare(guest_pin, cred.pin_hash);
      if (!isPinValid) {
        return NextResponse.json(
          {
            error:
              "이 전화번호에 연결된 비밀번호가 달라. 이전에 사용한 비밀번호를 입력해줘",
          },
          { status: 401 },
        );
      }
      guestId = cred.id;
    } else {
      const pinHash = await bcrypt.hash(guest_pin, 10);
      const { data: newCred, error: credError } = await supabase
        .from("guest_credentials")
        .insert({ phone_hash: phoneHash, pin_hash: pinHash })
        .select("id")
        .single();

      if (credError || !newCred) {
        console.error("[confirm] guest_credentials 생성 실패:", credError);
        return NextResponse.json(
          { error: "계정 생성에 실패했어" },
          { status: 500 },
        );
      }
      guestId = (newCred as { id: string }).id;
    }

    // ── 4. analysis_sessions.guest_id 연결 (null인 경우에만) ─────────────
    if (!session.guest_id) {
      const { error: updateError } = await supabase
        .from("analysis_sessions")
        .update({ guest_id: guestId })
        .eq("id", session_id)
        .is("guest_id", null);

      if (updateError) {
        // 비치명적: 계속 진행 (이미 다른 guest_id로 연결됐을 수 있음)
        console.warn(
          "[confirm] analysis_sessions.guest_id 업데이트 실패:",
          updateError,
        );
      }
    }

    // ── 5. unlock 대상 scene_indexes 결정 ───────────────────────────────
    let sceneIndexesToUnlock: number[];

    if (payment_type === "single") {
      sceneIndexesToUnlock = [scene_index!];
    } else {
      const sceneConfig = getSceneConfig(contentSlug);
      sceneIndexesToUnlock = sceneConfig.scenes
        .filter((s) => !s.is_free)
        .map((s) => s.index);
    }

    // ── 6. orders UPSERT ─────────────────────────────────────────────────
    // 이미 pending 상태인 row가 있으면 paid로 업데이트, 없으면 새로 생성
    const { error: orderError } = await supabase.from("orders").upsert(
      {
        id: order_id,
        session_id,
        guest_id: guestId,
        purchase_type: payment_type,
        target_scene_index: payment_type === "single" ? (scene_index ?? null) : null,
        amount,
        status: "paid",
        toss_payment_key: payment_key,
        paid_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (orderError) {
      console.error("[confirm] orders upsert 실패:", orderError);
      return NextResponse.json(
        { error: "주문 기록에 실패했어" },
        { status: 500 },
      );
    }

    // ── 7. scene_unlocks INSERT (멱등) ──────────────────────────────────
    const unlockRows = sceneIndexesToUnlock.map((idx) => ({
      session_id,
      scene_index: idx,
      order_id,
    }));

    const { error: unlockError } = await supabase
      .from("scene_unlocks")
      .upsert(unlockRows, {
        onConflict: "session_id,scene_index",
        ignoreDuplicates: true,
      });

    if (unlockError) {
      console.error("[confirm] scene_unlocks upsert 실패:", unlockError);
      return NextResponse.json(
        { error: "잠금 해제 기록에 실패했어" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { unlocked_scene_indexes: sceneIndexesToUnlock } satisfies ConfirmResponse,
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
    console.error("[POST /api/payments/confirm] 오류:", message);
    return NextResponse.json(
      { error: "결제 확인 처리 중 오류가 발생했어" },
      { status: 500 },
    );
  }
};
