import { ResultScene } from "@/lib/types/result";

/**
 * 기존 scenes과 새로운 scenes을 merge한다.
 * - 모든 scenes를 합친다
 * - scene_index 기준으로 dedup (같은 index는 새로운 것으로 대체)
 * - scene_index 오름차순 정렬
 *
 * 예:
 *   existing: [Scene 1, Scene 2]
 *   new: [Scene 3, Scene 4]
 *   → [Scene 1, 2, 3, 4]
 *
 *   existing: [Scene 1, Scene 2]
 *   new: [Scene 3]
 *   → [Scene 1, 2, 3]
 *
 *   existing: [Scene 1, Scene 2, Scene 3]
 *   new: [Scene 3] (재생성)
 *   → [Scene 1, 2, Scene 3(new)]
 */
export const mergeScenes = (
  existingScenes: ResultScene[],
  newScenes: ResultScene[]
): ResultScene[] => {
  // 1. 모두 합친다
  const combined = [...existingScenes, ...newScenes];

  // 2. scene_index 기준으로 Map 생성 (같은 index는 마지막 것만 유지)
  const sceneMap = new Map<number, ResultScene>();
  combined.forEach((scene) => {
    sceneMap.set(scene.scene_index, scene);
  });

  // 3. scene_index 오름차순으로 정렬
  const merged = Array.from(sceneMap.values()).sort(
    (a, b) => a.scene_index - b.scene_index
  );

  return merged;
};
