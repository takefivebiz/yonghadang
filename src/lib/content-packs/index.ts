import type { ContentPack } from "@/lib/types/quiz";
import love1Pack from "./love-1";

// 콘텐츠 ID → ContentPack 룩업
// 새 콘텐츠 추가 시 이 맵에만 등록하면 된다.
const CONTENT_PACK_MAP: Record<string, ContentPack> = {
  "love-1": love1Pack,
};

/**
 * 콘텐츠 ID로 ContentPack을 반환한다.
 * 클라이언트(analyze page)와 서버(generate route) 양쪽에서 사용 가능.
 */
export const getContentPack = (contentId: string): ContentPack | null => {
  return CONTENT_PACK_MAP[contentId] ?? null;
};
