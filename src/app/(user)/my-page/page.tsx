import { type Metadata } from "next";
import { MyPageDashboardClient } from "./_components/my-page-client";

export const metadata: Metadata = {
  title: "대시보드 | 코어로그",
  description: "내 리포트 및 분석 내역을 확인하세요.",
  robots: { index: false, follow: false },
};

const DashboardPage = () => {
  return <MyPageDashboardClient />;
};

export default DashboardPage;
