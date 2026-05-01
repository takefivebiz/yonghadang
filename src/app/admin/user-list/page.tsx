"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { AdminUser } from "@/types/admin";
import { OrderOwnerType } from "@/types/order";

/** ISO 날짜 → "YYYY.MM.DD" */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").slice(0, -1);

/** 가입 경로 배지 */
const ProviderBadge = ({ provider }: { provider: AdminUser["provider"] }) => {
  const MAP: Record<string, { label: string; className: string }> = {
    google: { label: 'Google', className: 'bg-blue-50 text-blue-600' },
    kakao:  { label: 'Kakao',  className: 'bg-yellow-50 text-yellow-700' },
    apple:  { label: 'Apple',  className: 'bg-gray-800 text-white' },
    guest:  { label: 'Guest',  className: 'bg-gray-100 text-gray-500' },
  };
  const cfg = MAP[provider ?? 'guest'];
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

type UserTypeFilter = "all" | OrderOwnerType;

/**
 * PRD 7-5 유저 리스트 (/admin/user-list).
 * - 회원/비회원 필터, 닉네임·이메일·전화번호 실시간 검색
 *
 * TODO: [백엔드 연동] /api/admin/users 실제 호출로 교체
 */
const AdminUserListPage = () => {
  const [search, setSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<UserTypeFilter>("all");

  const filtered = useMemo(() => {
    // TODO: [백엔드 연동] /api/admin/users에서 실제 데이터 조회
    const users: AdminUser[] = [];
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (userTypeFilter !== "all" && u.userType !== userTypeFilter) return false;
      if (q) {
        const matchNickname = u.nickname.toLowerCase().includes(q);
        const matchEmail = u.email?.toLowerCase().includes(q) ?? false;
        const matchPhone = u.phone?.includes(q) ?? false;
        if (!matchNickname && !matchEmail && !matchPhone) return false;
      }
      return true;
    });
  }, [search, userTypeFilter]);

  return (
    <div className="flex flex-col gap-6">
      {/* 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#F0E6FA' }}>유저 관리</h1>
        <p className="mt-1 text-sm" style={{ color: '#B8A8D8' }}>회원 및 비회원 유저를 조회합니다.</p>
      </div>

      {/* 필터 & 검색 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
          <input
            type="text"
            placeholder="닉네임, 이메일, 전화번호 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-blue-400 focus:shadow-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(230, 230, 250, 0.2)',
              color: '#F5F5F5',
            }}
          />
        </div>

        <select
          value={userTypeFilter}
          onChange={(e) => setUserTypeFilter(e.target.value as UserTypeFilter)}
          className="rounded-lg border px-3 py-2 text-sm outline-none transition-all focus:border-blue-400 focus:shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(230, 230, 250, 0.2)',
            color: '#F5F5F5',
          }}
        >
          <option value="all">전체</option>
          <option value="member">회원</option>
          <option value="guest">비회원</option>
        </select>
      </div>

      {/* 유저 테이블 */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))', border: '1px solid rgba(230, 230, 250, 0.15)' }}>
        {/* 헤더 */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ borderColor: 'rgba(230, 230, 250, 0.15)', color: '#B8A8D8', background: 'rgba(100, 149, 237, 0.08)' }}>
          <span>닉네임 / 연락처</span>
          <span className="hidden sm:block">가입 경로</span>
          <span className="hidden md:block">결제 여부</span>
          <span className="hidden sm:block">주문 수</span>
          <span>가입 일시</span>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm" style={{ color: '#B8A8D8' }}>검색 결과가 없습니다.</p>
        ) : (
          filtered.map((user) => (
            <Link
              key={user.id}
              href={`/admin/user-list/${user.id}`}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 border-b px-5 py-4 text-sm transition-colors last:border-b-0 hover:bg-blue-500/10"
              style={{ borderColor: 'rgba(230, 230, 250, 0.1)' }}
            >
              {/* 닉네임 / 연락처 */}
              <div className="min-w-0">
                <p className="font-medium" style={{ color: '#F0E6FA' }}>{user.nickname}</p>
                <p className="truncate text-xs" style={{ color: '#B8A8D8' }}>
                  {user.email ?? user.phone ?? "-"}
                </p>
              </div>
              {/* 가입 경로 */}
              <div className="hidden sm:block">
                <ProviderBadge provider={user.provider} />
              </div>
              {/* 결제 여부 */}
              <span className={`hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:block ${user.hasPurchased ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                {user.hasPurchased ? "결제" : "미결제"}
              </span>
              {/* 누적 주문 */}
              <span className="hidden sm:block" style={{ color: '#D4C5E2' }}>{user.totalOrders}건</span>
              {/* 가입 일시 */}
              <div className="flex items-center gap-1">
                <span className="text-xs" style={{ color: '#B8A8D8' }}>{formatDate(user.joinedAt)}</span>
                <ChevronRight size={14} style={{ color: 'rgba(255, 255, 255, 0.2)' }} />
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 결과 카운트 */}
      <p className="text-right text-xs" style={{ color: '#B8A8D8' }}>총 {filtered.length}명</p>
    </div>
  );
};

export default AdminUserListPage;
