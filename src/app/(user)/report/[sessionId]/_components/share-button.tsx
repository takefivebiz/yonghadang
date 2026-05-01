'use client';

import { useState } from 'react';

export const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API 미지원 환경 무시
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-full border border-[#E8D4F0] bg-white px-5 py-2.5 text-sm font-medium text-[#4A3B5C] transition hover:bg-[#F5D7E8]/30"
    >
      {copied ? '✓ 복사됨' : '🔗 링크 공유'}
    </button>
  );
};
