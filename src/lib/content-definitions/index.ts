import type { ContentDefinition } from "@/lib/types/content-definition";
import { love1Definition } from "@/lib/content-definitions/love-1";

const CONTENT_DEFINITION_MAP: Record<string, ContentDefinition> = {
  "love-1": love1Definition,
};

export const getContentDefinition = (
  contentId: string,
): ContentDefinition | null => CONTENT_DEFINITION_MAP[contentId] ?? null;

export const getAllContentDefinitions = (): ContentDefinition[] =>
  Object.values(CONTENT_DEFINITION_MAP);

export const validateContentDefinitions = (): void => {
  for (const [registryKey, definition] of Object.entries(
    CONTENT_DEFINITION_MAP,
  )) {
    const ids = [
      ["registry key", registryKey],
      ["definition.id", definition.id],
      ["meta.id", definition.meta.id],
      ["contentPack.contentId", definition.contentPack?.contentId],
    ] as const;

    const mismatched = ids.filter(([, id]) => id !== registryKey);

    if (mismatched.length > 0) {
      const details = ids
        .map(([label, id]) => `${label}=${id ?? "(missing)"}`)
        .join(", ");
      throw new Error(`[content-definitions] id mismatch: ${details}`);
    }
  }
};

if (process.env.NODE_ENV !== "production") {
  validateContentDefinitions();
}
