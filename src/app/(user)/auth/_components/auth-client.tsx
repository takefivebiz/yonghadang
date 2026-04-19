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
  const [isRedirecting, setIsRedirecting] = useState<boolean>(true);

  // 이미 로그인된 상태로 /auth 진입 시 즉시 목적지로 이동
  useEffect(() => {
    if (isMemberLoggedIn()) {
      redirectToSite(nextPath, (href) => router.replace(href));
      return;
    }

    // OAuth 콜백 에러 파라미터 처리
    const error = searchParams.get("error");
    if (error) {
      const errorMap: Record<string, string> = {
        access_denied: "로그인이 거부되었어요. 다시 시도해주세요.",
        server_error: "서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
        invalid_request: "요청이 올바르지 않아요. 다시 시도해주세요.",
      };
      setErrorMessage(
        errorMap[error] ?? "로그인에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
    }

    setIsRedirecting(false);
  }, [nextPath, router, searchParams]);

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
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-[#EDE0F8] via-[#F5F0E8] to-[#F5F0E8]">
      {/* 배경 장식 블롭 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#E8D4F0", opacity: 0.4 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#F5D7E8", opacity: 0.35 }}
      />

      {/* 별/달 장식 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
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
        <span className="absolute left-[22%] top-1/2 text-xl opacity-15">
          ✦
        </span>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <div
          className="w-full max-w-sm"
          style={{ animation: "authFadeIn 0.6s ease-out" }}
        >
          {/* 헤더 */}
          <header className="mb-8 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#9B88AC]">
              Sign in
            </p>
            <h1 className="text-3xl font-bold text-[#4A3B5C] sm:text-3xl">
              당신의 이야기를 이어가세요
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#4A3B5C]/70">
              소셜 계정 하나면 충분해요.
              <br />
              별빛이 안내하는 자리로 모셔드릴게요.
            </p>
          </header>

          {/* 로그인 카드 */}
          <section
            aria-labelledby="auth-card-heading"
            className="rounded-3xl border border-[#E8D4F0]/60 bg-white px-6 py-8 shadow-lg backdrop-blur-sm sm:px-8 sm:py-10"
          >
            <h2 id="auth-card-heading" className="sr-only">
              소셜 로그인
            </h2>

            {isRedirecting ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <div
                  className="h-6 w-6 rounded-full border-2 border-[#E8D4F0] border-t-[#9B88AC]"
                  style={{ animation: "spin 1s linear infinite" }}
                />
                <p className="text-xs text-[#4A3B5C]/70">
                  로그인 상태 확인 중...
                </p>
              </div>
            ) : (
              <>
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
                    className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600"
                  >
                    {errorMessage}
                  </p>
                )}

                {/* 약관 안내 */}
                <p className="mt-6 text-center text-xs leading-relaxed text-[#4A3B5C]/60">
                  로그인 시{" "}
                  <Link
                    href="/terms"
                    className="text-[#4A3B5C] underline hover:font-semibold"
                  >
                    이용약관
                  </Link>
                  {" 및 "}
                  <Link
                    href="/privacy"
                    className="text-[#4A3B5C] underline hover:font-semibold"
                  >
                    개인정보처리방침
                  </Link>
                  에 동의하게 됩니다
                </p>
              </>
            )}
          </section>

          {/* 비회원 주문 조회 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#4A3B5C]/60">
              계정 없이 주문하셨나요?{" "}
              <Link
                href="/guest-login"
                className="font-medium text-[#4A3B5C] hover:underline"
              >
                비회원 주문 조회
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes authFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
