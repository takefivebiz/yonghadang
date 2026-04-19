"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SocialProvider } from "@/types/member";
import { loginAsMember, isMemberLoggedIn } from "@/lib/report-access";
import { DUMMY_MEMBERS_BY_PROVIDER } from "@/lib/dummy-member";
import { redirectToSite } from "@/lib/site-url";
import { KakaoLoginButton } from "./kakao-login-button";
import { GoogleLoginButton } from "./google-login-button";

/** 허용 리다이렉트 경로만 통과시켜 Open Redirect 방어. */
const sanitizeNextPath = (raw: string | null): string => {
  if (!raw) return "/";
  // 오픈 리다이렉트 방지: 반드시 "/" 로 시작하고 "//"(프로토콜 상대경로)는 차단
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
};

type AuthPhase = "idle" | "authenticating";

/**
 * PRD 6-8. 회원 로그인/회원가입 오케스트레이터.
 * - Kakao / Google 소셜 로그인만 제공 (공식 버튼 디자인)
 * - 로그인 성공 시 `?next=...` 또는 `/` 로 리다이렉트
 * - 환경별 도메인(개발/프로덕션)으로 라우팅되도록 `redirectToSite` 사용
 *
 * TODO: [백엔드 연동]
 *   1) Kakao/Google 버튼 → `supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })`
 *   2) `/api/auth/callback` 에서 세션 교환 후 동일한 next 경로로 복귀
 *   3) 본 파일의 `setTimeout` 시뮬레이션 제거
 */
export const AuthClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(
    () => sanitizeNextPath(searchParams.get("next")),
    [searchParams],
  );

  const [phase, setPhase] = useState<AuthPhase>("idle");
  const [activeProvider, setActiveProvider] = useState<SocialProvider | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 이미 로그인된 상태로 /auth 진입 시 즉시 목적지로 이동
  useEffect(() => {
    if (isMemberLoggedIn()) {
      redirectToSite(nextPath, (href) => router.replace(href));
    }
  }, [nextPath, router]);

  const handleSocialLogin = (provider: SocialProvider) => {
    if (phase === "authenticating") return;

    setErrorMessage(null);
    setActiveProvider(provider);
    setPhase("authenticating");

    // TODO: [백엔드 연동] supabase.auth.signInWithOAuth 호출로 교체
    //   const { error } = await supabase.auth.signInWithOAuth({
    //     provider,
    //     options: { redirectTo: `${getSiteOrigin()}/api/auth/callback?next=${encodeURIComponent(nextPath)}` },
    //   });
    //   if (error) { setPhase("idle"); setErrorMessage(error.message); return; }
    //
    // 현재는 프론트엔드 데모 — 0.8초 후 DUMMY 회원으로 로그인 성공 처리
    window.setTimeout(() => {
      try {
        const profile = DUMMY_MEMBERS_BY_PROVIDER[provider];
        loginAsMember(profile);
        redirectToSite(nextPath, (href) => router.replace(href));
      } catch (err) {
        console.error("[/auth] 소셜 로그인 시뮬레이션 실패", err);
        setPhase("idle");
        setActiveProvider(null);
        setErrorMessage("로그인에 실패했어요. 잠시 후 다시 시도해주세요.");
      }
    }, 800);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── 배경 — 파스텔 라벤더 그라디언트 ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 55%, #F5F0E8 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#E8D4F0", opacity: 0.35 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-72 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "#F5D7E8", opacity: 0.3 }}
      />

      {/* 신비로운 별/달 장식 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[45vh]"
      >
        <span className="absolute left-[10%] top-[20%] text-2xl opacity-20">
          ✦
        </span>
        <span className="absolute right-[12%] top-[28%] text-3xl opacity-20">
          🌙
        </span>
        <span className="absolute left-[78%] top-[10%] text-lg opacity-20">
          ✦
        </span>
        <span className="absolute left-[22%] top-[58%] text-xl opacity-15">
          ✦
        </span>
      </div>

      <div
        className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-stretch justify-center px-4 py-12"
        style={{ animation: "authFadeIn 0.6s ease-out" }}
      >
        {/* 헤더 */}
        <header className="mb-8 text-center">
          <p className="font-display mb-2 text-xs uppercase tracking-[0.3em] text-[#9B88AC]">
            Sign in
          </p>
          <h1 className="font-display text-2xl font-bold text-[#4A3B5C] sm:text-3xl">
            당신의 이야기를 이어가세요
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#4A3B5C]/70">
            소셜 계정 하나면 충분해요.
            <br />
            별빛이 안내하는 자리로 모셔드릴게요.
          </p>
        </header>

        {/* 로그인 카드 */}
        <section
          aria-labelledby="auth-card-heading"
          className="relative overflow-hidden rounded-3xl border border-[#E8D4F0] bg-white px-6 py-8 shadow-sm sm:px-8"
          style={{
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 55%, #F9F2FB 100%)",
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-5 text-5xl opacity-10"
          >
            ✦
          </span>

          <h2 id="auth-card-heading" className="sr-only">
            소셜 로그인
          </h2>

          <div className="flex flex-col gap-3">
            <KakaoLoginButton
              onClick={() => handleSocialLogin("kakao")}
              disabled={phase === "authenticating"}
              loading={
                phase === "authenticating" && activeProvider === "kakao"
              }
            />
            <GoogleLoginButton
              onClick={() => handleSocialLogin("google")}
              disabled={phase === "authenticating"}
              loading={
                phase === "authenticating" && activeProvider === "google"
              }
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-[#FBEAEA] px-3 py-2 text-center text-xs text-[#D4475A]"
            >
              {errorMessage}
            </p>
          )}

          {/* 약관 안내 */}
          <p className="mt-6 text-center text-[11px] leading-relaxed text-[#4A3B5C]/55">
            로그인 시{" "}
            <Link
              href="/terms"
              className="underline decoration-[#D4A5A5]/60 underline-offset-2 transition-colors hover:text-[#4A3B5C]"
            >
              이용약관
            </Link>
            {" 및 "}
            <Link
              href="/privacy"
              className="underline decoration-[#D4A5A5]/60 underline-offset-2 transition-colors hover:text-[#4A3B5C]"
            >
              개인정보처리방침
            </Link>
            에 동의하게 됩니다
          </p>
        </section>

        {/* 비회원 주문 조회 링크 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#4A3B5C]/60">
            계정 없이 주문하셨나요?{" "}
            <Link
              href="/guest-login"
              className="font-semibold text-[#4A3B5C] underline-offset-2 hover:underline"
            >
              비회원 주문 조회
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes authFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
