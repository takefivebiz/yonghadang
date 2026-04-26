import { Suspense } from 'react';
import { type Metadata } from 'next';
import { AnalyzeClient } from './_components/analyze-client';
import { COLORS } from '@/lib/colors';

export const metadata: Metadata = {
  title: '분석 시작 | Corelog',
  description: '당신의 상황을 분석해 하나의 리포트로 만듭니다.',
  robots: { index: false },
};

const AnalyzePage = () => {
  return (
    <div
      className="min-h-[calc(100vh-4rem)]"
      style={{ backgroundColor: COLORS.background.page }}
    >
      {/* useSearchParams 사용으로 Suspense 필요 */}
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <style>{`
              @keyframes spin-and-pulse {
                0% {
                  transform: rotate(0deg) scale(1);
                }
                50% {
                  transform: rotate(180deg) scale(1.05);
                }
                100% {
                  transform: rotate(360deg) scale(1);
                }
              }
            `}</style>
            <div
              className="h-10 w-10 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: COLORS.text.primary,
                borderRightColor: COLORS.text.primary,
                animation: 'spin-and-pulse 1.8s ease-in-out infinite',
              }}
            />
          </div>
        }
      >
        <AnalyzeClient />
      </Suspense>
    </div>
  );
};

export default AnalyzePage;
