'use client';

import { useEffect } from 'react';

export const ViewportMeta = () => {
  useEffect(() => {
    // 기존 viewport meta의 content만 업데이트
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no'
      );
    }
  }, []);

  return null;
};
