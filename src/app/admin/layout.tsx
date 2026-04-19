import { type Metadata } from "next";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { AdminMobileDrawer } from "@/components/admin/mobile-drawer";

export const metadata: Metadata = {
  title: "관리자 | 용하당",
  robots: { index: false, follow: false },
};

/**
 * PRD 7-0 관리자 공통 레이아웃.
 * - PC: 좌측 사이드바 네비게이션
 * - 모바일: 상단 헤더 + 드로어 메뉴
 *
 * TODO: [백엔드 연동] 미들웨어에서 관리자 세션 검증 후 미인증 시 /admin/login 리다이렉트
 */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background">
      {/* PC 사이드바 */}
      <div className="hidden md:flex">
        <SidebarNav />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 모바일 헤더 */}
        <header className="flex h-16 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
          <AdminMobileDrawer />
          <span className="font-display text-lg font-bold tracking-widest text-primary">
            용하당 관리
          </span>
        </header>

        {/* 페이지 본문 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
