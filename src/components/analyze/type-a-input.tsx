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
    <div className="w-full max-w-lg mx-auto overflow-x-hidden flex min-h-screen flex-col bg-background px-4 py-6 sm:px-6">
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
      <div className="w-full flex-1 flex flex-col px-4 sm:px-6">
        {/* 타이틀 버블 */}
        <div
          className="mb-10 p-5 sm:p-6 self-start"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.015)",
            borderRadius: "14px 14px 14px 0px",
            maxWidth: "220px",
          }}
        >
          <h1 className="text-lg sm:text-xl font-semibold leading-tight mb-3">
            <span style={{ color: "rgba(249, 249, 229, 0.85)" }}>먼저,</span>
            <br />
            <span style={{ color: "rgba(209, 109, 172, 0.8)" }}>
              지금 네 상황을
            </span>
            <br />
            <span style={{ color: "rgba(249, 249, 229, 0.85)" }}>
              편하게 말해줘.
            </span>
          </h1>
          <p className="text-xs" style={{ color: "rgba(249, 249, 229, 0.5)" }}>
            솔직하게 말해줄수록 <br />더 정확한 흐름을 볼 수 있어.
          </p>
        </div>

        {/* 입력 영역 */}
        <div
          className="mb-3 flex flex-col p-5 sm:p-5 transition-all ml-auto"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px 14px 0px 14px",
            maxWidth: "250px",
            width: "250px",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
            placeholder={config.placeholder}
            className="veil-textarea w-full resize-none bg-transparent text-[14px] text-highlight outline-none leading-relaxed h-32 sm:h-40 mb-5"
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
          <div className="flex justify-end pt-3 border-t border-white/5">
            <span
              className="text-xs"
              style={{ color: "rgba(255, 255, 255, 0.086)" }}
            >
              {charCount} / {maxChars}
            </span>
          </div>
        </div>

        {/* 하단 안내 */}
        <p
          className="text-xs mt-1 ml-auto"
          style={{ color: "rgba(255, 255, 255, 0.271)" }}
        >
          입력한 내용은 결과 흐름에만 사용돼.
        </p>

        {/* 다음 버튼 */}
        <div className="flex justify-end mt-8 w-full">
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="text-sm transition-all"
            style={{
              background: "none",
              border: "none",
              cursor: isSubmitDisabled ? "not-allowed" : "pointer",
              color: isSubmitDisabled
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(209, 109, 172, 0.8)",
              padding: "0",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitDisabled) {
                e.currentTarget.style.color = "rgba(209, 109, 172, 1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitDisabled) {
                e.currentTarget.style.color = "rgba(209, 109, 172, 0.8)";
              }
            }}
          >
            계속 {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeAInput;
