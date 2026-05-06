'use client';

import { ResultScene, SceneMessage } from '@/lib/types/result';

interface SceneViewerProps {
  scene: ResultScene;
  isUnlocked: boolean;
  onOpenScene: () => void;
  onUnlockAll: () => void;
  isAllUnlocked: boolean;
}

// ── AI 메시지: 개별 말풍선 — 메신저처럼 각 문장이 독립 블록
const AiBlock = ({ text }: { text: string }) => (
  <div className="mb-3 flex items-start">
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.055)',
        borderRadius: '3px 14px 14px 14px',
        padding: '10px 15px',
        maxWidth: '90%',
      }}
    >
      <p
        style={{
          color: 'rgba(249, 249, 229, 0.80)',
          fontSize: '14px',
          lineHeight: '1.85',
          letterSpacing: '-0.01em',
        }}
      >
        {text}
      </p>
    </div>
  </div>
);

// ── 펀치라인: 박스 없는 독립 강조 블록 — 화면에 부유하는 핵심 문장
const PunchBlock = ({ text }: { text: string }) => (
  <div className="my-9 px-4 text-center">
    <p
      style={{
        color: 'rgba(209, 109, 172, 0.90)',
        fontSize: '15px',
        lineHeight: '1.80',
        fontWeight: '500',
        letterSpacing: '-0.02em',
      }}
    >
      {text}
    </p>
  </div>
);

// ── 메모 쪽지: 크림색 손메모 느낌 — 씬당 최대 1개
const MemoBlock = ({ text }: { text: string }) => (
  <div
    className="my-7 mx-1"
    style={{
      background: 'rgba(245, 239, 220, 0.88)',
      color: '#3A2A18',
      padding: '12px 17px',
      borderRadius: '4px',
      transform: 'rotate(-1.3deg)',
      fontSize: '13px',
      lineHeight: '1.95',
      whiteSpace: 'pre-line',
    }}
  >
    {text}
  </div>
);

const renderMessage = (msg: SceneMessage, idx: number) => {
  switch (msg.type) {
    case 'ai':
      return <AiBlock key={idx} text={msg.text} />;
    case 'punch':
      return <PunchBlock key={idx} text={msg.text} />;
    case 'memo':
      return <MemoBlock key={idx} text={msg.text} />;
  }
};

// ── 씬 뷰어: 카드 박스 없음 — 메시지 블록이 페이지 위에 직접 부유
const ResultCardModal = ({
  scene,
  isUnlocked,
  onOpenScene,
  onUnlockAll,
  isAllUnlocked,
}: SceneViewerProps) => {
  const isLocked = !scene.is_free && !isUnlocked;

  return (
    <div className="relative flex flex-col w-full px-5 pt-2 pb-6">
      {/* 씬 번호 — 상단에 희미하게 부유 */}
      <p
        className="mb-8 text-[10px] tracking-[0.35em] uppercase"
        style={{ color: 'rgba(209, 109, 172, 0.28)' }}
      >
        {String(scene.scene_index).padStart(2, '0')} / 06
      </p>

      {/* ── 잠금 해제 씬: 메시지 블록 흐름 ─────────────────────── */}
      {!isLocked && (
        <div>
          {(scene.messages ?? []).map(renderMessage)}

          {isUnlocked && !scene.is_free && (
            <p
              className="mt-8 text-right text-[10px] tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.08)' }}
            >
              unlocked
            </p>
          )}
        </div>
      )}

      {/* ── 잠금 씬: 미리보기 + fade + CTA ─────────────────────── */}
      {isLocked && (
        <>
          {/* 미리보기 메시지 — fade-out으로 흡수 */}
          <div className="relative">
            <div>{(scene.preview_messages ?? []).map(renderMessage)}</div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, rgba(12, 10, 22, 0.60) 55%, rgba(12, 10, 22, 0.97) 100%)',
              }}
            />
          </div>

          {/* 대화 끊김 표시 */}
          <div className="mt-7 mb-6 text-center">
            <p
              style={{
                color: 'rgba(249, 249, 229, 0.12)',
                fontSize: '10px',
                letterSpacing: '0.18em',
              }}
            >
              ─── 이 대화는 여기서 끊겼어 ───
            </p>
          </div>

          {/* CTA — 카드 없이 페이지 위에 부유 */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onOpenScene}
              className="w-full rounded-2xl py-3.5 text-[13px] font-medium tracking-wide transition-opacity duration-200 active:opacity-70"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                color: 'rgba(249, 249, 229, 0.88)',
              }}
            >
              이어서 읽기 · 900원
            </button>
            {!isAllUnlocked && (
              <button
                onClick={onUnlockAll}
                className="text-[11px] transition-opacity duration-200 opacity-35 hover:opacity-65 active:opacity-50"
                style={{ color: 'rgba(94, 153, 171, 0.95)' }}
              >
                전체 대화 열기 · 2,900원
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ResultCardModal;
