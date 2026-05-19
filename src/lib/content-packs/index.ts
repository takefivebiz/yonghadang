import type { ContentPack } from "@/lib/types/quiz";
import { getContentDefinition } from "@/lib/content-definitions";

/**
 * 콘텐츠 ID로 ContentPack을 반환한다.
 * 클라이언트(analyze page)와 서버(generate route) 양쪽에서 사용 가능.
 */
export const getContentPack = (contentId: string): ContentPack | null => {
  return getContentDefinition(contentId)?.contentPack ?? null;
};
