import Link from "next/link";
import { MobileDrawer } from "./mobile-drawer";
import { HeaderAuthNav } from "./header-auth-nav";

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
          <HeaderAuthNav />
        </nav>

        {/* 모바일 햄버거 메뉴 (md 미만) */}
        <div className="md:hidden">
          <MobileDrawer />
        </div>
      </div>
    </header>
  );
};
