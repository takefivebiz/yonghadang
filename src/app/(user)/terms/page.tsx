import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관 — 용하당",
  description: "용하당의 서비스 이용약관을 확인하세요.",
  openGraph: {
    title: "이용약관 — 용하당",
    description: "용하당의 서비스 이용약관을 확인하세요.",
  },
  robots: { index: true, follow: true },
};

/**
 * PRD 6-12.1 이용약관 페이지 (/terms)
 * - 정적 약관 콘텐츠
 * - 섹션별 구성
 */
const TermsPage = () => {
  const lastUpdated = "2026-04-19";

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <style>{`
        @keyframes authFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
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
        style={{
          animation: "authFadeIn 0.6s ease-out forwards",
          opacity: 0,
        }}
      >
        {/* 헤더 */}
        <header className="mb-12 text-center">
          <h1 className="font-display text-3xl font-bold text-[#4A3B5C] mb-3">
            이용약관
          </h1>
          <p className="text-sm text-[#4A3B5C]/60">
            마지막 수정일: {lastUpdated}
          </p>
        </header>

        {/* 약관 본문 */}
        <article className="space-y-8">
          {/* 제1조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제1조 목적
            </h2>
            <p className="text-sm leading-relaxed text-[#4A4B5C]/80">
              이 약관은 용하당(이하 &quot;회사&quot;)이 제공하는 AI 기반 개인
              분석 및 해석 서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차,
              이용자의 권리와 의무, 회사의 책임 제한 등에 관한 사항을
              규정합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제2조 약관의 효력 및 변경
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>
                1. 본 약관은 이용자가 서비스에 접속하는 시점에 효력이
                발생합니다.
              </p>
              <p>
                2. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은
                공지 후 30일 경과 시점부터 효력을 발생합니다.
              </p>
              <p>
                3. 이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을
                중단할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제3조 서비스 이용
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>
                1. 이용자는 회사가 정한 절차에 따라 서비스에 가입하고 이용할 수
                있습니다.
              </p>
              <p>
                2. 회원과 비회원 모두 서비스를 이용할 수 있으며, 각각의 이용
                범위는 회사에서 정합니다.
              </p>
              <p>
                3. 이용자는 자신의 계정 정보를 정확하게 유지할 책임이 있습니다.
              </p>
            </div>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제4조 금지 행위
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              이용자는 다음과 같은 행위를 해서는 안 됩니다:
            </p>
            <ul className="space-y-2 text-sm leading-relaxed text-[#4A3B5C]/80 ml-4">
              <li>• 불법적인 내용의 입력 또는 전송</li>
              <li>• 타인의 개인정보 도용</li>
              <li>• 서비스 시스템을 해킹하거나 방해하는 행위</li>
              <li>• 서비스 내용의 무단 복제, 배포</li>
              <li>• 성적인 내용, 폭력적인 내용의 입력</li>
              <li>• 상업적 목적으로의 무단 이용</li>
            </ul>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제5조 서비스 제공 및 중단
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>
                1. 회사는 안정적인 서비스 제공을 위해 노력하며, 필요시 사전 공지
                후 서비스 운영을 일시 중단할 수 있습니다.
              </p>
              <p>
                2. 이용자의 이용약관 위반 또는 부정한 이용이 적발된 경우, 회사는
                사전 통보 없이 서비스 이용을 제한할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제6조 AI 생성 콘텐츠에 대한 책임
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-[#4A3B5C]/80">
              <p>
                1. 회사가 제공하는 AI 분석 결과는 참고 자료이며, 의학적,
                심리학적, 법적 진단을 대체하지 않습니다.
              </p>
              <p>
                2. AI가 생성한 콘텐츠의 정확성, 완전성, 유용성에 대해 회사는
                책임을 지지 않습니다.
              </p>
              <p>
                3. 이용자는 AI 분석 결과에 의존하여 발생한 손해에 대해 회사에
                이의를 제기할 수 없습니다.
              </p>
            </div>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제7조 이용약관에 동의
            </h2>
            <p className="text-sm leading-relaxed text-[#4A3B5C]/80">
              이용자가 서비스에 로그인하거나 회원가입을 완료한 경우, 본
              이용약관에 동의한 것으로 간주합니다.
            </p>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="font-display text-lg font-bold text-[#4A3B5C] mb-3">
              제8조 문의 및 분쟁 해결
            </h2>
            <p className="text-sm leading-relaxed text-[#4A3B5C]/80">
              본 약관에 대한 의문이 있거나 분쟁이 발생한 경우, 고객 문의를 통해
              해결하실 수 있습니다.
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

export default TermsPage;
