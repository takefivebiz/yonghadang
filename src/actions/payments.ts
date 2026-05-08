"use server";

import {
  PaymentConfirmRequest,
  PaymentConfirmResponse,
} from "@/lib/types/payment";

/**
 * 결제 승인 및 검증 (Server Action)
 * TODO: [백엔드 연동] Toss Payments API 호출 및 DB 저장 구현
 *
 * 단계:
 * 1. Toss Payments API로 결제 검증 (payment_key + order_id + amount)
 * 2. 검증 성공 시 purchases 테이블에 기록
 * 3. purchase_type이 'all'이면 모든 유료 scene unlock, 'single'이면 해당 scene만 unlock
 * 4. 클라이언트로 unlock된 scene_index 배열 반환
 */
export async function confirmPayment(
  request: PaymentConfirmRequest,
): Promise<PaymentConfirmResponse> {
  try {
    // TODO: [백엔드 연동] payment_key, order_id, amount 사용하여 Toss API 호출
    void request;

    // TODO: [Toss API] Toss Payments 결제 승인 API 호출
    // POST https://api.tosspayments.com/v1/payments/confirm
    // Authorization: Basic base64(secretKey:)
    // Body: { orderId, amount, paymentKey }

    // TODO: [DB] Supabase purchases 테이블에 기록
    // INSERT INTO purchases (session_id, purchase_type, scene_id, amount, order_id, payment_key, purchased_at)
    // VALUES (...)

    // 현재는 mock: 모든 유료 scene을 unlock된 것으로 반환 (인덱스 2, 3, 4, 5, 6)
    const unlockedSceneIndexes = [2, 3, 4, 5, 6];

    return {
      unlocked_scene_indexes: unlockedSceneIndexes,
    };
  } catch (error) {
    console.error("결제 승인 실패:", error);
    throw new Error("결제 처리에 실패했어요. 다시 시도해주세요.");
  }
}
