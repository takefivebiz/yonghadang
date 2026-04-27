import { type Metadata } from "next";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { AdminMobileDrawer } from "@/components/admin/mobile-drawer";

export const metadata: Metadata = {
  title: "관리자 | 코어로그",
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
    <div
      className="flex h-screen"
      style={{
        background: "linear-gradient(135deg, #0F0420 0%, #1A0B3F 100%)",
      }}
    >
      {/* 배경 장식 - blur 요소 */}
      <div
        className="pointer-events-none fixed top-1/4 left-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#6495ED", opacity: 0.1 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-1/3 right-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#A366FF", opacity: 0.12 }}
        aria-hidden="true"
      />

      {/* PC 사이드바 */}
      <div className="hidden md:flex relative z-10">
        <SidebarNav />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col relative z-10 min-w-0">
        {/* 모바일 헤더 */}
        <header
          className="flex h-16 items-center gap-3 px-4 md:hidden"
          style={{
            borderBottom: "1px solid rgba(230, 230, 250, 0.15)",
            background: "rgba(27, 0, 63, 0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <AdminMobileDrawer />
          <span
            className="font-display text-lg font-bold tracking-widest"
            style={{ color: "#F0E6FA" }}
          >
            코어로그 관리
          </span>
        </header>

        {/* 페이지 본문 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
