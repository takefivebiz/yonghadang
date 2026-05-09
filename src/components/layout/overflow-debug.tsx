'use client';

import { useEffect, useState } from 'react';

export const OverflowDebug = () => {
  const [overflowElements, setOverflowElements] = useState<any[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const elements = [...document.querySelectorAll('*')]
        .filter((el) => el.scrollWidth > document.documentElement.clientWidth)
        .map((el) => ({
          tag: el.tagName,
          class: (el as HTMLElement).className?.slice(0, 40) || 'no-class',
          scrollWidth: el.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          diff: el.scrollWidth - document.documentElement.clientWidth,
        }));

      setOverflowElements(elements);
      // 자동으로 한 번 표시
      if (elements.length > 0) {
        setShowDebug(true);
      }
    };

    // 초기 확인
    setTimeout(checkOverflow, 500);

    // 창 크기 변경 시 재확인
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  if (!showDebug || overflowElements.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 max-h-64 overflow-y-auto bg-black/90 text-white text-xs p-3"
      style={{ fontSize: '11px' }}
    >
      <div className="font-bold mb-2">🚨 Overflow Elements ({overflowElements.length})</div>
      {overflowElements.map((el, idx) => (
        <div key={idx} className="mb-2 pb-2 border-b border-red-500/30">
          <div>
            <strong>{el.tag}</strong> +{el.diff}px
          </div>
          <div className="text-red-400">{el.class}</div>
          <div className="text-gray-400">
            scrollW: {el.scrollWidth} | clientW: {el.clientWidth}
          </div>
        </div>
      ))}
      <button
        onClick={() => setShowDebug(false)}
        className="mt-2 px-2 py-1 bg-red-600 rounded text-xs"
      >
        닫기
      </button>
    </div>
  );
};
