"use client";

import { UserProfile } from "@/lib/types/user";
import { SessionSummary } from "@/lib/types/session";
import ProfileSection from "./profile-section";
import SessionList from "./session-list";
import SettingsSection from "./settings-section";

interface MyPageContentProps {
  profile: UserProfile;
  sessions: SessionSummary[];
}

const MyPageContent = ({ profile, sessions }: MyPageContentProps) => {
  return (
    <div className="flex min-h-[750px] items-start justify-center px-6 pt-17 pb-32">
      <div className="w-full max-w-sm">
        {/* 제목 */}
        <div className="mb-12 space-y-3 text-center">
          {/* 아이콘 */}
          <div className="mb-2 flex justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5 11 Q 5 9 7 9 L 13 9 L 15 12 L 25 12 Q 27 12 27 14 L 27 24 Q 27 26 25 26 L 7 26 Q 5 26 5 24 Z"
                stroke="rgba(143, 122, 216, 0.7)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M 5 15 L 27 15"
                stroke="rgba(143, 122, 216, 0.38)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold leading-tight">
            의뢰
            <span style={{ color: "rgba(143, 122, 216, 0.9)" }}> 보관함</span>
          </h1>
          <p className="text-sm text-highlight/60">
            지난 기록과 다시 열어볼 파일을 모아뒀어
          </p>
        </div>

        {/* 콘텐츠 */}
        <div className="space-y-8">
          <ProfileSection profile={profile} />
          <SessionList sessions={sessions} />
          <SettingsSection />
        </div>
      </div>
    </div>
  );
};

export default MyPageContent;
