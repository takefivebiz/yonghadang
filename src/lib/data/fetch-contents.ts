/**
 * @server-only
 * Server Component 및 Server Action 전용.
 * `next: { revalidate }` 옵션은 클라이언트에서는 무시되므로
 * 클라이언트 컴포넌트에서는 SWR/React Query로 별도 구현한다.
 */
import type { PublicContent } from "@/lib/types/content";

/**
 * URL 우선순위:
 * 1. VERCEL_URL — Vercel이 모든 배포(preview/prod)에 자동 주입 (server-only)
 * 2. NEXT_PUBLIC_SITE_URL_DEVELOPMENT — 로컬 개발 환경 (.env.local)
 * 3. http://localhost:3000 — 마지막 fallback
 */
const getBaseUrl = (): string => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return (
    process.env.NEXT_PUBLIC_SITE_URL_DEVELOPMENT ?? "http://localhost:3000"
  );
};

/**
 * /api/contents를 fetch한다.
 * 네트워크 오류 또는 API 오류 시 빈 배열을 반환한다.
 */
export const fetchContents = async (): Promise<PublicContent[]> => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/contents`, {
      // 60초 ISR 캐시: 빈번한 콘텐츠 변경은 없지만 배포 직후 갱신 반영
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data: unknown = await res.json();

    if (
      !Array.isArray(data) ||
      (data.length > 0 && typeof data[0] !== "object")
    ) {
      return [];
    }

    return data as PublicContent[];
  } catch {
    return [];
  }
};
