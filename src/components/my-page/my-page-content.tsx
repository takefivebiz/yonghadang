"use client";

import { UserProfile } from "@/lib/types/user";
import { AnalysisSession } from "@/lib/types/session";
import ProfileSection from "./profile-section";
import SessionList from "./session-list";
import SettingsSection from "./settings-section";

interface MyPageContentProps {
  profile: UserProfile;
  sessions: AnalysisSession[];
}

const MyPageContent = ({ profile, sessions }: MyPageContentProps) => {
  return (
    <div className="flex min-h-[750px] items-start justify-center px-6 pt-17 pb-32">
      <div className="w-full max-w-sm">
        {/* 제목 */}
        <div className="mb-12 space-y-3 text-center">
          {/* 아이콘 */}
          <div className="mb-4 flex justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="16"
                cy="10"
                r="4"
                stroke="rgba(209, 109, 172, 0.7)"
                strokeWidth="1.5"
              />
              <path
                d="M 8 22 Q 8 18 16 18 Q 24 18 24 22 L 24 26 Q 24 27 23 27 L 9 27 Q 8 27 8 26 Z"
                stroke="rgba(209, 109, 172, 0.7)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold leading-tight">
            마이
            <span style={{ color: "#D16DAC" }}>페이지</span>
          </h1>
          <p className="text-sm text-highlight/60">
            지난 기록과 계정을 관리할 수 있어
          </p>
        </div>

        {/* 콘텐츠 */}
        <div className="space-y-8">
          <ProfileSection profile={profile} />
          <SessionList sessions={sessions} />
          <SettingsSection profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default MyPageContent;
