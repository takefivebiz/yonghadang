import Link from "next/link";
import { MobileDrawer } from "./mobile-drawer";

/**
 * TODO: [백엔드 연동] Supabase 세션을 읽어 isLoggedIn 상태를 실제 값으로 교체
 * 현재는 비회원 상태(false)로 고정
 */
const isLoggedIn = false;

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* 로고 */}
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-widest text-primary"
        >
          용하당
        </Link>

        {/* 데스크톱 메뉴 (md 이상) */}
        <nav className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <Link
              href="/my-page"
              className="rounded-md px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              마이페이지
            </Link>
          ) : (
            <>
              <Link
                href="/guest-login"
                className="rounded-md px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                비회원 주문 조회
              </Link>
              <Link
                href="/auth"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                로그인
              </Link>
            </>
          )}
        </nav>

        {/* 모바일 햄버거 메뉴 (md 미만) */}
        <div className="md:hidden">
          <MobileDrawer isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
};
