import { SocialProvider } from "@/types/member";

interface SocialBadgeProps {
  provider: SocialProvider;
}

/**
 * 소셜 로그인 제공자 로고 뱃지.
 * Google / Kakao 중 하나를 표시.
 */
export const SocialBadge = ({ provider }: SocialBadgeProps) => {
  if (provider === "kakao") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: "#FEE500", color: "#191919" }}
        title="카카오 로그인"
      >
        <span aria-hidden="true" className="text-sm leading-none">
          💬
        </span>
        Kakao
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-white px-3 py-1 text-xs font-semibold text-[#3C4043]"
      title="Google 로그인"
    >
      <span
        aria-hidden="true"
        className="inline-block h-3 w-3 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #EA4335 0deg 90deg, #FBBC05 90deg 180deg, #34A853 180deg 270deg, #4285F4 270deg 360deg)",
        }}
      />
      Google
    </span>
  );
};
