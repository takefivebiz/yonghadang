// TODO: [백엔드 연동] 비회원 인증 정보는 실제 해시된 값으로 서버에서 관리
// 클라이언트에서는 전화번호+PIN 입력 후 POST /api/guest/verify 호출

// 서버 테스트용 더미 데이터 (프로덕션에서는 사용 금지)
export const DUMMY_GUEST_CREDENTIALS = {
  // 테스트 계정: 010-1234-5678 / PIN: 1234
  "01012345678": {
    id: "guest-1",
    phone_hash: "test_hash_01012345678", // 실제로는 SHA256 해시
    pin_hash: "test_hash_pin_1234", // 실제로는 bcrypt 해시
    created_at: "2026-04-15T10:00:00Z",
  },
  // 테스트 계정: 010-9876-5432 / PIN: 5678
  "01098765432": {
    id: "guest-2",
    phone_hash: "test_hash_01098765432",
    pin_hash: "test_hash_pin_5678",
    created_at: "2026-03-20T15:30:00Z",
  },
};

// 클라이언트에서 비회원 조회 요청을 위한 더미 함수
export const simulateGuestVerification = (phoneNumber: string, pin: string): { success: boolean; guest_id?: string } => {
  // 서버에서 제공한 응답을 시뮬레이션
  // 실제로는 POST /api/guest/verify로 요청
  if (phoneNumber === "01012345678" && pin === "1234") {
    return { success: true, guest_id: "guest-1" };
  }
  if (phoneNumber === "01098765432" && pin === "5678") {
    return { success: true, guest_id: "guest-2" };
  }
  return { success: false };
};
