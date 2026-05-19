import type { Content, InputConfig, SceneConfig } from "@/lib/types/content";
import type { ContentPack } from "@/lib/types/quiz";

export interface ContentDefinition {
  id: string;
  meta: Content;
  inputConfig: InputConfig;
  sceneConfig: SceneConfig;
  contentPack?: ContentPack;
}
