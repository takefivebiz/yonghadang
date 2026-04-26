import { Suspense } from 'react';
import { type Metadata } from 'next';
import { AnalyzeClient } from './_components/analyze-client';

export const metadata: Metadata = {
  title: '분석 시작 | Corelog',
  description: '당신의 상황을 분석해 하나의 리포트로 만듭니다.',
  robots: { index: false },
};

const AnalyzePage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ backgroundColor: '#FAF8F5' }}>
      {/* useSearchParams 사용으로 Suspense 필요 */}
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          </div>
        }
      >
        <AnalyzeClient />
      </Suspense>
    </div>
  );
};

export default AnalyzePage;
