"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types/user";

interface ProfileSectionProps {
  profile: UserProfile;
}

const getSocialProviderIcon = (provider: string): string => {
  const icons: Record<string, string> = {
    google: "G",
    kakao: "K",
  };
  return icons[provider] || "?";
};

const ProfileSection = ({ profile }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSaveNickname = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해줘");
      return;
    }

    if (nickname === profile.nickname) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      // TODO: [백엔드 연동] PATCH /api/profiles/me { nickname } 호출
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsEditing(false);
      setError("");
    } catch {
      setError("닉네임 수정 중 오류가 발생했어");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mb-8">
      <div className="rounded-lg border border-surface/20 bg-surface/15 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* 소셜 아이콘 */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/25 text-base font-bold text-accent">
              {getSocialProviderIcon(profile.social_provider)}
            </div>

            {/* 프로필 정보 */}
            <div className="min-w-0 flex-1">
              {!isEditing ? (
                <>
                  <p className="text-sm font-semibold text-highlight">
                    {nickname}
                  </p>
                  <p className="mt-0.5 text-xs text-highlight/60">{profile.email}</p>
                </>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setError("");
                    }}
                    className="w-full rounded border border-accent/30 bg-accent/5 px-2 py-1 text-sm text-highlight placeholder-highlight/30 focus:border-accent/50 focus:outline-none"
                    autoFocus
                  />
                  {error && <p className="text-xs text-accent/80">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNickname}
                      disabled={isSaving}
                      className="flex-1 rounded border border-accent/50 bg-accent/20 py-1 text-xs font-medium text-accent transition-all hover:bg-accent/30 disabled:opacity-50"
                    >
                      {isSaving ? "저장 중..." : "저장"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNickname(profile.nickname);
                        setError("");
                      }}
                      className="flex-1 rounded border border-surface/30 py-1 text-xs font-medium text-highlight/70 transition-colors hover:text-highlight"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 프로필 수정 버튼 */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="shrink-0 rounded px-2 py-1 text-xs text-accent/70 border border-accent/30 transition-all hover:bg-accent/10 hover:text-accent"
            >
              수정
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
