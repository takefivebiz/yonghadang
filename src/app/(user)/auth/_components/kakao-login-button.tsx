"use client";

interface KakaoLoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * 카카오 공식 로그인 버튼 (한국어 "카카오 로그인").
 *
 * Kakao Developers 디자인 가이드:
 *   - 배경: #FEE500 (Kakao Yellow)
 *   - 텍스트: rgba(0,0,0,0.85)
 *   - 라운드 모서리(12px), 48px 높이 권장
 *   - 말풍선 심볼은 동일 색상 라인이어야 함
 * https://developers.kakao.com/docs/latest/ko/kakaologin/design-guide
 */
export const KakaoLoginButton = ({
  onClick,
  disabled,
  loading,
}: KakaoLoginButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label="카카오 로그인"
      className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 text-[15px] font-semibold transition-all duration-200 hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        backgroundColor: "#FEE500",
        color: "rgba(0,0,0,0.85)",
      }}
    >
      {/* 공식 말풍선 심볼 (SVG) */}
      <svg
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M10 0C4.477 0 0 3.477 0 7.77c0 2.78 1.87 5.22 4.69 6.59-.2.73-.73 2.69-.84 3.11-.13.52.19.52.4.38.17-.11 2.69-1.83 3.77-2.56.65.09 1.31.14 1.98.14 5.523 0 10-3.477 10-7.77C20 3.477 15.523 0 10 0Z"
          fill="currentColor"
        />
      </svg>
      <span>{loading ? "로그인 중..." : "카카오 로그인"}</span>
    </button>
  );
};
