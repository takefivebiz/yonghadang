'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 타이핑 효과 컴포넌트
 * AI 스트리밍 리포트의 타이핑 효과를 시뮬레이션합니다.
 */
export const TypewriterText = ({
  text,
  speed = 30,
  className = '',
  style = {},
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedText.length === text.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, text, speed]);

  return (
    <span className={className} style={style}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">▌</span>}
    </span>
  );
};
