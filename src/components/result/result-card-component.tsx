'use client';

import { ResultScene } from '@/lib/types/result';

interface ResultCardComponentProps {
  scene: ResultScene;
  onOpenScene: () => void;
}

// TODO: [미사용] 현재 result-card-modal.tsx(SceneViewer)로 대체됨. 추후 정리 예정.
const ResultCardComponent = ({ scene, onOpenScene }: ResultCardComponentProps) => {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface/20 p-6 sm:p-8">
      <div className="mb-4">
        <div className="mb-2 text-xs" style={{ color: 'rgba(209,109,172,0.35)' }}>
          {String(scene.scene_index).padStart(2, '0')} / 06
        </div>
      </div>
      {(scene.messages ?? []).map((msg, i) => (
        <p key={i} className="mb-4 text-sm leading-relaxed" style={{ color: 'rgba(249,249,229,0.70)' }}>
          {msg.text}
        </p>
      ))}
      {!scene.is_free && (
        <button
          onClick={onOpenScene}
          className="mt-4 text-xs"
          style={{ color: 'rgba(94,153,171,0.7)' }}
        >
          이어서 읽기
        </button>
      )}
    </div>
  );
};

export default ResultCardComponent;
