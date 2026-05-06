'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TypeAInput from '@/components/analyze/type-a-input';
import CorrectionQuestions from '@/components/analyze/correction-questions';
import { getInputConfig } from '@/lib/data/dummy-analyze-config';
import { AnalyzeState, Answer, AnalyzeAnswers } from '@/lib/types/analyze';

interface PageProps {
  params: Promise<{ session_id: string }>;
}

const AnalyzePage = ({ params }: PageProps) => {
  // TODO: [백엔드 연동] params를 await해서 실제 session_id 사용
  const session_id = 'mock-session-001';

  const router = useRouter();

  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>({
    session_id,
    content_id: 'love-1',
    stage: 'free_input',
    free_input: '',
    answers: [],
  });

  const [isCompleted, setIsCompleted] = useState(false);

  // 완료 후 2초 뒤 결과 페이지로 자동 이동
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        router.push(`/result/${analyzeState.session_id}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, analyzeState.session_id, router]);

  // TODO: [백엔드 연동] content_id를 세션에서 가져와 input_config 로드
  const config = getInputConfig(analyzeState.content_id);

  // 자유 입력 완료 → 보정 질문 단계로
  const handleFreeInputSubmit = (input: string) => {
    setAnalyzeState((prev) => ({
      ...prev,
      free_input: input,
      stage: 'correction_questions',
    }));
  };

  // 보정 질문 완료 → localStorage 저장 후 결과 페이지로
  const handleCorrectionSubmit = (answers: Answer[]) => {
    const finalData: AnalyzeAnswers = {
      session_id: analyzeState.session_id,
      content_id: analyzeState.content_id,
      free_input: analyzeState.free_input,
      answers,
      created_at: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `veil_analysis_${analyzeState.session_id}`,
        JSON.stringify(finalData)
      );
    }

    // TODO: [백엔드 연동] POST /api/analyze/[session_id]/answers 호출 후
    //       POST /api/analyze/[session_id]/generate 호출
    console.log('📝 최종 제출 데이터:', finalData);

    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 완료 화면 */}
      {isCompleted && (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-3 text-2xl font-bold text-highlight sm:text-3xl">
              답변이 정리됐어
            </h1>
            <p className="mb-8 text-sm text-highlight/50">
              결과를 준비하고 있어...
            </p>
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
            </div>
          </div>
        </div>
      )}

      {/* 입력 단계 */}
      {!isCompleted && (
        <>
          {analyzeState.stage === 'free_input' && (
            <TypeAInput config={config} onSubmit={handleFreeInputSubmit} />
          )}
          {analyzeState.stage === 'correction_questions' && (
            <CorrectionQuestions
              config={config}
              onSubmit={handleCorrectionSubmit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AnalyzePage;
