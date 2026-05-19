"use client";

import { useState } from "react";
import Image from "next/image";
import { InputConfig } from "@/lib/types/content";

const placeholderStyles = `
  .veil-textarea::placeholder {
    color: rgba(249, 249, 229, 0.25);
    font-weight: 400;
  }

  .veil-textarea {
    scrollbar-width: thin;
    scrollbar-color: rgba(143, 122, 216, 0.18) transparent;
  }

  .veil-textarea::-webkit-scrollbar {
    width: 6px;
  }

  .veil-textarea::-webkit-scrollbar-track {
    background: transparent;
  }

  .veil-textarea::-webkit-scrollbar-thumb {
    background: rgba(143, 122, 216, 0.18);
    border-radius: 3px;
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

const TypeAInput = ({ config, onSubmit }: TypeAInputProps) => {
  const [input, setInput] = useState("");

  const freeStep = config.steps.find((s) => s.type === "freeText");
  const placeholder = freeStep?.type === "freeText" ? freeStep.placeholder : "";
  const exampleInputs =
    freeStep?.type === "freeText" ? (freeStep.example_inputs ?? []) : [];

  const isInputExactlyExample = exampleInputs.includes(input.trim());
  const isInputEmpty = input.trim().length === 0;
  const isSubmitDisabled = isInputEmpty || isInputExactlyExample;

  const handleSubmit = () => {
    if (!isSubmitDisabled) {
      onSubmit(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const charCount = input.length;
  const maxChars = 500;

  return (
    <div
      className="w-full flex flex-col"
      style={{
        padding: "32px 24px 40px 24px",
        background: "transparent",
      }}
    >
      <style>{placeholderStyles}</style>

      {/* 상단 Hero 영역 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "35px",
          gap: "24px",
        }}
      >
        {/* 왼쪽: Editorial 텍스트 */}
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "500",
              color: "rgba(249, 249, 229, 0.88)",
              lineHeight: "1.3",
              margin: "0 0 14px 0",
              letterSpacing: "-0.01em",
            }}
          >
            먼저, <br />
            <span style={{ color: "rgba(143, 122, 216, 0.88)" }}>
              지금 네 상황을{" "}
            </span>
            <br />
            편하게 말해줘.
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(249, 249, 229, 0.45)",
              lineHeight: "1.6",
              margin: "0",
              fontWeight: "400",
              letterSpacing: "0.01em",
            }}
          >
            솔직하게 말해줄수록 <br />더 정확하게 볼 수 있어.
          </p>
        </div>

        {/* 오른쪽: 고양이 */}
        <div
          style={{
            width: "140px",
            height: "120px",
            minWidth: "120px",
            overflow: "hidden",
            marginTop: "8px",
          }}
        >
          <Image
            src="/img/cat2.png"
            alt="고양이"
            width={80}
            height={80}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* 노트북 스타일 Textarea */}
      <div
        style={{
          display: "flex",
          background: "rgba(249, 229, 229, 0.03)",
          border: "1px solid rgba(143, 122, 216, 0.14)",
          borderRadius: "6px",
          overflow: "hidden",
          marginBottom: "5px",
        }}
      >
        {/* 왼쪽 바인더 영역 */}
        <div
          style={{
            width: "20px",
            borderRight: "1px solid rgba(143, 122, 216, 0.11)",
            background: "rgba(143, 122, 216, 0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "16px",
            gap: "20px",
            paddingBottom: "16px",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "rgba(48, 31, 41, 0.15)",
                border: "1px solid rgba(143, 122, 216, 0.34)",
              }}
            />
          ))}
        </div>

        {/* 오른쪽 입력 영역 */}
        <div
          style={{
            flex: 1,
            position: "relative",
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 23px,
              rgba(143, 122, 216, 0.028) 23px,
              rgba(143, 122, 216, 0.042) 24px
            )`,
            backgroundSize: "100% 24px",
            backgroundAttachment: "local",
            backgroundPosition: "0 12px",
            paddingLeft: "0",
          }}
        >
          <textarea
            className="veil-textarea"
            value={input}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                setInput(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              width: "100%",
              minHeight: "220px",
              padding: "12px 16px",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "14px",
              lineHeight: "24px",
              color: "rgba(249, 249, 229, 0.8)",
              caretColor: "rgba(143, 122, 216, 0.58)",
              fontFamily: "inherit",
              fontWeight: "400",
            }}
          />

          {/* 글자수 카운터 */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "16px",
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.2)",
              pointerEvents: "none",
            }}
          >
            {charCount} / {maxChars}
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div
        style={{
          fontSize: "11px",
          color: "rgba(255, 255, 255, 0.2)",
          margin: "6px 0 40px 0",
          letterSpacing: "0.01em",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "6px",
        }}
      >
        <span>입력한 내용은 결과 흐름에만 사용돼.</span>
      </div>

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className="w-full py-4 text-base font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          borderRadius: "12px",
          background: isSubmitDisabled
            ? "rgba(143, 122, 216, 0.08)"
            : "rgba(143, 122, 216, 0.12)",
          border: isSubmitDisabled
            ? "1px solid rgba(143, 122, 216, 0.12)"
            : "1px solid rgba(143, 122, 216, 0.2)",
          color: "rgba(255, 255, 255, 0.85)",
          boxShadow: isSubmitDisabled
            ? "0 1px 2px rgba(143, 122, 216, 0.1) inset"
            : "0 2px 4px rgba(143, 122, 216, 0.12), 0 -1px 2px rgba(255, 255, 255, 0.08) inset",
          cursor: isSubmitDisabled ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!isSubmitDisabled) {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(143, 122, 216, 0.35)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(143, 122, 216, 0.14)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 3px 6px rgba(143, 122, 216, 0.15), 0 -1px 2px rgba(255, 255, 255, 0.1) inset";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitDisabled) {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(143, 122, 216, 0.2)";
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(143, 122, 216, 0.12)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 2px 4px rgba(143, 122, 216, 0.12), 0 -1px 2px rgba(255, 255, 255, 0.08) inset";
          }
        }}
        onMouseDown={(e) => {
          if (!isSubmitDisabled) {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 1px 2px rgba(143, 122, 216, 0.08) inset";
          }
        }}
      >
        다음으로 →
      </button>
    </div>
  );
};

export default TypeAInput;
