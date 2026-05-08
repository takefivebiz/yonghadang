'use client';

import Link from 'next/link';

interface ResultActionsProps {
  sessionId: string;
  contentId: string;
}

const ResultActions = ({ sessionId, contentId }: ResultActionsProps) => {
  // TODO: [공유 기능] 실제 공유 URL 생성 로직 구현
  const handleShareKakao = () => {
    console.log('카카오 공유:', { sessionId, contentId });
    // TODO: [공유 기능] 카카오 공유 API 연동
  };

  const handleShareX = () => {
    console.log('X 공유:', { sessionId, contentId });
    // TODO: [공유 기능] X 공유 API 연동
  };

  const handleCopyLink = () => {
    console.log('링크 복사:', { sessionId, contentId });
    // TODO: [공유 기능] 공유 링크 생성 및 복사
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12 space-y-8">
      {/* 공유 버튼들 */}
      <div className="flex items-center justify-center gap-2">
        {/* 카카오 */}
        <button
          onClick={handleShareKakao}
          className="p-3 transition-opacity duration-200 opacity-50 hover:opacity-80"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: 'rgba(249,249,229,0.7)' }}
          >
            <path d="M12 2C6.48 2 2 5.58 2 10c0 2.54 1.19 4.85 3.1 6.29-.13 1.61-.98 3.99-2.1 4.71 1.32-.39 3.85-1.24 5.57-2.71.73.12 1.5.18 2.33.18 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
          </svg>
        </button>

        {/* X */}
        <button
          onClick={handleShareX}
          className="p-3 transition-opacity duration-200 opacity-50 hover:opacity-80"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: 'rgba(249,249,229,0.7)' }}
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.947 6.75h-3.315l7.73-8.835L2.42 2.25h6.787l4.682 6.191 5.555-6.191zM17.15 18.75h1.828L5.293 3.75H3.32l13.83 15z" />
          </svg>
        </button>

        {/* 링크 복사 */}
        <button
          onClick={handleCopyLink}
          className="p-3 transition-opacity duration-200 opacity-50 hover:opacity-80"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: 'rgba(249,249,229,0.7)' }}
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      </div>

      {/* 다른 콘텐츠 보기 */}
      <div>
        <Link
          href="/"
          className="text-center block py-3 text-xs transition-opacity duration-200 opacity-40 hover:opacity-70"
          style={{ color: 'rgba(249,249,229,0.6)' }}
        >
          다른 콘텐츠 보기
        </Link>
      </div>
    </div>
  );
};

export default ResultActions;
