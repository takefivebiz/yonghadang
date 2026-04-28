'use client';

import { Component, type ReactNode } from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** 커스텀 fallback UI를 외부에서 주입 가능 */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * 컴포넌트 단위 에러 경계 (PRD 12.5 시나리오 7).
 * 자식 컴포넌트에서 런타임 에러 발생 시 전체 앱 대신 해당 섹션만 Fallback UI로 대체.
 * React Error Boundary는 반드시 class 컴포넌트로 구현해야 한다.
 *
 * TODO: [백엔드 연동] componentDidCatch에서 Sentry 등 에러 로깅 서비스로 전송
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border p-8 text-center"
        style={{
          background: 'rgba(255, 107, 107, 0.08)',
          border: '1px solid rgba(255, 107, 107, 0.2)',
        }}
        role="alert"
      >
        <AlertCircle size={32} style={{ color: '#FF6B6B' }} aria-hidden="true" />
        <div>
          <p className="text-sm font-medium" style={{ color: '#F0E6FA' }}>
            이 섹션을 불러오는 중 오류가 발생했어요
          </p>
          <p className="mt-1 text-xs" style={{ color: '#B8A8D8' }}>
            잠시 후 다시 시도해주세요
          </p>
        </div>
        <button
          onClick={this.handleReset}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-white transition-all hover:opacity-80"
          style={{
            background: 'rgba(100, 149, 237, 0.25)',
            border: '1px solid rgba(100, 149, 237, 0.4)',
          }}
        >
          <RotateCw size={12} aria-hidden="true" />
          다시 시도
        </button>
      </div>
    );
  }
}
