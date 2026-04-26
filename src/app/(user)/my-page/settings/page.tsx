'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MemberProfile } from '@/types/member';
import {
  getMemberProfile,
  loginAsMember,
  logoutMember,
} from '@/lib/report-access';
import { DUMMY_MEMBER } from '@/lib/dummy-member';
import { ProfileCard } from '../_components/profile-card';

type SettingsState =
  | { phase: 'loading' }
  | { phase: 'ready'; profile: MemberProfile };

export default function SettingsPage() {
  const router = useRouter();
  const [state, setState] = useState<SettingsState>({ phase: 'loading' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let profile = getMemberProfile();

    if (!profile) {
      loginAsMember(DUMMY_MEMBER);
      profile = DUMMY_MEMBER;
    }

    setState({ phase: 'ready', profile });
  }, []);

  if (state.phase === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <span
            className="inline-block h-6 w-6 animate-spin rounded-full border-2"
            style={{
              borderColor: 'rgba(74,59,92,0.15)',
              borderTopColor: '#9B88AC',
            }}
            aria-hidden="true"
          />
          <p className="text-sm text-[#4A3B5C]/70">설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const { profile } = state;

  const handleProfileChange = (next: MemberProfile) => {
    setState((prev) =>
      prev.phase === 'ready' ? { ...prev, profile: next } : prev,
    );
  };

  const handleLogout = () => {
    logoutMember();
    router.push('/');
  };

  const handleDeleteAccount = () => {
    // 더미: 세션 초기화 후 리다이렉트
    logoutMember();
    router.push('/');
  };

  return (
    <div className="max-w-2xl">
      {/* 닉네임 수정 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold" style={{ color: '#2D3250' }}>
          프로필 수정
        </h2>
        <ProfileCard
          profile={profile}
          onProfileChange={handleProfileChange}
        />
      </section>

      {/* 계정 설정 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold" style={{ color: '#2D3250' }}>
          계정
        </h2>
        <div className="space-y-3 rounded-2xl border border-border/30 bg-white p-6">
          {/* 이메일 */}
          <div>
            <p className="mb-1 text-xs font-medium text-foreground/60">이메일</p>
            <p className="font-medium" style={{ color: '#2D3250' }}>
              {profile.email}
            </p>
          </div>

          {/* 가입일 */}
          <div>
            <p className="mb-1 text-xs font-medium text-foreground/60">가입일</p>
            <p className="font-medium" style={{ color: '#2D3250' }}>
              {new Date(profile.joinedAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>
      </section>

      {/* 위험 영역 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: '#2D3250' }}>
          위험 영역
        </h2>
        <div className="space-y-3">
          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="w-full rounded-2xl border border-border/30 bg-white px-6 py-3 text-sm font-medium text-foreground transition-all hover:shadow-md"
          >
            로그아웃
          </button>

          {/* 회원 탈퇴 */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full rounded-2xl border border-red-300/50 bg-red-50/50 px-6 py-3 text-sm font-medium text-red-600 transition-all hover:shadow-md"
          >
            회원 탈퇴
          </button>
        </div>
      </section>

      {/* 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="rounded-2xl bg-white p-6 md:max-w-sm">
            <h3 className="mb-2 text-lg font-semibold" style={{ color: '#2D3250' }}>
              정말 탈퇴하시나요?
            </h3>
            <p className="mb-6 text-sm text-foreground/60">
              계정과 모든 리포트 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-border/50 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-foreground/30"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-95"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
