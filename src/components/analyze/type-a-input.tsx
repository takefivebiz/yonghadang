"use client";

import { useState } from "react";
import { InputConfig } from "@/lib/types/content";

const placeholderStyles = `
  .veil-textarea::placeholder {
    color: rgba(249, 249, 229, 0.18);
    font-weight: 400;
  }
`;

interface TypeAInputProps {
  config: InputConfig;
  onSubmit: (input: string) => void;
  totalSteps?: number;
  currentStep?: number;
  onClose?: () => void;
  onBack?: () => void;
}

const TypeAInput = ({
  config,
  onSubmit,
  totalSteps = 7,
  currentStep = 1,
}: TypeAInputProps) => {
  const [input, setInput] = useState("");

  // 입력값이 예시와 정확히 동일하면 비활성화
  const isInputExactlyExample = config.example_inputs.includes(input.trim());
  const isInputEmpty = input.trim().length === 0;
  const isSubmitDisabled = isInputEmpty || isInputExactlyExample;

  const handleSubmit = () => {
    if (!isSubmitDisabled) {
      onSubmit(input);
    }
  };

  const charCount = input.length;
  const maxChars = 500;

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6 sm:px-6">
      <style>{placeholderStyles}</style>

      {/* Progress indicator */}
      <div className="mb-10 flex items-center gap-3 justify-center">
        {/* Progress dots */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep - 1;

            return (
              <div key={idx} className="flex items-center gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    isCurrent ? "ring-1 ring-offset-1" : ""
                  }`}
                  style={{
                    backgroundColor: isCompleted
                      ? "rgba(209, 109, 172, 0.5)"
                      : "rgba(255, 255, 255, 0.08)",
                    boxShadow: isCurrent
                      ? "0 0 0 2px rgba(0, 0, 0, 0.8), 0 0 0 3px rgba(209, 109, 172, 0.3)"
                      : "none",
                  }}
                />
                {idx < totalSteps - 1 && (
                  <div
                    className="h-px transition-colors"
                    style={{
                      width: "20px",
                      backgroundColor: isCompleted
                        ? "rgba(209, 109, 172, 0.2)"
                        : "rgba(255, 255, 255, 0.04)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col">
        {/* 타이틀 */}
        <div className="mb-10 sm:mb-14 mt-4 ml-4">
          <h1 className="text-2xl sm:text-3xl font-semibold leading-tight mb-3">
            <span style={{ color: "rgba(249, 249, 229, 0.85)" }}>먼저,</span>
            <br />
            <span style={{ color: "rgba(209, 109, 172, 0.8)" }}>
              지금 네 상황을
            </span>
            <br />
            <span style={{ color: "rgba(249, 249, 229, 0.85)" }}>
              자유롭게 적어줘.
            </span>
          </h1>
          <p className="text-xs text-highlight/30">
            솔직하게 말해줄수록 더 정확한 흐름을 볼 수 있어.
          </p>
        </div>

        {/* 입력 영역 */}
        <div
          className="mb-8 sm:mb-10 flex flex-col rounded-2xl p-5 sm:p-6 transition-all"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
            placeholder={config.placeholder}
            className="veil-textarea w-full resize-none bg-transparent text-base text-highlight outline-none leading-relaxed h-32 sm:h-40"
            style={{
              color: "rgba(249, 249, 229, 0.85)",
              caretColor: "rgba(209, 109, 172, 0.5)",
            }}
            onFocus={(e) => {
              e.currentTarget.parentElement!.style.borderColor =
                "rgba(209, 109, 172, 0.15)";
              e.currentTarget.parentElement!.style.background =
                "rgba(209, 109, 172, 0.04)";
            }}
            onBlur={(e) => {
              e.currentTarget.parentElement!.style.borderColor =
                "rgba(255, 255, 255, 0.08)";
              e.currentTarget.parentElement!.style.background =
                "rgba(255, 255, 255, 0.02)";
            }}
          />

          {/* 글자 수 */}
          <div className="flex justify-end pt-2 border-t border-white/5">
            <span
              className="text-xs mt-2"
              style={{ color: "rgba(255, 255, 255, 0.086)" }}
            >
              {charCount} / {maxChars}
            </span>
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-full rounded-[16px] px-6 py-4 font-medium transition-all sm:py-5"
          style={{
            background: isSubmitDisabled
              ? "rgba(255, 255, 255, 0.03)"
              : "linear-gradient(135deg, rgba(180, 110, 160, 0.75) 0%, rgba(155, 95, 140, 0.75) 100%)",
            border: isSubmitDisabled
              ? "1px solid rgba(255, 255, 255, 0.05)"
              : "1px solid rgba(220, 150, 200, 0.35)",
            color: isSubmitDisabled
              ? "rgba(255, 255, 255, 0.109)"
              : "rgba(255, 245, 250, 0.88)",
            cursor: isSubmitDisabled ? "not-allowed" : "pointer",
            boxShadow: isSubmitDisabled
              ? "none"
              : "0 4px 16px rgba(180, 110, 160, 0.15)",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitDisabled) {
              e.currentTarget.style.opacity = "0.9";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitDisabled) {
              e.currentTarget.style.opacity = "1";
            }
          }}
        >
          이어서 →
        </button>

        {/* 하단 안내 */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: "rgba(255, 255, 255, 0.271)" }}
        >
          입력한 내용은 결과 흐름에만 사용돼.
        </p>
      </div>
    </div>
  );
};

export default TypeAInput;
