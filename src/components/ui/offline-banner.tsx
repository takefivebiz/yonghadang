'use client';

import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/use-network-status';

/**
 * 네트워크 오프라인 상태 감지 배너.
 * offline 이벤트 발생 시 화면 최상단에 고정 노출, 복귀 시 자동 사라짐.
 */
export const OfflineBanner = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white"
      style={{
        background: 'rgba(160, 30, 30, 0.96)',
        backdropFilter: 'blur(8px)',
      }}
      role="alert"
      aria-live="assertive"
    >
      <WifiOff size={14} aria-hidden="true" />
      인터넷 연결이 끊겼어요. 연결 상태를 확인해주세요.
    </div>
  );
};
