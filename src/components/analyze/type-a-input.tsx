'use client';

import { useState } from 'react';
import { InputConfig } from '@/lib/types/content';

interface TypeAInputProps {
  config: InputConfig;
  onSubmit: (input: string) => void;
}

const TypeAInput = ({ config, onSubmit }: TypeAInputProps) => {
  const [input, setInput] = useState('');
  const [expandedExampleIndex, setExpandedExampleIndex] = useState<
    number | null
  >(null);

  // 입력값이 예시와 정확히 동일하면 비활성화
  const isInputExactlyExample = config.example_inputs.includes(input.trim());
  const isInputEmpty = input.trim().length === 0;
  const isSubmitDisabled = isInputEmpty || isInputExactlyExample;

  const handleExampleClick = (example: string) => {
    setInput(example);
    setExpandedExampleIndex(null);
  };

  const handleSubmit = () => {
    if (!isSubmitDisabled) {
      onSubmit(input);
    }
  };

  const charCount = input.length;
  const maxChars = 500;

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl flex-1">
        {/* 헤더 */}
        <div className="mb-10">
          <h1 className="mb-2 text-xl font-bold text-highlight sm:text-2xl">
            지금 상황을 알려줄래?
          </h1>
          <p className="text-sm text-highlight/50">
            솔직하고 구체적으로 설명할수록, AI가 더 정확하게 이해할 수 있어.
          </p>
        </div>

        {/* 입력 영역 */}
        <div className="mb-8 rounded-2xl border border-white/5 bg-surface/20 p-5 sm:p-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
            placeholder={config.placeholder}
            className="h-48 w-full resize-none bg-transparent text-base text-highlight placeholder-highlight/30 outline-none sm:h-56 sm:text-lg"
          />

          {/* 글자 수 표시 */}
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-xs text-highlight/30">
              {charCount} / {maxChars}
            </span>
            {isInputExactlyExample && (
              <span className="text-xs text-accent/60">
                예시 문장과 동일한 내용은 제출할 수 없어요
              </span>
            )}
          </div>
        </div>

        {/* 예시 문장 아코디언 (통합) */}
        <div className="mb-10">
          <div className="rounded-xl border border-white/5 bg-surface/20 transition-all">
            <button
              onClick={() =>
                setExpandedExampleIndex(
                  expandedExampleIndex === 0 ? null : 0
                )
              }
              className="w-full px-4 py-3 text-left transition-colors hover:bg-surface/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-highlight/50">
                  예시 문장이 필요하면 클릭
                </span>
                <svg
                  className={`h-3.5 w-3.5 text-highlight/40 transition-transform ${
                    expandedExampleIndex === 0 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>

            {/* 확장된 예시 목록 */}
            {expandedExampleIndex === 0 && (
              <div className="border-t border-white/5 px-4 py-4">
                <div className="space-y-2">
                  {config.example_inputs.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExampleClick(example)}
                      className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left text-xs leading-relaxed text-highlight/60 transition-all hover:border-secondary/50 hover:bg-secondary/10 hover:text-highlight/70 sm:text-sm"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`flex-1 rounded-xl px-5 py-3 font-semibold transition-all sm:py-4 ${
              isSubmitDisabled
                ? 'bg-white/5 text-highlight/30 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-secondary/90'
            }`}
          >
            다음
          </button>
        </div>

        {/* 빈 공간 (모바일 여유) */}
        <div className="h-8 sm:h-0" />
      </div>
    </div>
  );
};

export default TypeAInput;
