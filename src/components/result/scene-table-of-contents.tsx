'use client';

import { useState } from 'react';
import { ResultScene } from '@/lib/types/result';

interface SceneTableOfContentsProps {
  scenes: ResultScene[];
  unlockedScenes: number[];
  onUnlockScene: (sceneIndex: number) => void;
  onUnlockAll: () => void;
  onClose: () => void;
}

const SceneTableOfContents = ({
  scenes,
  unlockedScenes,
  onUnlockScene,
  onUnlockAll,
  onClose,
}: SceneTableOfContentsProps) => {
  const [selectedSceneForPreview, setSelectedSceneForPreview] = useState<number | null>(null);

  const paidScenes = scenes.filter(s => !s.is_free);
  const allPaidUnlocked = paidScenes.every(s => unlockedScenes.includes(s.scene_index));

  const selectedScene = selectedSceneForPreview !== null
    ? scenes.find(s => s.scene_index === selectedSceneForPreview)
    : null;

  return (
    <div className="relative min-h-[90vh] flex flex-col">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black">
        <h3
          className="text-base font-semibold"
          style={{ color: 'rgba(249, 249, 229, 0.95)' }}
        >
          흠금 전체 보기
        </h3>
        <button
          onClick={onClose}
          className="text-xl transition-opacity duration-200 opacity-50 hover:opacity-80"
          style={{ color: 'rgba(249, 249, 229, 0.8)' }}
        >
          ✕
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 목차 영역 (또는 선택된 scene 미리보기) */}
        <div className="p-6">
          {selectedScene ? (
            // Scene 미리보기 모드
            <div>
              {/* 뒤로가기 */}
              <button
                onClick={() => setSelectedSceneForPreview(null)}
                className="mb-6 text-xs transition-opacity duration-200 opacity-50 hover:opacity-80"
                style={{ color: 'rgba(209, 109, 172, 0.8)' }}
              >
                ← 목차로 돌아가기
              </button>

              {/* Scene 미리보기 */}
              <div className="mb-6">
                <p
                  className="text-xs tracking-wider uppercase mb-2"
                  style={{ color: 'rgba(209, 109, 172, 0.35)' }}
                >
                  {String(selectedScene.scene_index).padStart(2, '0')} / 06
                </p>
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ color: 'rgba(249, 249, 229, 0.95)' }}
                >
                  {selectedScene.scene_title}
                </h2>
              </div>

              {/* Preview 또는 lock 상태 */}
              <div className="mb-8 p-4 rounded-lg border border-white/5" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                {unlockedScenes.includes(selectedScene.scene_index) ? (
                  // 언락된 scene: 메시지 미리보기
                  <div>
                    {(selectedScene.messages ?? [])
                      .slice(0, 2)
                      .map((msg, idx) => (
                        <p
                          key={idx}
                          className="text-sm mb-2 leading-relaxed"
                          style={{ color: 'rgba(249, 249, 229, 0.7)' }}
                        >
                          {msg.text}
                        </p>
                      ))}
                    {(selectedScene.messages ?? []).length > 2 && (
                      <p
                        className="text-xs mt-3"
                        style={{ color: 'rgba(249, 249, 229, 0.35)' }}
                      >
                        ... 더 보기
                      </p>
                    )}
                  </div>
                ) : (
                  // Lock 상태
                  <div className="text-center py-8">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      <svg
                        className="w-6 h-6"
                        style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 1C6.477 1 2 5.477 2 11v8c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2v-8c0-5.523-4.477-10-10-10zm0 2c4.418 0 8 3.582 8 8v8H4v-8c0-4.418 3.582-8 8-8zm1 7h-2v4h2v-4z" />
                      </svg>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: 'rgba(249, 249, 229, 0.4)' }}
                    >
                      이 scene을 언락하면<br />
                      전체 내용을 볼 수 있어
                    </p>
                  </div>
                )}
              </div>

              {/* Scene별 unlock CTA */}
              {!unlockedScenes.includes(selectedScene.scene_index) && (
                <button
                  onClick={() => {
                    onUnlockScene(selectedScene.scene_index);
                    setSelectedSceneForPreview(null);
                  }}
                  className="w-full rounded-2xl py-3.5 font-medium transition-all duration-200 hover:opacity-85 active:opacity-70"
                  style={{
                    background: 'rgba(209, 109, 172, 0.15)',
                    border: '1px solid rgba(209, 109, 172, 0.3)',
                    color: 'rgba(209, 109, 172, 0.85)',
                    fontSize: '13px',
                  }}
                >
                  이 흐름만 이어보기 · 900원
                </button>
              )}
            </div>
          ) : (
            // 목차 모드
            <div>
              <div
                className="mb-6 p-4 rounded-lg"
                style={{
                  background: 'rgba(209, 109, 172, 0.08)',
                  border: '1px solid rgba(209, 109, 172, 0.15)',
                }}
              >
                <p
                  className="text-xs"
                  style={{ color: 'rgba(209, 109, 172, 0.7)' }}
                >
                  무료 및 언락된 scene부터 차례대로 보며, 잠긴 scene을 모두 언락하면 전체 흐름을 이어서 볼 수 있어.
                </p>
              </div>

              {/* Scene 목록 */}
              <div className="space-y-3">
                {scenes.map(scene => {
                  const isUnlocked = unlockedScenes.includes(scene.scene_index);

                  return (
                    <button
                      key={scene.id}
                      onClick={() => setSelectedSceneForPreview(scene.scene_index)}
                      className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Status icon */}
                        <div className="flex-shrink-0 mt-1">
                          {isUnlocked ? (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(209, 109, 172, 0.4)' }}
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"
                                style={{ color: 'rgba(209, 109, 172, 0.9)' }}
                              >
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"
                                style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                              >
                                <path d="M5 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium leading-tight"
                            style={{
                              color: isUnlocked ? 'rgba(249, 249, 229, 0.9)' : 'rgba(249, 249, 229, 0.6)',
                            }}
                          >
                            {scene.scene_title}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{
                              color: isUnlocked ? 'rgba(249, 249, 229, 0.4)' : 'rgba(249, 249, 229, 0.25)',
                            }}
                          >
                            Scene {String(scene.scene_index).padStart(2, '0')}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="sticky bottom-0 px-6 py-6 border-t border-white/5 bg-black space-y-3">
        {!allPaidUnlocked && (
          <>
            {/* Primary CTA with badge */}
            <div className="relative">
              <button
                onClick={onUnlockAll}
                className="w-full rounded-2xl py-3.5 font-medium transition-all duration-200 hover:opacity-85 active:opacity-70"
                style={{
                  background: 'rgba(209, 109, 172, 0.25)',
                  border: '1px solid rgba(209, 109, 172, 0.4)',
                  color: 'rgba(209, 109, 172, 0.95)',
                  fontSize: '13px',
                }}
              >
                전체 흐름 이어보기 · 2,900원
              </button>
              {/* 추천 뱃지 */}
              <div
                className="absolute top-2 right-3 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide"
                style={{
                  background: 'rgba(209, 109, 172, 0.2)',
                  color: 'rgba(209, 109, 172, 0.5)',
                  border: '1px solid rgba(209, 109, 172, 0.2)',
                }}
              >
                추천
              </div>
            </div>

            <p
              className="text-center text-xs"
              style={{ color: 'rgba(249, 249, 229, 0.2)' }}
            >
              {paidScenes.length}개의 흐름을 모두 보면서 전체 맥락을 따라갈 수 있어
            </p>
          </>
        )}

        {allPaidUnlocked && (
          <p
            className="text-center text-xs py-3"
            style={{ color: 'rgba(209, 109, 172, 0.5)' }}
          >
            전체 흐름이 열렸어. 이어서 읽어봐 →
          </p>
        )}
      </div>
    </div>
  );
};

export default SceneTableOfContents;
