import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 코어로그",
  description: "코어로그의 개인정보처리방침을 확인하세요.",
  openGraph: {
    title: "개인정보처리방침 — 코어로그",
    description: "코어로그의 개인정보처리방침을 확인하세요.",
  },
  robots: { index: true, follow: true },
};

/**
 * PRD 6-12.2 개인정보처리방침 페이지 (/privacy)
 * - 정적 개인정보처리방침 콘텐츠
 * - 섹션별 구성
 */
const PrivacyPage = () => {
  const lastUpdated = "2026-04-19";

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      {/* ── 배경 — 파스텔 라벤더 그라디언트 ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 55%, #F5F0E8 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#E8D4F0", opacity: 0.35 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-72 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "#F5D7E8", opacity: 0.3 }}
      />

      <div
        className="relative z-10 mx-auto max-w-2xl px-4 py-12"
        style={{ animation: "authFadeIn 0.6s ease-out" }}
      >
        {/* 헤더 */}
        <header className="mb-12 text-center">
          <h1 className="font-display text-3xl font-bold text-[#4A3B5C] mb-2">
            개인정보처리방침
          </h1>
          <p className="text-sm text-[#4A3B5C]/60">
            마지막 수정일: {lastUpdated}
          </p>
        </header>

        {/* 방침 본문 */}
        <article className="space-y-8">
          {/* 제1조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제1조 수집하는 개인정보
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p className="font-medium">
                서비스 제공을 위해 수집하는 정보는 다음과 같습니다:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• 필수: 이메일, 닉네임 (회원가입)</li>
                <li>• 필수: 휴대폰번호, 비밀번호 (비회원 결제)</li>
                <li>• 선택: 생년월일, 성별, 태어난 시간 (서비스 분석)</li>
                <li>• 자동 수집: IP 주소, 접속 기록, 서비스 이용 기록</li>
              </ul>
            </div>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제2조 수집한 정보의 이용
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>회사는 수집한 개인정보를 다음의 목적으로만 이용합니다:</p>
              <ul className="space-y-2 ml-4">
                <li>• 서비스 제공 및 회원관리</li>
                <li>• 결제 처리 및 주문 관리</li>
                <li>• AI 분석 리포트 생성</li>
                <li>• 고객 서비스 및 문의 대응</li>
                <li>• 서비스 개선 및 통계 분석</li>
                <li>• 법적 의무 이행</li>
              </ul>
            </div>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제3조 정보의 보보호
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>
                회사는 개인정보를 안전하게 보호하기 위해 다음의 조치를 취합니다:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• SSL 암호화를 통한 데이터 전송 보호</li>
                <li>• 비밀번호는 암호화하여 저장</li>
                <li>• 접근 권한 제한 및 직원 교육</li>
                <li>• 정기적인 보안 감시 및 점검</li>
              </ul>
            </div>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제4조 정보 보유 및 삭제
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>
                1. 개인정보는 이용 목적 달성 후 지체 없이 파기합니다. 단, 법령에서 요구하는 경우 일정 기간 보관할 수 있습니다.
              </p>
              <p>
                2. 회원은 언제든지 계정 삭제를 요청할 수 있으며, 이 경우 개인정보는 즉시 삭제됩니다. 단, 결제 기록은 법적 의무로 인해 보관될 수 있습니다.
              </p>
            </div>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제5조 정보 제3자 제공
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>
                회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우는 예외입니다:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• 법원의 요청 또는 법적 의무</li>
                <li>• 결제 처리를 위한 결제 대행사</li>
                <li>• 이용자의 명시적 동의</li>
              </ul>
            </div>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제6조 쿠키 및 추적 기술
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>
                회사는 사용자 경험 개선을 위해 쿠키 및 유사 기술을 사용합니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 서비스 이용에 제한이 있을 수 있습니다.
              </p>
            </div>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제7조 이용자의 권리
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>이용자는 다음의 권리를 가집니다:</p>
              <ul className="space-y-2 ml-4">
                <li>• 자신의 개인정보 조회, 수정 권리</li>
                <li>• 개인정보 처리 거부 권리</li>
                <li>• 개인정보 삭제 요청 권리</li>
                <li>• 개인정보 이전 요청 권리</li>
              </ul>
            </div>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제8조 문의 및 불만 처리
            </h2>
            <p className="text-sm leading-relaxed text-[#4A3B5C]/80">
              개인정보 처리와 관련된 불만이나 권리 침해는 아래의 문의 채널을 통해 신고할 수 있습니다.
            </p>
          </section>

          {/* 제9조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제9조 정책 변경
            </h2>
            <p className="text-sm leading-relaxed text-[#4A3B5C]/80">
              본 개인정보처리방침은 관련 법령 및 회사 정책에 따라 변경될 수 있으며, 변경 사항은 홈페이지를 통해 공지됩니다.
            </p>
          </section>
        </article>

        {/* 하단 버튼 */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: "#4A3B5C",
              color: "#F5F0E8",
              boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
            }}
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
