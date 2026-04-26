'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnalysisCategory, AnalysisSubcategory, QuestionAnswer } from '@/types/analysis';
import { calculateTraits, inferUserType } from '@/lib/trait-inference';
import { COLORS, getAnalysisTypeColor, getCategoryColor } from '@/lib/colors';

type AnalysisType = 'self' | 'other' | 'relationship';

/** 분석 타입별 정보 */
const ANALYSIS_TYPE_INFO: Record<AnalysisType, { title: string; question: string }> = {
  self: {
    title: '나를 읽는 중',
    question: '어떤 부분이 궁금해?',
  },
  other: {
    title: '상대를 읽는 중',
    question: '상대의 어떤 부분이 궁금해?',
  },
  relationship: {
    title: '우리 관계를 읽는 중',
    question: '우리 사이의 어떤 부분이 궁금해?',
  },
};

/** PRD 5.5: 카테고리 정의 */
const CATEGORIES = ['연애', '감정', '인간관계', '직업/진로'] as const;
type Category = typeof CATEGORIES[number];

/** 카테고리별 정보 */
const CATEGORY_INFO: Record<Category, { icon: string; description: string }> = {
  연애: { icon: '💕', description: '썸, 연애 중, 이별, 재회' },
  감정: { icon: '🎭', description: '불안, 답답함, 공허함' },
  인간관계: { icon: '👥', description: '친구, 가족, 직장' },
  '직업/진로': { icon: '🎯', description: '이직, 방향성, 확신 부족' },
};

/** PRD 5.5: 하위 분기 선택지 정의 */
const SUBCATEGORIES: Record<string, string[]> = {
  연애: ['썸', '연애 중', '이별', '재회'],
  인간관계: ['친구', '가족', '직장', '사람 전반'],
  '직업/진로': ['이직', '방향성', '확신 부족', '현실 vs 적성'],
};

/** PRD 5.5: 더미 질문 데이터 — 백엔드 연동 전 사용 */
const DUMMY_QUESTIONS = [
  {
    id: 'q_context',
    step: 'context' as const,
    text: '지금 이 상황을 한 문장으로 표현한다면?',
    type: 'single' as const,
    options: [
      { id: 'opt_confused', text: '뭘 원하는지 모르겠어', weights: { 인지형: 1, 불안형: 2, 자기이해형: 2 } },
      { id: 'opt_stuck',    text: '알고 있는데 못 움직이고 있어', weights: { 불안형: 2, 회피형: 2, 자기이해형: 1 } },
      { id: 'opt_repeat',   text: '비슷한 상황이 반복되는 것 같아', weights: { 인지형: 2, 불안형: 1, 자기중심형: 1 } },
      { id: 'opt_outside',  text: '외부 압박으로 선택을 강요받고 있어', weights: { 타인중심형: 2, 불안형: 1, 회피형: 1 } },
    ],
  },
  {
    id: 'q_emotion',
    step: 'emotion' as const,
    text: '지금 가장 많이 느끼는 감정은?',
    type: 'multiple' as const,
    options: [
      { id: 'opt_anxiety',    text: '불안', weights: { 불안형: 2, 자기이해형: 1 } },
      { id: 'opt_frustrated', text: '답답함', weights: { 감정형: 2, 직면형: 1 } },
      { id: 'opt_avoidance',  text: '회피하고 싶음', weights: { 회피형: 2, 감정형: 1 } },
      { id: 'opt_expectation', text: '기대감', weights: { 안정형: 1, 해결형: 1 } },
      { id: 'opt_emptiness',  text: '공허함', weights: { 감정형: 2, 자기이해형: 2 } },
      { id: 'opt_clarity',    text: '명확한 확신', weights: { 인지형: 2, 안정형: 1 } },
    ],
  },
  {
    id: 'q_value',
    step: 'value' as const,
    text: '선택할 때 가장 중요하게 보는 기준은?',
    type: 'single' as const,
    options: [
      { id: 'opt_stability', text: '안정성', weights: { 안정형: 2, 인지형: 1, 자기중심형: 1 } },
      { id: 'opt_growth',    text: '성장 가능성', weights: { 해결형: 2, 인지형: 1, 자기중심형: 1 } },
      { id: 'opt_affection', text: '애정과 유대감', weights: { 감정형: 2, 타인중심형: 1, 자기이해형: 1 } },
      { id: 'opt_trust',     text: '신뢰와 일관성', weights: { 인지형: 1, 안정형: 1, 타인중심형: 1 } },
    ],
  },
  {
    id: 'q_behavior',
    step: 'behavior' as const,
    text: '불확실할 때 내가 주로 하는 행동은?',
    type: 'single' as const,
    options: [
      { id: 'opt_delay',   text: '결정을 미룬다', weights: { 불안형: 2, 회피형: 1 } },
      { id: 'opt_info',    text: '더 많은 정보를 수집한다', weights: { 인지형: 2, 자기이해형: 1 } },
      { id: 'opt_others',  text: '주변 사람의 의견을 따른다', weights: { 타인중심형: 2, 불안형: 1 } },
      { id: 'opt_impulse', text: '충동적으로 결정한다', weights: { 감정형: 2, 직면형: 1 } },
    ],
  },
  {
    id: 'q_pattern',
    step: 'pattern' as const,
    text: '비슷한 상황에서 내가 반복하는 선택 방식은?',
    type: 'single' as const,
    options: [
      { id: 'opt_wait',    text: '기회가 올 때까지 기다린다', weights: { 불안형: 2, 회피형: 1, 타인중심형: 1 } },
      { id: 'opt_escape',  text: '관계나 상황에서 도망친다', weights: { 회피형: 2, 감정형: 1 } },
      { id: 'opt_control', text: '결과를 통제하려 한다', weights: { 인지형: 2, 해결형: 1, 자기중심형: 1 } },
      { id: 'opt_accept',  text: '흐름에 맡기고 수용한다', weights: { 안정형: 2, 직면형: 1 } },
    ],
  },
  {
    id: 'q_perception',
    step: 'perception' as const,
    text: '지금 이 상황에서 나 자신을 어떻게 보고 있어?',
    type: 'single' as const,
    options: [
      { id: 'opt_rational', text: '이성적으로 분석하는 편이야', weights: { 인지형: 2, 자기중심형: 1 } },
      { id: 'opt_emotional', text: '감정에 솔직한 편이야', weights: { 감정형: 2, 자기이해형: 1 } },
      { id: 'opt_ambivalent', text: '둘 다인 것 같은데 갈팡질팡해', weights: { 불안형: 1, 자기이해형: 2 } },
      { id: 'opt_unsure', text: '잘 모르겠어', weights: { 불안형: 2, 자기이해형: 1 } },
    ],
  },
];

type Step = 'category' | 'subcategory' | 'questions' | 'submitting';

export const AnalyzeClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryType = (searchParams.get('type') ?? 'self') as AnalysisType;

  const [category, setCategory] = useState<AnalysisCategory | null>(null);
  const [step, setStep] = useState<Step>('category');
  const [subcategory, setSubcategory] = useState<AnalysisSubcategory | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);

  const hasSubcategory = category && SUBCATEGORIES[category];
  const questions = DUMMY_QUESTIONS;
  const question = questions[currentQuestion];
  const totalSteps = (hasSubcategory ? 1 : 0) + questions.length;

  const handleCategorySelect = useCallback((selectedCategory: string) => {
    const cat = selectedCategory as AnalysisCategory;
    setCategory(cat);

    if (SUBCATEGORIES[cat]) {
      setStep('subcategory');
    } else {
      setStep('questions');
    }
  }, []);

  const handleSubcategorySelect = useCallback((sub: string) => {
    setSubcategory(sub as AnalysisSubcategory);
    setStep('questions');
  }, []);

  const handleSubmit = useCallback(() => {
    setStep('submitting');

    const traits = calculateTraits(answers, questions);
    const inferredType = inferUserType(traits);

    const mockSessionId = `sess_${Date.now()}`;
    const analysisSession = {
      sessionId: mockSessionId,
      analysisType: queryType,
      category,
      subcategory,
      answers,
      traitScores: traits,
      inferredUserType: {
        topTraits: inferredType.topTraits,
        reportTone: inferredType.reportTone,
        questionStrategy: inferredType.questionStrategy,
      },
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem(`analysis_${mockSessionId}`, JSON.stringify(analysisSession));

    setTimeout(() => {
      router.push(`/report/${mockSessionId}`);
    }, 2000);
  }, [router, answers, questions, category, subcategory, queryType]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((n) => n + 1);
    } else {
      handleSubmit();
    }
  }, [currentQuestion, questions.length, handleSubmit]);

  const handleOptionToggle = useCallback((optionId: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === question.id);
      let newAnswers;

      if (!existing) {
        newAnswers = [...prev, { questionId: question.id, selectedOptionIds: [optionId] }];
      } else if (question.type === 'single') {
        newAnswers = prev.map((a) =>
          a.questionId === question.id
            ? { ...a, selectedOptionIds: [optionId] }
            : a,
        );
      } else {
        const selected = existing.selectedOptionIds.includes(optionId)
          ? existing.selectedOptionIds.filter((id) => id !== optionId)
          : [...existing.selectedOptionIds, optionId];
        newAnswers = prev.map((a) =>
          a.questionId === question.id ? { ...a, selectedOptionIds: selected } : a,
        );
      }

      return newAnswers;
    });
  }, [question]);

  const currentAnswer = answers.find((a) => a.questionId === question?.id);
  const hasAnswer = (currentAnswer?.selectedOptionIds.length ?? 0) > 0;

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((n) => n - 1);
    } else if (step === 'questions' && hasSubcategory) {
      setStep('subcategory');
    } else if (step === 'questions' || step === 'subcategory') {
      setStep('category');
    } else {
      router.push('/');
    }
  }, [currentQuestion, step, hasSubcategory, router]);

  const progressStep = step === 'category' ? 0 : step === 'subcategory' ? 0 : currentQuestion + (hasSubcategory ? 1 : 0);
  const progressPercent = Math.round((progressStep / totalSteps) * 100);
  const typeInfo = ANALYSIS_TYPE_INFO[queryType];

  if (step === 'submitting') {
    const typeColor = getAnalysisTypeColor(queryType);
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <style>{`
          @keyframes spin-and-pulse {
            0% {
              transform: rotate(0deg) scale(1);
              opacity: 1;
            }
            50% {
              transform: rotate(180deg) scale(1.1);
            }
            100% {
              transform: rotate(360deg) scale(1);
              opacity: 1;
            }
          }
          @keyframes dot-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div
              className="absolute inset-0 rounded-full border-3 border-transparent"
              style={{
                borderTopColor: typeColor,
                borderRightColor: typeColor,
                animation: 'spin-and-pulse 2.2s ease-in-out infinite',
              }}
            />
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: typeColor,
                  animation: `dot-pulse 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <p
            className="mb-2 text-lg font-semibold"
            style={{ color: COLORS.text.primary }}
          >
            {typeInfo.title}...
          </p>
          <p className="text-sm" style={{ color: COLORS.text.muted }}>
            상황을 분석하고 있어
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      {/* 분석 타입 & 진행 상태 */}
      {step !== 'category' && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span style={{ color: COLORS.text.muted }}>{typeInfo.title}</span>
            <span style={{ color: COLORS.text.muted }}>
              {progressStep}/{totalSteps}
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full transition-colors"
            style={{ backgroundColor: COLORS.ui.borderLight }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%`, backgroundColor: getAnalysisTypeColor(queryType) }}
            />
          </div>
        </div>
      )}

      {/* 카테고리 선택 */}
      {step === 'category' && (
        <div className="rounded-2xl p-8 md:p-10">
          <div className="mb-10 text-center">
            <h2
              className="mb-2 text-3xl font-bold md:text-4xl"
              style={{ color: COLORS.text.primary }}
            >
              {typeInfo.question}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {CATEGORIES.map((cat) => {
              const info = CATEGORY_INFO[cat];
              const categoryColor = getCategoryColor(cat);
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className="group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all hover:shadow-md active:scale-[0.98]"
                  style={{
                    borderColor: categoryColor,
                    backgroundColor: COLORS.background.card,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10"
                    style={{ backgroundColor: categoryColor }}
                  />

                  <div className="relative z-10">
                    <div className="mb-3 text-3xl">{info.icon}</div>
                    <h3
                      className="mb-2 text-lg font-semibold"
                      style={{ color: COLORS.text.primary }}
                    >
                      {cat}
                    </h3>
                    <p className="text-xs" style={{ color: COLORS.text.muted }}>
                      {info.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 하위 분기 선택 */}
      {step === 'subcategory' && hasSubcategory && (
        <div>
          <h2
            className="mb-6 text-xl font-semibold leading-snug"
            style={{ color: COLORS.text.primary }}
          >
            더 자세히?
          </h2>
          <div className="flex flex-col gap-3">
            {SUBCATEGORIES[category!].map((sub) => {
              const categoryColor = getCategoryColor(category!);
              return (
                <button
                  key={sub}
                  onClick={() => handleSubcategorySelect(sub)}
                  className="flex min-h-[52px] w-full items-center rounded-xl border px-5 py-3 text-left text-sm font-medium transition-all active:scale-[0.98]"
                  style={{
                    borderColor: COLORS.ui.border,
                    backgroundColor: COLORS.background.card,
                    color: COLORS.text.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = categoryColor;
                    e.currentTarget.style.backgroundColor = COLORS.background.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.ui.border;
                    e.currentTarget.style.backgroundColor = COLORS.background.card;
                  }}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 질문 */}
      {step === 'questions' && question && (
        <div>
          <h2
            className="mb-6 text-xl font-semibold leading-snug"
            style={{ color: COLORS.text.primary }}
          >
            {question.text}
          </h2>
          {question.type === 'multiple' && (
            <p className="mb-4 text-xs" style={{ color: COLORS.text.muted }}>
              여러 개 선택 가능
            </p>
          )}
          <div className="flex flex-col gap-3">
            {question.options.map((option) => {
              const isSelected = currentAnswer?.selectedOptionIds.includes(option.id);
              const focusColor = getCategoryColor(category!) || getAnalysisTypeColor(queryType);
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionToggle(option.id)}
                  className="flex min-h-[52px] w-full items-center rounded-xl border px-5 py-3 text-left text-sm font-medium transition-all active:scale-[0.98]"
                  style={{
                    borderColor: isSelected ? focusColor : COLORS.ui.border,
                    backgroundColor: isSelected ? COLORS.background.selected : COLORS.background.card,
                    color: COLORS.text.primary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = focusColor;
                      e.currentTarget.style.backgroundColor = COLORS.background.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = COLORS.ui.border;
                      e.currentTarget.style.backgroundColor = COLORS.background.card;
                    }
                  }}
                >
                  {option.text}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 rounded-xl border py-3 text-sm font-medium transition-all active:scale-[0.98]"
              style={{
                borderColor: COLORS.ui.border,
                color: COLORS.text.secondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.background.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className="flex-[2] rounded-xl py-3 text-sm font-medium text-white transition-all"
              style={{
                backgroundColor: hasAnswer ? getAnalysisTypeColor(queryType) : COLORS.ui.disabled,
                cursor: hasAnswer ? 'pointer' : 'not-allowed',
              }}
            >
              {currentQuestion < questions.length - 1 ? '다음' : '분석 완료'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
