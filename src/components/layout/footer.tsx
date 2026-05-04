import Link from "next/link";

/**
 * 푸터 - 사업자 정보, 이용약관, 개인정보처리방침, 문의하기
 * Server Component: 정적 콘텐츠만 포함
 */
const Footer = () => {
  return (
    <footer className="border-t border-surface bg-background py-10 text-center">
      <div className="mx-auto max-w-screen-lg px-4">
        {/* 사업자 정보 */}
        {/* TODO: 실제 사업자 등록 정보로 교체 */}
        <div className="mb-6 space-y-1 text-xs text-highlight/40">
          <p>VEIL | 대표자: 홍길동</p>
          <p>사업자등록번호 : 00-00-00000</p>
          <p>통신판매업신고: 제2026-서울-0000호</p>
          <p>서울특별시 땡땡구 땡땡동 땡떙로 77</p>
        </div>

        {/* 링크 */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-highlight/40">
          <Link
            href="/terms"
            className="transition-colors hover:text-highlight/70"
          >
            이용약관
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-highlight/70"
          >
            개인정보처리방침
          </Link>
          {/* TODO: 실제 문의 이메일 또는 채널로 교체 */}
          <a
            href="mailto:contact@veil.app"
            className="transition-colors hover:text-highlight/70"
          >
            문의하기
          </a>
        </div>

        <p className="mt-6 text-xs text-highlight/20">
          © 2026 VEIL. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
