/**
 * 환경별 사이트 오리진 해석 유틸.
 *
 * 로그인 성공 후 리다이렉트 시, 개발 환경에서는 개발 도메인으로,
 * 프로덕션 환경에서는 프로덕션 도메인으로 경로를 구성해야 하므로
 * `NODE_ENV` 기준으로 오리진을 선택한다.
 *
 * - 프로덕션: `NEXT_PUBLIC_SITE_URL_PRODUCTION` 우선 사용, 미설정 시 기본 도메인 폴백
 * - 그 외(개발/프리뷰): `NEXT_PUBLIC_SITE_URL_DEVELOPMENT` 우선 사용, 미설정 시 localhost
 *
 * TODO: [백엔드 연동] Supabase OAuth `redirectTo` 옵션으로 동일 값을 전달하도록 연동.
 */

const FALLBACK_PRODUCTION_ORIGIN = "https://yonghadang.com";
const FALLBACK_DEVELOPMENT_ORIGIN = "http://localhost:3000";

/** 현재 환경에 맞는 사이트 오리진(스킴+호스트)을 반환한다. */
export const getSiteOrigin = (): string => {
  if (process.env.NODE_ENV === "production") {
    return (
      process.env.NEXT_PUBLIC_SITE_URL_PRODUCTION ?? FALLBACK_PRODUCTION_ORIGIN
    );
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL_DEVELOPMENT ?? FALLBACK_DEVELOPMENT_ORIGIN
  );
};

/**
 * 환경에 맞는 도메인으로 지정된 경로 이동을 수행한다.
 * - 이미 목표 오리진 위에 있다면 클라이언트 네비게이션(replace)을 호출
 * - 오리진이 다르면 `window.location.assign` 으로 하드 리다이렉트
 *
 * @param pathname `/` 로 시작하는 내부 경로
 * @param replace  SPA 네비게이터 (router.replace). 오리진 일치 시에만 호출.
 */
export const redirectToSite = (
  pathname: string,
  replace: (href: string) => void,
): void => {
  if (typeof window === "undefined") return;

  const targetOrigin = getSiteOrigin();
  const safePath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (window.location.origin === targetOrigin) {
    replace(safePath);
    return;
  }

  window.location.assign(`${targetOrigin}${safePath}`);
};
