"use client";

import Link from "next/link";

const AuthPage = () => {
  const handleSocialLogin = (provider: string) => {
    // TODO: [백엔드 연동] 실제 OAuth 플로우로 교체
    if (typeof window !== "undefined") {
      localStorage.setItem("veil_user_id", "user-1");
      localStorage.setItem("veil_user_provider", provider);

      // sessionStorage의 redirect_to를 읽어서 이동, 없으면 "/"
      const redirectTo = sessionStorage.getItem("redirect_to");
      sessionStorage.removeItem("redirect_to");
      window.location.href = redirectTo || "/";
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-start px-4 pt-25">
      {/* 메인 카피 + 서브텍스트 */}
      <div className="mb-14 flex max-w-md flex-col items-center gap-4 text-center">
        <div className="space-y-3">
          <h2 className="text-4xl font-nomal mb-5 tracking-[0.2em] text-highlight">
            VEIL
          </h2>
          <h3 className="mb-8 text-sm font-light leading-snug text-highlight">
            나만의 <span className="text-accent">흐름</span> 속에서, <br />
            나를 <span className="text-accent">이해</span>하는 시간
          </h3>
        </div>
      </div>

      {/* 소셜 로그인 섹션 */}
      <div className="w-full max-w-[85%] sm:max-w-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-surface/100" />
          <p className="text-center text-[0.7rem] text-highlight/40">
            소셜 계정으로 간편하게 시작하기
          </p>
          <div className="h-px flex-1 bg-surface/100" />
        </div>
        {/* Google 로그인 */}
        <button onClick={() => handleSocialLogin("google")} className="group flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-4 transition-all duration-200 hover:border-accent/30 hover:bg-white/[0.05]">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>

          <span className="text-sm font-normal text-highlight/85 transition-colors duration-200 group-hover:text-highlight">
            Google로 계속하기
          </span>
        </button>

        {/* Kakao 로그인 */}
        <button onClick={() => handleSocialLogin("kakao")} className="group flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-4 transition-all duration-200 hover:border-accent/30 hover:bg-white/[0.05]">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1C5.925 1 1 4.82 1 9.5c0 3.12 2.003 5.843 5.03 7.282l-1.207 4.397c-.113.412.268.781.654.56l3.868-2.343c.506.038 1.022.104 1.655.104 6.075 0 11-3.82 11-8.5S18.075 1 12 1z"
              fill="#FEE500"
            />
          </svg>

          <span className="text-sm font-normal text-highlight/85 transition-colors duration-200 group-hover:text-highlight">
            Kakao로 계속하기
          </span>
        </button>
      </div>

      {/* 하단 약관 안내 */}
      <div className="mt-6 flex items-center justify-center gap-1 text-center text-xs text-highlight/40">
        <svg
          className="h-3 w-3 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
        <p className="text-[0.55rem] leading-relaxed">
          로그인하면{" "}
          <Link
            href="/terms"
            className="text-highlight/60 hover:text-highlight"
          >
            이용약관
          </Link>{" "}
          및{" "}
          <Link
            href="/privacy"
            className="text-highlight/60 hover:text-highlight"
          >
            개인정보처리방침
          </Link>
          에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
