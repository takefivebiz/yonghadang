import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "VEIL 로그인 페이지",
};

/**
 * 로그인 페이지 (/auth)
 * - Google / Kakao 소셜 로그인만 지원
 * - 미니멀 + 현실적인 dark UI 스타일
 * - Navbar/Footer는 (user) 레이아웃에서 자동 적용
 */
const AuthPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-56px-120px)] flex-col items-center justify-center px-4">
      {/* 메인 카피 + 서브텍스트 */}
      <div className="mb-17 flex max-w-md flex-col items-center gap-4 text-center">
        <div className="space-y-3">
          <h2 className="text-lg font-light leading-relaxed text-highlight">
            <span className="text-accent">지금, 나를 이해하는 흐름에</span>
            <br />
            들어서봐
          </h2>
        </div>
      </div>

      {/* 소셜 로그인 섹션 */}
      <div className="w-full max-w-[85%] space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-surface/100" />
          <p className="text-center text-[0.7rem] text-highlight/40">
            소셜 계정으로 간편하게 시작하기
          </p>
          <div className="h-px flex-1 bg-surface/100" />
        </div>

        {/* Google 로그인 - 공식 스타일 */}
        <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition-all hover:bg-gray-50 active:bg-gray-100">
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
          <span className="text-[0.8rem] font-medium text-gray-900">
            Google로 계속하기
          </span>
        </button>

        {/* Kakao 로그인 - 공식 스타일 */}
        <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#FFE812] px-4 py-2.5 transition-all hover:bg-[#FFF1A8] active:bg-[#FFE000]">
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
              fill="#3C1E1E"
            />
          </svg>
          <span className="text-[0.8rem] font-medium text-[#3C1E1E]">
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
