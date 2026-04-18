"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MemberProfile } from "@/types/member";
import { logoutMember, updateMemberProfile } from "@/lib/report-access";
import { SocialBadge } from "./social-badge";

interface ProfileCardProps {
  profile: MemberProfile;
  onProfileChange: (next: MemberProfile) => void;
}

/**
 * PRD 6-7 마이페이지 프로필 카드.
 * - 닉네임 인라인 수정 (빈값/공백 차단)
 * - 이메일 + 소셜 로그인 뱃지
 * - 로그아웃 버튼
 *
 * TODO: [백엔드 연동] updateMemberProfile → PATCH /api/me, logoutMember → POST /api/auth/logout
 */
export const ProfileCard = ({ profile, onProfileChange }: ProfileCardProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draftNickname, setDraftNickname] = useState(profile.nickname);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = draftNickname.trim();
    if (!trimmed) {
      setError("닉네임을 입력해주세요");
      return;
    }
    if (trimmed.length > 16) {
      setError("닉네임은 16자 이내로 입력해주세요");
      return;
    }

    const next = updateMemberProfile({ nickname: trimmed });
    if (!next) {
      setError("프로필 수정에 실패했어요. 다시 로그인해주세요");
      return;
    }
    onProfileChange(next);
    setEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setDraftNickname(profile.nickname);
    setError(null);
    setEditing(false);
  };

  const handleLogout = () => {
    logoutMember();
    router.replace("/");
  };

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-[#E8D4F0] bg-white px-6 py-7 shadow-sm"
      style={{
        background:
          "linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 55%, #F9F2FB 100%)",
      }}
    >
      {/* 신비로운 장식 — 우측 상단 나선/별 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 text-6xl opacity-10"
      >
        ✦
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        {/* 아바타 */}
        <div
          className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-3xl shadow-inner"
          style={{
            background:
              "linear-gradient(135deg, #E8D4F0 0%, #F5D7E8 55%, #D4A5A5 100%)",
            color: "#4A3B5C",
          }}
          aria-hidden="true"
        >
          🌙
          <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-1 text-sm shadow-md">
            ✦
          </span>
        </div>

        <div className="flex-1">
          {/* 닉네임 + 수정 */}
          {!editing ? (
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-[#4A3B5C]">
                {profile.nickname}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-full border border-[#E8D4F0] bg-white px-3 py-1 text-xs text-[#9B88AC] transition-all duration-200 hover:border-[#4A3B5C] hover:text-[#4A3B5C]"
                aria-label="닉네임 수정"
              >
                ✎ 수정
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={draftNickname}
                  onChange={(e) => setDraftNickname(e.target.value)}
                  maxLength={16}
                  autoFocus
                  className="w-full max-w-xs rounded-xl border border-[#E8D4F0] bg-white px-3 py-2 text-base font-semibold text-[#4A3B5C] outline-none transition-colors focus:border-[#4A3B5C]"
                  placeholder="닉네임"
                  aria-label="닉네임 입력"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    backgroundColor: "#4A3B5C",
                    color: "#F5F0E8",
                  }}
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-full border border-[#E8D4F0] bg-white px-3 py-2 text-xs text-[#9B88AC] transition-colors hover:text-[#4A3B5C]"
                >
                  취소
                </button>
              </div>
              {error && (
                <p className="text-xs text-[#D4475A]" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* 이메일 + 소셜 뱃지 */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <SocialBadge provider={profile.provider} />
            <span className="text-sm text-[#4A3B5C]/70 break-all">
              {profile.email}
            </span>
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#E8D4F0] bg-white px-4 py-2 text-sm font-medium text-[#4A3B5C]/70 transition-all duration-200 hover:border-[#4A3B5C] hover:text-[#4A3B5C]"
          >
            로그아웃
          </button>
        </div>
      </div>
    </section>
  );
};
