import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* 링크 메뉴 */}
        <nav className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground/60">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            이용약관
          </Link>
          <Link href="/privacy" className="font-medium transition-colors hover:text-foreground">
            개인정보처리방침
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            문의하기
          </Link>
        </nav>

        {/* 사업자 정보 */}
        {/* TODO: [백엔드 연동] 실제 사업자 정보로 교체 */}
        <div className="text-center text-xs leading-relaxed text-foreground/40">
          <p>상호명: 용하당 | 대표자: 홍길동 | 사업자등록번호: 000-00-00000</p>
          <p>주소: 서울특별시 강남구 테헤란로 000</p>
          <p className="mt-2">© {new Date().getFullYear()} 용하당. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
