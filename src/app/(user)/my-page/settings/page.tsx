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
              borderColor: 'rgba(230, 230, 250, 0.2)',
              borderTopColor: '#BEAEDB',
            }}
            aria-hidden="true"
          />
          <p className="text-sm" style={{ color: '#D4C5E2' }}>설정을 불러오는 중...</p>
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
        <h2 className="mb-4 text-lg font-semibold" style={{ color: '#F0E6FA' }}>
          프로필 수정
        </h2>
        <ProfileCard
          profile={profile}
          onProfileChange={handleProfileChange}
        />
      </section>

      {/* 계정 설정 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold" style={{ color: '#F0E6FA' }}>
          계정
        </h2>
        <div
          className="space-y-3 rounded-2xl border p-6"
          style={{
            background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
            borderColor: "rgba(230, 230, 250, 0.15)",
          }}
        >
          {/* 이메일 */}
          <div>
            <p className="mb-1 text-xs font-medium" style={{ color: '#B8A8D8' }}>이메일</p>
            <p className="font-medium" style={{ color: '#F0E6FA' }}>
              {profile.email}
            </p>
          </div>

          {/* 가입일 */}
          <div>
            <p className="mb-1 text-xs font-medium" style={{ color: '#B8A8D8' }}>가입일</p>
            <p className="font-medium" style={{ color: '#F0E6FA' }}>
              {new Date(profile.joinedAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>
      </section>

      {/* 위험 영역 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: '#F0E6FA' }}>
          위험 영역
        </h2>
        <div className="space-y-3">
          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="w-full rounded-2xl border px-6 py-3 text-sm font-medium transition-all hover:opacity-80"
            style={{
              borderColor: "rgba(230, 230, 250, 0.15)",
              background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
              color: '#F0E6FA',
            }}
          >
            로그아웃
          </button>

          {/* 회원 탈퇴 */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full rounded-2xl border px-6 py-3 text-sm font-medium transition-all hover:opacity-80"
            style={{
              borderColor: "rgba(239, 68, 68, 0.3)",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: '#EF4444',
            }}
          >
            회원 탈퇴
          </button>
        </div>
      </section>

      {/* 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            className="rounded-2xl p-6 md:max-w-sm"
            style={{
              background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
              border: "1px solid rgba(230, 230, 250, 0.15)",
            }}
          >
            <h3 className="mb-2 text-lg font-semibold" style={{ color: '#F0E6FA' }}>
              정말 탈퇴하시나요?
            </h3>
            <p className="mb-6 text-sm" style={{ color: '#D4C5E2' }}>
              계정과 모든 리포트 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-all"
                style={{
                  borderColor: "rgba(230, 230, 250, 0.15)",
                  color: '#F0E6FA',
                }}
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 rounded-xl px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-80 active:scale-95"
                style={{
                  backgroundColor: '#EF4444',
                }}
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
