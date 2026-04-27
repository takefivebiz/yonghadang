'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { isMemberLoggedIn } from '@/lib/report-access';

const TABS = [
  { id: 'dashboard', label: '대시보드', href: '/my-page' },
  { id: 'reports', label: '내 리포트', href: '/my-page/reports' },
  { id: 'orders', label: '구매 내역', href: '/my-page/orders' },
  { id: 'settings', label: '설정', href: '/my-page/settings' },
];

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  // 미로그인 시 /auth로 리다이렉트 (모든 my-page 하위 페이지 공통 가드)
  useEffect(() => {
    if (!isMemberLoggedIn()) {
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  const activeTab = useMemo(() => {
    if (pathname === '/my-page') return 'dashboard';
    if (pathname === '/my-page/reports') return 'reports';
    if (pathname === '/my-page/orders') return 'orders';
    if (pathname === '/my-page/settings') return 'settings';
    return 'dashboard';
  }, [pathname]);

  return (
    <div
      className="relative min-h-screen"
      style={{
        background: "linear-gradient(135deg, #1B003F 0%, #4B0082 25%, #191970 50%, #4B0082 75%, #6B2E8F 100%)",
      }}
    >
      <div className="relative z-10">
        {/* 탭 네비게이션 */}
        <div
          className="sticky top-0 z-20 border-b backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(27, 0, 63, 0.85)",
            borderBottomColor: "rgba(230, 230, 250, 0.1)",
          }}
        >
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex gap-2 overflow-x-auto md:gap-6">
              {TABS.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-medium transition-colors md:text-base ${
                    activeTab === tab.id
                      ? ''
                      : 'text-foreground/60 hover:text-foreground/80'
                  }`}
                  style={{
                    borderBottomColor: activeTab === tab.id ? "#BEAEDB" : "transparent",
                    color: activeTab === tab.id ? "#F0E6FA" : "#D4C5E2",
                  }}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">{children}</div>
      </div>
    </div>
  );
};

export default MyPageLayout;
