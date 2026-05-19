"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  InputConfig,
  InputStepSingleChoice,
  InputStepMultiChoice,
} from "@/lib/types/content";
import { Answer } from "@/lib/types/analyze";

interface CorrectionQuestionsProps {
  config: InputConfig;
  onSubmit: (answers: Answer[]) => void;
}

const CorrectionQuestions = ({
  config,
  onSubmit,
}: CorrectionQuestionsProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [collectedAnswers, setCollectedAnswers] = useState<Answer[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // freeText step을 제외한 선택형 steps만 렌더링 대상
  const choiceSteps = config.steps.filter(
    (s): s is InputStepSingleChoice | InputStepMultiChoice =>
      s.type === "singleChoice" || s.type === "multiChoice",
  );
  const currentStep = choiceSteps[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === choiceSteps.length - 1;
  const isAnswered = selectedValues.length > 0;

  const handleSelectOption = (value: string) => {
    if (currentStep.type === "singleChoice") {
      setSelectedValues([value]);
    } else {
      setSelectedValues((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    }
  };

  const handleNext = () => {
    const newAnswer: Answer = {
      step_id: currentStep.id,
      question_text: currentStep.question,
      answer_options: selectedValues,
    };
    const newAnswers = [...collectedAnswers, newAnswer];

    if (isLastQuestion) {
      setIsExiting(true);
      setTimeout(() => {
        onSubmit(newAnswers);
      }, 300);
    } else {
      setCollectedAnswers(newAnswers);
      setSelectedValues([]);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      className="w-full flex flex-col"
      style={{
        padding: "32px 24px 40px 24px",
        background: "transparent",
        opacity: isVisible && !isExiting ? 1 : 0,
        transition: "opacity 300ms ease",
      }}
    >
      {/* 질문 화면 */}
      <div>
        {/* 상단: 고양이 + 진행률 말풍선 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "70px",
              height: "70px",
            }}
          >
            {/* 고양이 */}
            <div
              style={{
                width: "70px",
                height: "70px",
                overflow: "hidden",
                borderRadius: "8px",
                opacity: 1,
              }}
            >
              <Image
                src="/img/cat2.png"
                alt="고양이"
                width={70}
                height={70}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>

            {/* 진행률 말풍선 - 오른쪽 상단 겹침 */}
            <div
              style={{
                position: "absolute",
                right: "-55px",
                top: "-8px",
                background: "rgba(198, 172, 187, 0.095)",
                border: "1px solid rgba(198, 172, 187, 0.15)",
                borderRadius: "8px 8px 8px 0px",
                padding: "5px 9px",
                fontSize: "10px",
                color: "rgba(249, 249, 229, 0.55)",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}
            >
              질문 {currentQuestionIndex + 1} / {choiceSteps.length}
            </div>
          </div>
        </div>

        {/* 질문 영역 */}
        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "500",
              color: "rgba(249, 249, 229, 0.88)",
              lineHeight: "1.4",
              margin: "0 0 6px 0",
              letterSpacing: "-0.01em",
              whiteSpace: "pre-line",
              textAlign: "center",
            }}
          >
            {currentStep.question}
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(249, 249, 229, 0.4)",
              lineHeight: "1.5",
              margin: "0",
              fontWeight: "400",
              letterSpacing: "0.01em",
              textAlign: "center",
            }}
          >
            {currentStep.type === "multiChoice"
              ? "여러 개를 선택할 수 있어"
              : "하나를 선택해줘"}
          </p>
        </div>

        {/* 선택지 구분선 */}
        <div
          style={{
            height: "1px",
            background: "rgba(201, 139, 176, 0.12)",
            width: "50%",
            margin: "0 auto 30px auto",
          }}
        />

        {/* 선택지 리스트 */}
        <div className="mb-12 space-y-3 flex flex-col items-start w-full">
          {currentStep.options.map((option) => {
            const isSelected = selectedValues.includes(option.value);

            return (
              <button
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className="w-full text-left px-4 py-3 transition-all text-sm"
                style={{
                  background: isSelected
                    ? "rgba(209, 109, 172, 0.12)"
                    : "rgba(255, 255, 255, 0.01)",
                  border: isSelected
                    ? "1px solid rgba(209, 109, 172, 0.25)"
                    : "1px solid rgba(201, 139, 176, 0.1)",
                  color: isSelected
                    ? "rgba(249, 249, 229, 0.85)"
                    : "rgba(249, 249, 229, 0.65)",
                  borderRadius: "8px",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="w-full py-4 text-base font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            borderRadius: "12px",
            background: !isAnswered
              ? "rgba(201, 139, 176, 0.08)"
              : "rgba(201, 139, 176, 0.18)",
            border: !isAnswered
              ? "1px solid rgba(201, 139, 176, 0.12)"
              : "1px solid rgba(201, 139, 176, 0.32)",
            color: isAnswered ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.85)",
            boxShadow: !isAnswered
              ? "0 1px 2px rgba(201, 139, 176, 0.1) inset"
              : "0 4px 8px rgba(201, 139, 176, 0.15), 0 -1px 2px rgba(255, 255, 255, 0.08) inset",
            cursor: !isAnswered ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (isAnswered) {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(201, 139, 176, 0.35)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(201, 139, 176, 0.14)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 3px 6px rgba(201, 139, 176, 0.15), 0 -1px 2px rgba(255, 255, 255, 0.1) inset";
            }
          }}
          onMouseLeave={(e) => {
            if (isAnswered) {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(201, 139, 176, 0.2)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(201, 139, 176, 0.12)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 2px 4px rgba(201, 139, 176, 0.12), 0 -1px 2px rgba(255, 255, 255, 0.08) inset";
            }
          }}
          onMouseDown={(e) => {
            if (isAnswered) {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 1px 2px rgba(201, 139, 176, 0.08) inset";
            }
          }}
        >
          다음으로 →
        </button>
      </div>
    </div>
  );
};

export default CorrectionQuestions;
