import Link from 'next/link';

export const Footer = () => {
  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: "rgba(27, 0, 63, 0.5)",
        borderTopColor: "rgba(230, 230, 250, 0.1)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* 링크 메뉴 */}
        <nav className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm" style={{ color: "rgba(212, 197, 226, 0.8)" }}>
          <Link href="/terms" className="transition-colors hover:text-white">
            이용약관
          </Link>
          <Link href="/privacy" className="font-medium transition-colors hover:text-white">
            개인정보처리방침
          </Link>
          <Link href="/contact" className="transition-colors hover:text-white">
            문의하기
          </Link>
        </nav>

        {/* 사업자 정보 */}
        {/* TODO: [백엔드 연동] 실제 사업자 정보로 교체 */}
        <div className="text-center text-xs leading-relaxed" style={{ color: "rgba(184, 168, 216, 0.6)" }}>
          <p>상호명: 코어로그 | 대표자: 홍길동 | 사업자등록번호: 000-00-00000</p>
          <p>주소: 서울특별시 강남구 테헤란로 000</p>
          <p className="mt-2">© {new Date().getFullYear()} Corelog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
