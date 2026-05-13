"use client";

import { useState, useEffect } from "react";
import { InputConfig } from "@/lib/types/content";
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

  const questions = config.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = selectedValues.length > 0;

  const handleSelectOption = (value: string) => {
    if (currentQuestion.type === "single") {
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
      question_index: currentQuestion.index,
      question_text: currentQuestion.text,
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
      className="flex min-h-screen flex-col bg-background px-4 py-6 sm:px-6 relative transition-opacity duration-300"
      style={{
        opacity: isVisible && !isExiting ? 1 : 0,
      }}
    >
      {/* Progress indicator */}
      <div className="mb-12 flex items-center gap-3 justify-center">
        <div className="flex items-center gap-1">
          {Array.from({ length: 7 }).map((_, idx) => {
            const isCompleted = idx < currentQuestionIndex + 1;
            const isCurrent = idx === currentQuestionIndex + 1;

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
                {idx < 6 && (
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

      <div className="w-full flex-1 flex flex-col px-4 sm:px-6">
        {/* 질문 화면 */}
        <div className="w-full">
          {/* 질문 버블 */}
          <div
            className="mb-10 p-5 sm:p-6"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.015)",
              borderRadius: "14px 14px 14px 0px",
              maxWidth: "220px",
            }}
          >
            <p
              className="text-xs mb-4"
              style={{ color: "rgba(255, 255, 255, 0.25)" }}
            >
              질문 {currentQuestionIndex + 1}
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold leading-tight mb-4 whitespace-pre-line">
              {currentQuestion.text}
            </h1>
            <p
              className="text-xs"
              style={{ color: "rgba(249, 249, 229, 0.5)" }}
            >
              {currentQuestion.type === "multiple"
                ? "여러 개 선택할 수 있어"
                : "하나를 선택해줘"}
            </p>
          </div>

          {/* 선택지 */}
          <div className="mb-12 space-y-2 flex flex-col items-end">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  className="text-right px-4 py-3 sm:px-5 sm:py-4 transition-all max-w-xs"
                  style={{
                    background: isSelected
                      ? "rgba(209, 109, 172, 0.15)"
                      : "rgba(255, 255, 255, 0.02)",
                    border: isSelected
                      ? "1px solid rgba(209, 109, 172, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.05)",
                    color: isSelected
                      ? "rgba(249, 249, 229, 0.85)"
                      : "rgba(249, 249, 229, 0.60)",
                    borderRadius: "14px 14px 0px 14px",
                  }}
                >
                  <span className="text-sm sm:text-base">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* 다음 버튼 */}
          <div
            className="mt-auto flex justify-end"
            style={{ maxWidth: "310px" }}
          >
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="text-sm transition-all"
              style={{
                background: "none",
                border: "none",
                cursor: isAnswered ? "pointer" : "not-allowed",
                color: isAnswered
                  ? "rgba(209, 109, 172, 0.8)"
                  : "rgba(255, 255, 255, 0.15)",
                padding: "0",
              }}
              onMouseEnter={(e) => {
                if (isAnswered) {
                  e.currentTarget.style.color = "rgba(209, 109, 172, 1)";
                }
              }}
              onMouseLeave={(e) => {
                if (isAnswered) {
                  e.currentTarget.style.color = "rgba(209, 109, 172, 0.8)";
                }
              }}
            >
              계속 {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectionQuestions;
