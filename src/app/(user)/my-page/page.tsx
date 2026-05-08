import type { Metadata } from "next";
import MyPageContent from "@/components/my-page/my-page-content";
import { getCurrentUserProfile } from "@/lib/data/dummy-profiles";
import { getUserSessions } from "@/lib/data/dummy-sessions";

export const metadata: Metadata = {
  title: "마이페이지 — VEIL",
  description: "내 프로필과 지난 기록을 확인해요",
};

const MyPage = () => {
  // TODO: [백엔드 연동] 실제 사용자 정보와 세션 데이터로 교체
  const userId = "user-1";
  const profile = getCurrentUserProfile(userId);
  const sessions = getUserSessions(userId, null);

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-highlight/50">프로필을 찾을 수 없어</p>
      </div>
    );
  }

  return <MyPageContent profile={profile} sessions={sessions} />;
};

export default MyPage;
