'use client';

import { useState } from 'react';
import { InputConfig } from '@/lib/types/content';
import { Answer } from '@/lib/types/analyze';

interface CorrectionQuestionsProps {
  config: InputConfig;
  onSubmit: (answers: Answer[]) => void;
  totalSteps?: number;
  currentStep?: number;
  onClose?: () => void;
  onBack?: () => void;
}

const CorrectionQuestions = ({
  config,
  onSubmit,
  totalSteps = 7,
  currentStep = 2,
  onClose,
  onBack,
}: CorrectionQuestionsProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [collectedAnswers, setCollectedAnswers] = useState<Answer[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const questions = config.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = selectedValues.length > 0;

  const handleSelectOption = (value: string) => {
    if (currentQuestion.type === 'single') {
      setSelectedValues([value]);
    } else {
      // 복수 선택
      setSelectedValues((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
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
      onSubmit(newAnswers);
    } else {
      setCollectedAnswers(newAnswers);
      setSelectedValues([]);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const progressPercent =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6 sm:px-6">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center gap-3 justify-center">
        {/* Progress dots */}
        <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const isCompleted = idx < currentStep - 1;
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

      <div className="mx-auto w-full max-w-2xl flex-1">
        {/* 진행 상태 */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-highlight">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-xs text-highlight/30">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-secondary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="mb-10 rounded-2xl border border-white/5 bg-surface/20 p-6 sm:p-8">
          {/* 질문 텍스트 + 안내 */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-bold leading-relaxed text-highlight sm:text-xl">
              {currentQuestion.text}
            </h2>
            {currentQuestion.type === 'multiple' && (
              <p className="text-xs text-highlight/35">여러 개 선택할 수 있어</p>
            )}
          </div>

          {/* 선택지 */}
          <div className="space-y-2">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-all sm:px-5 sm:py-4 ${
                    isSelected
                      ? 'border-secondary bg-secondary/15 text-highlight'
                      : 'border-white/5 bg-white/5 text-highlight/70 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* 선택 상태 표시 (single / multiple) */}
                    <div
                      className={`h-4 w-4 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'border-secondary bg-secondary'
                          : 'border-highlight/30'
                      }`}
                    >
                      {isSelected && currentQuestion.type === 'single' && (
                        <div className="h-full w-full rounded-full bg-white opacity-30" />
                      )}
                      {isSelected && currentQuestion.type === 'multiple' && (
                        <svg
                          className="h-full w-full text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium sm:text-base">
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`flex-1 rounded-xl px-5 py-3 font-semibold transition-all sm:py-4 ${
              isAnswered
                ? 'bg-secondary text-white hover:bg-secondary/90'
                : 'bg-white/5 text-highlight/30 cursor-not-allowed'
            }`}
          >
            {isLastQuestion ? '제출' : '다음'}
          </button>
        </div>

        {/* 빈 공간 (모바일 여유) */}
        <div className="h-8 sm:h-0" />
      </div>
    </div>
  );
};

export default CorrectionQuestions;
