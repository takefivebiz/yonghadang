import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 로그인 | 코어로그',
  robots: { index: false, follow: false },
};

/**
 * PRD 7-1 관리자 로그인 전용 레이아웃.
 * 사이드바 없이 독립적으로 렌더링 (관리자 레이아웃 제외)
 */
const AdminLoginLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default AdminLoginLayout;
