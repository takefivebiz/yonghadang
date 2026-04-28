'use client';

import { useEffect, useState } from 'react';

/**
 * 브라우저 네트워크 상태를 실시간으로 반환하는 훅.
 * navigator.onLine 초기값 + online/offline 이벤트로 동기화.
 */
export const useNetworkStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
