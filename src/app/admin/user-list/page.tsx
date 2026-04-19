"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { DUMMY_ADMIN_USERS } from "@/lib/dummy-admin";
import { AdminUser } from "@/types/admin";
import { OrderOwnerType } from "@/types/order";

/** ISO 날짜 → "YYYY.MM.DD" */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").slice(0, -1);

/** 가입 경로 배지 */
const ProviderBadge = ({ provider }: { provider: AdminUser["provider"] }) => {
  const MAP = {
    google: { label: "Google", className: "bg-blue-50 text-blue-600" },
    kakao:  { label: "Kakao",  className: "bg-yellow-50 text-yellow-700" },
    guest:  { label: "Guest",  className: "bg-gray-100 text-gray-500" },
  };
  const cfg = MAP[provider ?? "guest"];
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

  // TODO: [백엔드 연동] DUMMY_ADMIN_USERS를 /api/admin/users 실제 호출로 교체
  const users: AdminUser[] = DUMMY_ADMIN_USERS;

  const filtered = useMemo(() => {
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
  }, [users, search, userTypeFilter]);

  return (
    <div className="flex flex-col gap-6">
      {/* 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">유저 관리</h1>
        <p className="mt-1 text-sm text-foreground/60">회원 및 비회원 유저를 조회합니다.</p>
      </div>

      {/* 필터 & 검색 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="닉네임, 이메일, 전화번호 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <select
          value={userTypeFilter}
          onChange={(e) => setUserTypeFilter(e.target.value as UserTypeFilter)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">전체</option>
          <option value="member">회원</option>
          <option value="guest">비회원</option>
        </select>
      </div>

      {/* 유저 테이블 */}
      <div className="rounded-2xl bg-card shadow-sm overflow-hidden">
        {/* 헤더 */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-border bg-background/50 px-5 py-3 text-xs font-semibold text-foreground/50 uppercase tracking-wide">
          <span>닉네임 / 연락처</span>
          <span className="hidden sm:block">가입 경로</span>
          <span className="hidden md:block">결제 여부</span>
          <span className="hidden sm:block">주문 수</span>
          <span>가입 일시</span>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-foreground/50">검색 결과가 없습니다.</p>
        ) : (
          filtered.map((user) => (
            <Link
              key={user.id}
              href={`/admin/user-list/${user.id}`}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 border-b border-border/50 px-5 py-4 text-sm transition-colors hover:bg-secondary/30 last:border-b-0"
            >
              {/* 닉네임 / 연락처 */}
              <div className="min-w-0">
                <p className="font-medium text-foreground">{user.nickname}</p>
                <p className="truncate text-xs text-foreground/50">
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
              <span className="hidden text-foreground/70 sm:block">{user.totalOrders}건</span>
              {/* 가입 일시 */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-foreground/60">{formatDate(user.joinedAt)}</span>
                <ChevronRight size={14} className="text-foreground/30" />
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 결과 카운트 */}
      <p className="text-right text-xs text-foreground/50">총 {filtered.length}명</p>
    </div>
  );
};

export default AdminUserListPage;
