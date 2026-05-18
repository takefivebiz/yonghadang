import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MyPageContent from "@/components/my-page/my-page-content";
import { createSupabaseServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/types/user";
import type { SessionSummary } from "@/lib/types/session";

export const metadata: Metadata = {
  title: "마이페이지 — VEIL",
  description: "내 프로필과 지난 기록을 확인해요",
};

// analysis_sessions JOIN contents 결과 행 타입
type SessionRow = {
  id: string;
  created_at: string;
  contents: { title: string; category: string } | null;
};

const MyPage = async () => {
  // 1. 인증 확인 — middleware 통과 후 2차 방어선
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/my-page");
  }

  const db = createServiceRoleClient();

  // 2. profiles 조회
  const { data: profileRow } = await db
    .from("profiles")
    .select("id, email, nickname, social_provider, role, created_at, updated_at")
    .eq("id", user.id)
    .single();

  // 프로필이 없으면 auth 트리거가 아직 실행되지 않은 것 — 재로그인 유도
  if (!profileRow) {
    redirect("/auth?next=/my-page");
  }

  const profile: UserProfile = {
    id: profileRow.id as string,
    email: profileRow.email as string,
    nickname: profileRow.nickname as string,
    social_provider: profileRow.social_provider as "google" | "kakao",
    role: profileRow.role as "user" | "admin",
    created_at: profileRow.created_at as string,
    updated_at: profileRow.updated_at as string,
  };

  // 3. analysis_sessions + contents JOIN (completed/answered 상태만)
  const { data: sessionRows } = await db
    .from("analysis_sessions")
    .select("id, created_at, contents(title, category)")
    .eq("user_id", user.id)
    .in("status", ["completed", "answered"])
    .order("created_at", { ascending: false });

  // Supabase JS는 FK 내장 select를 배열로 추론하지만 many-to-one 런타임 값은 객체다.
  // unknown 경유 캐스트로 타입 불일치 우회.
  const sessions: SessionSummary[] = (
    (sessionRows ?? []) as unknown as SessionRow[]
  ).map((row) => ({
    session_id: row.id,
    content_title: row.contents?.title ?? "알 수 없는 콘텐츠",
    category: row.contents?.category ?? "",
    created_at: row.created_at,
    has_purchase: false, // TODO: orders 테이블 기반 구매 여부 계산 (별도 커밋)
  }));

  return <MyPageContent profile={profile} sessions={sessions} />;
};

export default MyPage;
