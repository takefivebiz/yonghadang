'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  style?: React.CSSProperties;
  /** true이면 애니메이션 없이 전체 텍스트를 즉시 표시 (재방문 시 사용) */
  instant?: boolean;
}

/**
 * 타이핑 효과 컴포넌트
 * AI 스트리밍 리포트의 타이핑 효과를 시뮬레이션합니다.
 * instant=true이면 전체 텍스트를 즉시 렌더링 (재방문·새로고침 UX 최적화).
 */
export const TypewriterText = ({
  text,
  speed = 30,
  className = '',
  style = {},
  instant = false,
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState(instant ? text : '');
  const [isComplete, setIsComplete] = useState(instant);

  useEffect(() => {
    // instant 전환 시 즉시 완료 상태로 동기화
    if (instant) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    if (displayedText.length === text.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, text, speed, instant]);

  return (
    <span className={className} style={style}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">▌</span>}
    </span>
  );
};
