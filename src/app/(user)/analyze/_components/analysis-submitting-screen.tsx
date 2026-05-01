'use client';

import { useEffect, useState } from 'react';

type SubmittingStage = 'analyzing' | 'generating' | 'organizing' | 'completed' | 'error';

interface AnalysisSubmittingScreenProps {
  stage: SubmittingStage;
  progress: number; // 0-100
  elapsedSeconds: number;
  errorMessage?: string;
  onRetry?: () => void;
}

const STAGE_INFO: Record<SubmittingStage, { label: string; description: string }> = {
  analyzing: {
    label: '입력 정보 분석 중',
    description: '당신의 답변을 분석하고 있어요',
  },
  generating: {
    label: 'AI 해석 생성 중',
    description: 'Claude가 당신의 심리 패턴을 분석하고 있어요',
  },
  organizing: {
    label: '리포트 정리 중',
    description: '분석 결과를 정리하고 있어요',
  },
  completed: {
    label: '리포트 준비 완료',
    description: '리포트 페이지로 이동 중이에요',
  },
  error: {
    label: '생성 실패',
    description: '리포트 생성 중 오류가 발생했어요',
  },
};

const formatElapsed = (seconds: number): string => {
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}분 ${secs}초`;
};

export const AnalysisSubmittingScreen = ({
  stage,
  progress,
  elapsedSeconds,
  errorMessage,
  onRetry,
}: AnalysisSubmittingScreenProps) => {
  const info = STAGE_INFO[stage];
  const isError = stage === 'error';

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #1B003F 0%, #191970 100%)' }}>
      {/* 배경 장식 */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: '#6495ED', opacity: 0.15 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-40 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: '#E6E6FA', opacity: 0.08 }}
        aria-hidden="true"
      />

      {/* 콘텐츠 */}
      <div className="relative mx-auto w-full max-w-md px-6">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md md:p-12">
          {/* 헤더 */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold md:text-3xl" style={{ color: '#F5F5F5' }}>
              {info.label}
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: '#D0D0D0' }}>
              {info.description}
            </p>
          </div>

          {!isError ? (
            <>
              {/* 진행률 바 */}
              <div className="mb-6">
                <div className="mb-2 flex justify-between text-xs md:text-sm">
                  <span style={{ color: '#B0B0FF' }}>진행률</span>
                  <span style={{ color: '#B0B0FF' }}>{Math.min(progress, 100)}%</span>
                </div>
                <div
                  className="h-2 w-full rounded-full"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)',
                    }}
                  />
                </div>
              </div>

              {/* 단계 표시 */}
              <div className="mb-8 space-y-3">
                <StageItem
                  label="입력 정보 분석"
                  completed={progress > 25}
                  active={stage === 'analyzing'}
                />
                <StageItem
                  label="AI 해석 생성"
                  completed={progress > 65}
                  active={stage === 'generating'}
                />
                <StageItem
                  label="리포트 정리"
                  completed={progress >= 100}
                  active={stage === 'organizing'}
                />
              </div>

              {/* 경과 시간 */}
              <div className="text-center">
                <p className="text-sm" style={{ color: '#999' }}>
                  경과 시간: {formatElapsed(elapsedSeconds)}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* 에러 메시지 */}
              <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm leading-relaxed" style={{ color: '#FF6B6B' }}>
                  {errorMessage || '리포트 생성 중 오류가 발생했습니다. 다시 시도해주세요.'}
                </p>
              </div>

              {/* 재시도 버튼 */}
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="w-full rounded-lg border border-white/30 px-4 py-3 font-semibold transition-all hover:border-white/50 hover:bg-white/10"
                  style={{ color: '#F5F5F5' }}
                >
                  다시 시도
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/** 단계 표시 아이템 */
const StageItem = ({
  label,
  completed,
  active,
}: {
  label: string;
  completed: boolean;
  active: boolean;
}) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all ${
          completed ? 'border-green-500 bg-green-500/30' : active ? 'border-blue-500 bg-blue-500/20 animate-pulse' : 'border-white/30 bg-transparent'
        }`}
        style={{
          borderColor: completed ? '#4ECDC4' : active ? '#6495ED' : 'rgba(255,255,255,0.3)',
          color: completed ? '#4ECDC4' : active ? '#6495ED' : 'rgba(255,255,255,0.5)',
        }}
      >
        {completed ? '✓' : active ? '◉' : '○'}
      </div>
      <span
        className="text-sm md:text-base"
        style={{ color: completed ? '#4ECDC4' : active ? '#B0B0FF' : '#999' }}
      >
        {label}
      </span>
    </div>
  );
};
