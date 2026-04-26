'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AnalysisCategory,
  AnalysisSubcategory,
  QuestionAnswer,
} from '@/types/analysis';
import { calculateTraits, inferUserType } from '@/lib/trait-inference';
import { getAnalysisTypeColor, getCategoryColor, getRelationshipColor } from '@/lib/colors';

type AnalysisType = 'self' | 'other' | 'relationship';

/** 분석 타입별 정보 */
const ANALYSIS_TYPE_INFO: Record<
  AnalysisType,
  { title: string; question: string }
> = {
  self: {
    title: '나를 읽는 중',
    question: '어떤 부분이 궁금해?',
  },
  other: {
    title: '상대를 읽는 중',
    question: '어떤 관계인가요?',
  },
  relationship: {
    title: '우리 관계를 읽는 중',
    question: '어떤 관계인가요?',
  },
};

/** PRD 5.5: 카테고리 정의 (자신 분석용) */
const CATEGORIES = ['연애', '감정', '인간관계', '직업/진로'] as const;
type Category = (typeof CATEGORIES)[number];

/** 카테고리별 정보 */
const CATEGORY_INFO: Record<Category, { icon: string; description: string }> = {
  연애: { icon: '💕', description: '썸, 연애 중, 이별, 재회' },
  감정: { icon: '🎭', description: '불안, 답답함, 공허함' },
  인간관계: { icon: '👥', description: '친구, 가족, 직장' },
  '직업/진로': { icon: '🎯', description: '이직, 방향성, 확신 부족' },
};

/** 상대/관계 분석용 관계 유형 */
const RELATIONSHIP_OPTIONS = ['썸', '연애 중', '이별', '재회', '친구', '가족', '직장 동료', '기타'] as const;
const RELATIONSHIP_ICONS: Record<string, string> = {
  '썸': '💫',
  '연애 중': '💑',
  '이별': '💔',
  '재회': '🔄',
  '친구': '👫',
  '가족': '👨‍👩‍👧‍👦',
  '직장 동료': '💼',
  '기타': '❓',
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
      {
        id: 'opt_confused',
        text: '뭘 원하는지 모르겠어',
        weights: { 인지형: 1, 불안형: 2, 자기이해형: 2 },
      },
      {
        id: 'opt_stuck',
        text: '알고 있는데 못 움직이고 있어',
        weights: { 불안형: 2, 회피형: 2, 자기이해형: 1 },
      },
      {
        id: 'opt_repeat',
        text: '비슷한 상황이 반복되는 것 같아',
        weights: { 인지형: 2, 불안형: 1, 자기중심형: 1 },
      },
      {
        id: 'opt_outside',
        text: '외부 압박으로 선택을 강요받고 있어',
        weights: { 타인중심형: 2, 불안형: 1, 회피형: 1 },
      },
    ],
  },
  {
    id: 'q_emotion',
    step: 'emotion' as const,
    text: '지금 가장 많이 느끼는 감정은?',
    type: 'multiple' as const,
    options: [
      {
        id: 'opt_anxiety',
        text: '불안',
        weights: { 불안형: 2, 자기이해형: 1 },
      },
      {
        id: 'opt_frustrated',
        text: '답답함',
        weights: { 감정형: 2, 직면형: 1 },
      },
      {
        id: 'opt_avoidance',
        text: '회피하고 싶음',
        weights: { 회피형: 2, 감정형: 1 },
      },
      {
        id: 'opt_expectation',
        text: '기대감',
        weights: { 안정형: 1, 해결형: 1 },
      },
      {
        id: 'opt_emptiness',
        text: '공허함',
        weights: { 감정형: 2, 자기이해형: 2 },
      },
      {
        id: 'opt_clarity',
        text: '명확한 확신',
        weights: { 인지형: 2, 안정형: 1 },
      },
    ],
  },
  {
    id: 'q_value',
    step: 'value' as const,
    text: '선택할 때 가장 중요하게 보는 기준은?',
    type: 'single' as const,
    options: [
      {
        id: 'opt_stability',
        text: '안정성',
        weights: { 안정형: 2, 인지형: 1, 자기중심형: 1 },
      },
      {
        id: 'opt_growth',
        text: '성장 가능성',
        weights: { 해결형: 2, 인지형: 1, 자기중심형: 1 },
      },
      {
        id: 'opt_affection',
        text: '애정과 유대감',
        weights: { 감정형: 2, 타인중심형: 1, 자기이해형: 1 },
      },
      {
        id: 'opt_trust',
        text: '신뢰와 일관성',
        weights: { 인지형: 1, 안정형: 1, 타인중심형: 1 },
      },
    ],
  },
  {
    id: 'q_behavior',
    step: 'behavior' as const,
    text: '불확실할 때 내가 주로 하는 행동은?',
    type: 'single' as const,
    options: [
      {
        id: 'opt_delay',
        text: '결정을 미룬다',
        weights: { 불안형: 2, 회피형: 1 },
      },
      {
        id: 'opt_info',
        text: '더 많은 정보를 수집한다',
        weights: { 인지형: 2, 자기이해형: 1 },
      },
      {
        id: 'opt_others',
        text: '주변 사람의 의견을 따른다',
        weights: { 타인중심형: 2, 불안형: 1 },
      },
      {
        id: 'opt_impulse',
        text: '충동적으로 결정한다',
        weights: { 감정형: 2, 직면형: 1 },
      },
    ],
  },
  {
    id: 'q_pattern',
    step: 'pattern' as const,
    text: '비슷한 상황에서 내가 반복하는 선택 방식은?',
    type: 'single' as const,
    options: [
      {
        id: 'opt_wait',
        text: '기회가 올 때까지 기다린다',
        weights: { 불안형: 2, 회피형: 1, 타인중심형: 1 },
      },
      {
        id: 'opt_escape',
        text: '관계나 상황에서 도망친다',
        weights: { 회피형: 2, 감정형: 1 },
      },
      {
        id: 'opt_control',
        text: '결과를 통제하려 한다',
        weights: { 인지형: 2, 해결형: 1, 자기중심형: 1 },
      },
      {
        id: 'opt_accept',
        text: '흐름에 맡기고 수용한다',
        weights: { 안정형: 2, 직면형: 1 },
      },
    ],
  },
  {
    id: 'q_perception',
    step: 'perception' as const,
    text: '지금 이 상황에서 나 자신을 어떻게 보고 있어?',
    type: 'single' as const,
    options: [
      {
        id: 'opt_rational',
        text: '이성적으로 분석하는 편이야',
        weights: { 인지형: 2, 자기중심형: 1 },
      },
      {
        id: 'opt_emotional',
        text: '감정에 솔직한 편이야',
        weights: { 감정형: 2, 자기이해형: 1 },
      },
      {
        id: 'opt_ambivalent',
        text: '둘 다인 것 같은데 갈팡질팡해',
        weights: { 불안형: 1, 자기이해형: 2 },
      },
      {
        id: 'opt_unsure',
        text: '잘 모르겠어',
        weights: { 불안형: 2, 자기이해형: 1 },
      },
    ],
  },
];

type Step = 'category' | 'relationship' | 'subcategory' | 'questions' | 'submitting';

export const AnalyzeClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryType = (searchParams.get('type') ?? 'self') as AnalysisType;

  const [category, setCategory] = useState<AnalysisCategory | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(queryType === 'self' ? 'category' : 'relationship');
  const [subcategory, setSubcategory] = useState<AnalysisSubcategory | null>(
    null,
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);

  const hasSubcategory = category && SUBCATEGORIES[category];
  const questions = DUMMY_QUESTIONS;
  const question = questions[currentQuestion];
  const totalSteps = (hasSubcategory ? 1 : 0) + (step !== 'category' && step !== 'relationship' ? questions.length : 0);

  const handleCategorySelect = useCallback((selectedCategory: string) => {
    const cat = selectedCategory as AnalysisCategory;
    setCategory(cat);

    if (SUBCATEGORIES[cat]) {
      setStep('subcategory');
    } else {
      setStep('questions');
    }
  }, []);

  const handleRelationshipSelect = useCallback((rel: string) => {
    setSelectedRelationship(rel);
    setStep('questions');
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

    sessionStorage.setItem(
      `analysis_${mockSessionId}`,
      JSON.stringify(analysisSession),
    );

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

  const handleOptionToggle = useCallback(
    (optionId: string) => {
      setAnswers((prev) => {
        const existing = prev.find((a) => a.questionId === question.id);
        let newAnswers;

        if (!existing) {
          newAnswers = [
            ...prev,
            { questionId: question.id, selectedOptionIds: [optionId] },
          ];
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
            a.questionId === question.id
              ? { ...a, selectedOptionIds: selected }
              : a,
          );
        }

        return newAnswers;
      });
    },
    [question],
  );

  const currentAnswer = answers.find((a) => a.questionId === question?.id);
  const hasAnswer = (currentAnswer?.selectedOptionIds.length ?? 0) > 0;

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((n) => n - 1);
    } else if (step === 'questions' && hasSubcategory) {
      setStep('subcategory');
    } else if (step === 'questions' && queryType === 'self') {
      setStep('category');
    } else if (step === 'questions' && queryType !== 'self') {
      setStep('relationship');
    } else if (step === 'subcategory') {
      setStep('category');
    } else if (step === 'category' && queryType !== 'self') {
      setStep('relationship');
    } else {
      router.push('/');
    }
  }, [currentQuestion, step, hasSubcategory, queryType, router]);

  const progressStep =
    step === 'category'
      ? 0
      : step === 'relationship'
        ? 0
        : step === 'subcategory'
          ? 0
          : currentQuestion + (hasSubcategory ? 1 : 0);
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
            style={{ color: '#FFFFFF' }}
          >
            {typeInfo.title}...
          </p>
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            상황을 분석하고 있어
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 md:py-12">
      {/* 분석 타입 & 진행 상태 */}
      {step !== 'category' && step !== 'relationship' && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {typeInfo.title}
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {progressStep}/{totalSteps}
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full transition-colors"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%`, backgroundColor: getAnalysisTypeColor(queryType) }}
            />
          </div>
        </div>
      )}

      {/* 카테고리 선택 (자신 분석) */}
      {step === 'category' && queryType === 'self' && (
        <div className="space-y-10 py-6">
          {/* 헤더 */}
          <div className="space-y-6 text-center">
            <div>
              <p
                className="mb-4 text-sm font-semibold tracking-wider"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {typeInfo.title}
              </p>
              <h1
                className="text-3xl font-bold leading-tight md:text-4xl"
                style={{ color: '#FFFFFF' }}
              >
                {typeInfo.question}
              </h1>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              당신의 상황에 맞는 카테고리를 선택해줄래.
            </p>
          </div>

          {/* 카테고리 그리드 */}
          <div className="grid gap-3 md:gap-4 grid-cols-2">
            {CATEGORIES.map((cat) => {
              const info = CATEGORY_INFO[cat];
              const categoryColor = getCategoryColor(cat);
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className="group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 active:scale-[0.95] md:p-8 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${categoryColor}35 0%, ${categoryColor}15 100%)`,
                    borderLeft: `5px solid ${categoryColor}`,
                    backdropFilter: 'blur(15px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${categoryColor}45 0%, ${categoryColor}25 100%)`;
                    e.currentTarget.style.transform = 'translateY(-6px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${categoryColor}35 0%, ${categoryColor}15 100%)`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-6xl">{info.icon}</div>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white transition-all duration-300 group-hover:scale-130"
                        style={{ backgroundColor: categoryColor }}
                      >
                        →
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3
                        className="text-xl font-bold leading-tight md:text-2xl"
                        style={{ color: '#FFFFFF' }}
                      >
                        {cat}
                      </h3>
                      <p
                        className="text-xs leading-relaxed md:text-sm"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        {info.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 관계 선택 (상대/관계 분석) */}
      {step === 'relationship' && queryType !== 'self' && (
        <div className="space-y-10 py-6">
          {/* 헤더 */}
          <div className="space-y-6 text-center">
            <div>
              <p
                className="mb-4 text-sm font-semibold tracking-wider"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {typeInfo.title}
              </p>
              <h1
                className="text-3xl font-bold leading-tight md:text-4xl"
                style={{ color: '#FFFFFF' }}
              >
                {typeInfo.question}
              </h1>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              상대와의 관계를 선택해줄래.
            </p>
          </div>

          {/* 관계 옵션 그리드 */}
          <div className="grid gap-3 md:gap-4 grid-cols-2">
            {RELATIONSHIP_OPTIONS.map((rel) => {
              const icon = RELATIONSHIP_ICONS[rel] || '💫';
              const relColor = getRelationshipColor(rel);
              return (
                <button
                  key={rel}
                  onClick={() => handleRelationshipSelect(rel)}
                  className="group relative overflow-hidden rounded-2xl p-3 text-left transition-all duration-300 active:scale-[0.95] md:p-4 hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, rgba(${parseInt(relColor.slice(1, 3), 16)}, ${parseInt(relColor.slice(3, 5), 16)}, ${parseInt(relColor.slice(5, 7), 16)}, 0.35) 0%, rgba(${parseInt(relColor.slice(1, 3), 16)}, ${parseInt(relColor.slice(3, 5), 16)}, ${parseInt(relColor.slice(5, 7), 16)}, 0.15) 100%)`,
                    borderLeft: `4px solid ${relColor}`,
                    backdropFilter: 'blur(15px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, rgba(${parseInt(relColor.slice(1, 3), 16)}, ${parseInt(relColor.slice(3, 5), 16)}, ${parseInt(relColor.slice(5, 7), 16)}, 0.45) 0%, rgba(${parseInt(relColor.slice(1, 3), 16)}, ${parseInt(relColor.slice(3, 5), 16)}, ${parseInt(relColor.slice(5, 7), 16)}, 0.25) 100%)`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, rgba(${parseInt(relColor.slice(1, 3), 16)}, ${parseInt(relColor.slice(3, 5), 16)}, ${parseInt(relColor.slice(5, 7), 16)}, 0.35) 0%, rgba(${parseInt(relColor.slice(1, 3), 16)}, ${parseInt(relColor.slice(3, 5), 16)}, ${parseInt(relColor.slice(5, 7), 16)}, 0.15) 100%)`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl">{icon}</div>
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: relColor }}
                      >
                        →
                      </div>
                    </div>
                    <h3
                      className="text-sm font-bold leading-tight md:text-base"
                      style={{ color: '#FFFFFF' }}
                    >
                      {rel}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 카테고리 선택 (상대/관계 분석 후) */}
      {step === 'category' && queryType !== 'self' && selectedRelationship && (
        <div className="space-y-10 py-6">
          {/* 헤더 */}
          <div className="space-y-6 text-center">
            <div>
              <p
                className="mb-4 text-sm font-semibold tracking-wider"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {selectedRelationship} • {typeInfo.title}
              </p>
              <h1
                className="text-3xl font-bold leading-tight md:text-4xl"
                style={{ color: '#FFFFFF' }}
              >
                어떤 부분이 궁금해?
              </h1>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              카테고리를 선택해줄래.
            </p>
          </div>

          {/* 카테고리 그리드 */}
          <div className="grid gap-3 md:gap-4 grid-cols-2">
            {CATEGORIES.map((cat) => {
              const info = CATEGORY_INFO[cat];
              const categoryColor = getCategoryColor(cat);
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className="group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 active:scale-[0.95] md:p-8 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${categoryColor}35 0%, ${categoryColor}15 100%)`,
                    borderLeft: `5px solid ${categoryColor}`,
                    backdropFilter: 'blur(15px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${categoryColor}45 0%, ${categoryColor}25 100%)`;
                    e.currentTarget.style.transform = 'translateY(-6px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${categoryColor}35 0%, ${categoryColor}15 100%)`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-6xl">{info.icon}</div>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white transition-all duration-300 group-hover:scale-130"
                        style={{ backgroundColor: categoryColor }}
                      >
                        →
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3
                        className="text-xl font-bold leading-tight md:text-2xl"
                        style={{ color: '#FFFFFF' }}
                      >
                        {cat}
                      </h3>
                      <p
                        className="text-xs leading-relaxed md:text-sm"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        {info.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 하위 분기 선택 */}
      {step === 'subcategory' && hasSubcategory && (
        <div className="space-y-6">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: '#FFFFFF' }}
            >
              더 자세히?
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
              상황을 더 잘 이해하기 위해 한 가지 더 선택해줄래?
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {SUBCATEGORIES[category!].map((sub) => {
              const categoryColor = getCategoryColor(category!);
              return (
                <button
                  key={sub}
                  onClick={() => handleSubcategorySelect(sub)}
                  className="group flex min-h-[56px] w-full items-center justify-between rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all active:scale-[0.98]"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = categoryColor;
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <span>{sub}</span>
                  <span
                    className="text-lg opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: categoryColor }}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 질문 */}
      {step === 'questions' && question && (
        <div className="space-y-6">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: '#FFFFFF' }}
            >
              {question.text}
            </h2>
            {question.type === 'multiple' && (
              <p className="mt-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                맞다고 생각하는 것들을 모두 선택해도 돼.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {question.options.map((option) => {
              const isSelected =
                currentAnswer?.selectedOptionIds.includes(option.id);
              const focusColor =
                getCategoryColor(category!) || getAnalysisTypeColor(queryType);
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionToggle(option.id)}
                  className="flex min-h-[52px] w-full items-center rounded-xl border px-5 py-3 text-left text-sm font-medium transition-all active:scale-[0.98]"
                  style={{
                    borderColor: isSelected
                      ? focusColor
                      : 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: isSelected
                      ? `${focusColor}30`
                      : 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = focusColor;
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.1)';
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
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className="flex-[2] rounded-xl py-3 text-sm font-medium text-white transition-all"
              style={{
                backgroundColor: hasAnswer
                  ? getAnalysisTypeColor(queryType)
                  : 'rgba(255, 255, 255, 0.2)',
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
