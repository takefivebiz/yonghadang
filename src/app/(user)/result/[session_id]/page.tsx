'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ResultCardModal from '@/components/result/result-card-modal';
import PaymentModal from '@/components/modals/payment-modal';
import { generateMockResultScenes } from '@/lib/data/dummy-result-cards';
import { ResultScene } from '@/lib/types/result';
import { AnalyzeAnswers } from '@/lib/types/analyze';


interface PageProps {
  params: Promise<{ session_id: string }>;
}

const ResultPage = ({ params }: PageProps) => {
  const [analyzeData, setAnalyzeData] = useState<AnalyzeAnswers | null>(null);
  const [resultScenes, setResultScenes] = useState<ResultScene[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // 유료 결제로 잠금 해제된 scene_index 목록 (무료 씬은 is_free 플래그로 처리)
  const [unlockedScenes, setUnlockedScenes] = useState<number[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'single' | 'all'>('single');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 드래그/스와이프 상태
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [sceneHeight, setSceneHeight] = useState(500);
  const currentSceneRef = useRef<HTMLDivElement>(null);

  // 데이터 초기화
  useEffect(() => {
    const initData = async () => {
      try {
        const param = await params;

        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`veil_analysis_${param.session_id}`);
          if (!stored) {
            setError('결과를 찾을 수 없어');
            setLoading(false);
            return;
          }
          const data = JSON.parse(stored) as AnalyzeAnswers;
          setAnalyzeData(data);
          setResultScenes(generateMockResultScenes(data.content_id));
        }
        setLoading(false);
      } catch {
        setError('데이터 로드 중 오류가 발생했어');
        setLoading(false);
      }
    };
    initData();
  }, [params]);

  // 현재 씬 높이 측정 (carousel 컨테이너 min-height용)
  useEffect(() => {
    if (currentSceneRef.current) {
      setSceneHeight(currentSceneRef.current.offsetHeight);
    }
  }, [currentIndex, resultScenes]);

  // 스와이프 임계값: 화면 너비의 28%
  const getThreshold = () =>
    typeof window !== 'undefined' ? window.innerWidth * 0.28 : 100;

  const commitSwipe = (offset: number) => {
    if (offset > getThreshold() && currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else if (offset < -getThreshold() && currentIndex < resultScenes.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
    setDragStart(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientX);
    setIsDragging(true);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStart === null) return;
    setDragOffset(e.clientX - dragStart);
  };
  const handleMouseUp = () => {
    if (dragStart === null) return;
    commitSwipe(dragOffset);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStart === null) return;
    setDragOffset(e.touches[0].clientX - dragStart);
  };
  const handleTouchEnd = () => {
    if (dragStart === null) return;
    commitSwipe(dragOffset);
  };

  const handleOpenScene = (sceneIdx: number) => {
    setSelectedSceneIndex(sceneIdx);
    setPaymentType('single');
    setIsPaymentModalOpen(true);
  };

  const handleUnlockAll = () => {
    setPaymentType('all');
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = () => {
    if (paymentType === 'single' && selectedSceneIndex !== null) {
      const scene = resultScenes[selectedSceneIndex];
      setUnlockedScenes((prev) => [...new Set([...prev, scene.scene_index])]);
    } else if (paymentType === 'all') {
      // 유료 씬 전체 잠금 해제
      const paidIndices = resultScenes
        .filter((s) => !s.is_free)
        .map((s) => s.scene_index);
      setUnlockedScenes(paidIndices);
    }
    setIsPaymentModalOpen(false);
  };

  // ── 로딩 ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-6 text-[11px] tracking-widest uppercase" style={{ color: 'rgba(209,109,172,0.35)' }}>
            reading your energy
          </p>
          <div className="mx-auto h-5 w-5 animate-spin rounded-full border border-white/15 border-t-white/50" />
        </div>
      </div>
    );
  }

  // ── 에러 ──────────────────────────────────────────────────────
  if (error || !analyzeData || resultScenes.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="mb-8 text-sm" style={{ color: 'rgba(249,249,229,0.35)' }}>
          {error || '결과를 찾을 수 없어'}
        </p>
        <Link
          href="/"
          className="text-xs transition-opacity duration-200 opacity-40 hover:opacity-70"
          style={{ color: 'rgba(94,153,171,0.9)' }}
        >
          처음으로 돌아가기
        </Link>
      </div>
    );
  }

  const paidSceneCount = resultScenes.filter((s) => !s.is_free).length;
  const isAllUnlocked = unlockedScenes.length >= paidSceneCount;
  const tiltDeg = isDragging ? Math.max(-3, Math.min(3, -dragOffset / 35)) : 0;

  return (
    <div
      className="min-h-screen flex flex-col select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 헤더 */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 pt-5 pb-3">
        <Link
          href="/"
          className="text-[11px] tracking-widest uppercase transition-opacity duration-200 opacity-25 hover:opacity-50"
          style={{ color: 'rgba(249,249,229,1)' }}
        >
          Veil
        </Link>
        {/* 씬 인디케이터 */}
        <div className="flex items-center gap-1.5">
          {resultScenes.map((_, i) => (
            <span
              key={i}
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? '16px' : '4px',
                height: '4px',
                background:
                  i === currentIndex
                    ? 'rgba(209, 109, 172, 0.75)'
                    : 'rgba(255, 255, 255, 0.18)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 씬 캐러셀 ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center pt-3 pb-12 overflow-visible">
        <div
          className="relative w-full max-w-[420px] overflow-visible"
          style={{ minHeight: sceneHeight }}
        >
          {resultScenes.map((scene, index) => {
            const offset = index - currentIndex;
            const isCurrent = offset === 0;
            const isSide = Math.abs(offset) === 1;

            const tx = offset * 106;
            const dragX = isCurrent ? dragOffset : 0;
            const neighborX = isSide ? dragOffset * 0.12 : 0;

            const scale = isCurrent ? 1 : isSide ? 0.92 : 0.82;
            // 카드 없는 구조에서 옆 씬 내용이 어색하게 보이지 않도록 opacity 최소화
            const opacity = isCurrent ? 1 : isSide ? 0.10 : 0;
            const rotate = isCurrent ? tiltDeg : 0;

            const isSceneUnlocked =
              scene.is_free || unlockedScenes.includes(scene.scene_index);

            return (
              <div
                key={index}
                ref={isCurrent ? currentSceneRef : null}
                className={`absolute inset-x-0 top-0 transition-all ease-out select-none ${
                  isDragging ? 'duration-0' : 'duration-300'
                } ${isSide ? 'overflow-hidden max-h-[500px]' : ''}`}
                style={{
                  transform: `translateX(calc(${tx}% + ${dragX + neighborX}px)) scale(${scale}) rotate(${rotate}deg)`,
                  opacity,
                  zIndex: resultScenes.length - Math.abs(offset),
                  pointerEvents: isCurrent ? 'auto' : 'none',
                  transformOrigin: 'center bottom',
                }}
              >
                <ResultCardModal
                  scene={scene}
                  isUnlocked={isSceneUnlocked}
                  onOpenScene={() => handleOpenScene(index)}
                  onUnlockAll={handleUnlockAll}
                  isAllUnlocked={isAllUnlocked}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 결제 모달 */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onComplete={handlePaymentComplete}
          paymentType={paymentType}
          cardTitle={
            selectedSceneIndex !== null
              ? `scene ${resultScenes[selectedSceneIndex]?.scene_index}`
              : undefined
          }
        />
      )}
    </div>
  );
};

export default ResultPage;
