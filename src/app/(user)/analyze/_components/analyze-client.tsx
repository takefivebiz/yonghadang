'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  AnalysisCategory,
  AnalysisSubcategory,
  QuestionAnswer,
  AnalysisQuestion,
} from '@/types/analysis';
import { calculateTraits } from '@/lib/trait-inference';
import { getAnalysisTypeColor, getCategoryColor, getRelationshipColor } from '@/lib/colors';
import { submitAnalysis, generateAndSaveFreeReport } from '@/lib/actions/analysis';
import { mapUIToInternal, RELATIONSHIP_GROUPS, RELATIONSHIP_TYPES, type RelationshipGroup } from '@/lib/relationship-mapper';
import { AnalysisSubmittingScreen } from './analysis-submitting-screen';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  provider: string;
}

type AnalysisType = 'self' | 'other';

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

/** 관계 그룹별 아이콘 및 컬러 */
const RELATIONSHIP_GROUP_ICONS: Record<RelationshipGroup, string> = {
  '연인': '💕',
  '배우자': '💑',
  '친구': '👫',
  '가족': '👨‍👩‍👧‍👦',
  '동료': '💼',
  '경쟁자': '🔥',
};

const RELATIONSHIP_GROUP_COLORS: Record<RelationshipGroup, string> = {
  '연인': '#FF6B9D',    // 핑크
  '배우자': '#FF9E64',  // 주황
  '친구': '#7AA2F7',    // 파랑
  '가족': '#9ECE6A',    // 초록
  '동료': '#BB9AF7',    // 보라
  '경쟁자': '#F7768E',  // 레드
};

/** 관계 그룹 → 카테고리 자동 매핑 */
const mapRelationshipGroupToCategory = (group: RelationshipGroup): AnalysisCategory => {
  switch (group) {
    case '연인':
    case '배우자':
      return '연애';
    case '친구':
    case '가족':
      return '인간관계';
    case '동료':
      return '직업/진로';
    case '경쟁자':
      return '감정';
  }
};

/** 카테고리 한글 → DB 카테고리 코드 매핑 */
const mapCategoryToDbCategory = (category: AnalysisCategory): string => {
  const mapping: Record<AnalysisCategory, string> = {
    '연애': 'love',
    '감정': 'emotion',
    '인간관계': 'relationship',
    '직업/진로': 'career',
  };
  return mapping[category];
};

/** PRD 5.5: 하위 분기 선택지 정의 */
const SUBCATEGORIES: Record<string, string[]> = {
  연애: ['썸', '연애 중', '이별', '재회'],
  감정: ['불안', '답답함', '공허함'],
  인간관계: ['친구', '가족', '직장', '사람 전반'],
  '직업/진로': ['이직', '방향성', '확신 부족', '현실 vs 적성'],
};

/** 분석 페이지 기본 질문들 (카테고리별) */
const BASE_QUESTIONS: Record<Category, AnalysisQuestion[]> = {
  '연애': [
    {
      id: 'love_1',
      step: 'context',
      text: '지금 이 관계에서 가장 불안한 부분은?',
      type: 'single',
      options: [
        { id: 'love_1_a', text: '상대의 감정', weights: { 불안형: 5, 타인중심형: 3 } },
        { id: 'love_1_b', text: '미래', weights: { 불안형: 4, 회피형: 2 } },
        { id: 'love_1_c', text: '내 감정', weights: { 감정형: 4, 불안형: 3 } },
      ],
    },
    {
      id: 'love_2',
      step: 'emotion',
      text: '상대방이 당신을 어떻게 보는지 확신이 서?',
      type: 'single',
      options: [
        { id: 'love_2_a', text: '아니오, 자주 의심해', weights: { 불안형: 5, 타인중심형: 4 } },
        { id: 'love_2_b', text: '대체로 그렇다고 봐', weights: { 안정형: 4, 직면형: 3 } },
        { id: 'love_2_c', text: '관심이 없어', weights: { 회피형: 4, 자기중심형: 3 } },
      ],
    },
    {
      id: 'love_3',
      step: 'value',
      text: '이 관계를 계속하고 싶은 진짜 이유는?',
      type: 'single',
      options: [
        { id: 'love_3_a', text: '상대가 좋아서', weights: { 감정형: 5 } },
        { id: 'love_3_b', text: '혼자가 싫어서', weights: { 불안형: 5, 회피형: 2 } },
        { id: 'love_3_c', text: '논리적으로 맞다고 생각', weights: { 인지형: 5 } },
      ],
    },
    {
      id: 'love_4',
      step: 'behavior',
      text: '감정이 뒤흔들릴 때 보통 뭘 하는가?',
      type: 'single',
      options: [
        { id: 'love_4_a', text: '상대에게 말한다', weights: { 직면형: 4, 감정형: 3 } },
        { id: 'love_4_b', text: '혼자 생각한다', weights: { 자기이해형: 4, 인지형: 3 } },
        { id: 'love_4_c', text: '일단 피한다', weights: { 회피형: 5 } },
      ],
    },
    {
      id: 'love_5',
      step: 'pattern',
      text: '과거 연애에서 반복된 패턴이 있어?',
      type: 'single',
      options: [
        { id: 'love_5_a', text: '있다', weights: { 자기이해형: 4, 인지형: 3 } },
        { id: 'love_5_b', text: '없다', weights: { 안정형: 3 } },
        { id: 'love_5_c', text: '모르겠다', weights: { 회피형: 3, 감정형: 2 } },
      ],
    },
    {
      id: 'love_6',
      step: 'perception',
      text: '자신을 어떤 사람이라고 생각해?',
      type: 'single',
      options: [
        { id: 'love_6_a', text: '감정적이고 예민한 사람', weights: { 감정형: 5, 불안형: 3 } },
        { id: 'love_6_b', text: '논리적이고 차분한 사람', weights: { 인지형: 5, 안정형: 3 } },
        { id: 'love_6_c', text: '독립적인 사람', weights: { 회피형: 4, 자기중심형: 3 } },
      ],
    },
    {
      id: 'love_7',
      step: 'context',
      text: '표현하기 어려운 감정이 있어?',
      type: 'single',
      options: [
        { id: 'love_7_a', text: '있다, 자주 못 내포함', weights: { 회피형: 5, 감정형: 2 } },
        { id: 'love_7_b', text: '별로 없다', weights: { 직면형: 4, 감정형: 3 } },
        { id: 'love_7_c', text: '뭐든 다 표현한다', weights: { 감정형: 5, 직면형: 3 } },
      ],
    },
    {
      id: 'love_8',
      step: 'perception',
      text: '이 관계에서 무엇이 가장 소중해?',
      type: 'single',
      options: [
        { id: 'love_8_a', text: '상대의 마음', weights: { 타인중심형: 5, 감정형: 3 } },
        { id: 'love_8_b', text: '나의 행복', weights: { 자기중심형: 5 } },
        { id: 'love_8_c', text: '관계 자체의 안정성', weights: { 안정형: 4, 인지형: 3 } },
      ],
    },
  ],
  '감정': [
    {
      id: 'emotion_1',
      step: 'context',
      text: '지금 느끼는 감정이 언제부터 시작됐어?',
      type: 'single',
      options: [
        { id: 'emotion_1_a', text: '최근 몇 주', weights: { 감정형: 3 } },
        { id: 'emotion_1_b', text: '몇 달 전부터', weights: { 불안형: 3, 감정형: 2 } },
        { id: 'emotion_1_c', text: '오래됐어', weights: { 불안형: 4, 회피형: 3 } },
      ],
    },
    {
      id: 'emotion_2',
      step: 'emotion',
      text: '이 감정이 가장 강할 때는?',
      type: 'single',
      options: [
        { id: 'emotion_2_a', text: '혼자 있을 때', weights: { 자기이해형: 4, 감정형: 3 } },
        { id: 'emotion_2_b', text: '사람들 앞에서', weights: { 불안형: 4, 타인중심형: 3 } },
        { id: 'emotion_2_c', text: '특정 상황에서', weights: { 인지형: 3, 감정형: 2 } },
      ],
    },
    {
      id: 'emotion_3',
      step: 'behavior',
      text: '감정이 올 때 보통 어떻게 대처해?',
      type: 'single',
      options: [
        { id: 'emotion_3_a', text: '누군가와 얘기한다', weights: { 직면형: 4, 타인중심형: 3 } },
        { id: 'emotion_3_b', text: '혼자 처리한다', weights: { 자기이해형: 4, 회피형: 2 } },
        { id: 'emotion_3_c', text: '그냥 시간이 지날 때까지 기다린다', weights: { 회피형: 5, 안정형: 2 } },
      ],
    },
    {
      id: 'emotion_4',
      step: 'value',
      text: '이 감정에서 벗어나려면 뭐가 필요해?',
      type: 'single',
      options: [
        { id: 'emotion_4_a', text: '누군가의 위로', weights: { 타인중심형: 5, 감정형: 3 } },
        { id: 'emotion_4_b', text: '논리적인 이해', weights: { 인지형: 5, 자기이해형: 3 } },
        { id: 'emotion_4_c', text: '시간과 거리', weights: { 회피형: 4, 안정형: 3 } },
      ],
    },
    {
      id: 'emotion_5',
      step: 'pattern',
      text: '과거에 비슷한 감정을 느껴본 적 있어?',
      type: 'single',
      options: [
        { id: 'emotion_5_a', text: '자주 있다', weights: { 불안형: 5, 감정형: 3 } },
        { id: 'emotion_5_b', text: '가끔 있다', weights: { 감정형: 3, 불안형: 2 } },
        { id: 'emotion_5_c', text: '처음이다', weights: { 안정형: 3 } },
      ],
    },
    {
      id: 'emotion_6',
      step: 'perception',
      text: '이 감정을 어떻게 평가해?',
      type: 'single',
      options: [
        { id: 'emotion_6_a', text: '약한 거 같고 부끄러워', weights: { 감정형: 3, 불안형: 4 } },
        { id: 'emotion_6_b', text: '자연스러운 반응이라고 봐', weights: { 안정형: 4, 인지형: 3 } },
        { id: 'emotion_6_c', text: '무시하려고 해', weights: { 회피형: 5, 자기중심형: 3 } },
      ],
    },
    {
      id: 'emotion_7',
      step: 'context',
      text: '감정을 남에게 보이는 게 편해?',
      type: 'single',
      options: [
        { id: 'emotion_7_a', text: '편하다', weights: { 직면형: 4, 감정형: 4 } },
        { id: 'emotion_7_b', text: '어렵다', weights: { 회피형: 5, 감정형: 2 } },
        { id: 'emotion_7_c', text: '상대에 따라 다르다', weights: { 타인중심형: 4, 인지형: 2 } },
      ],
    },
    {
      id: 'emotion_8',
      step: 'perception',
      text: '감정이 당신에게 무엇을 말하고 있다고 생각해?',
      type: 'single',
      options: [
        { id: 'emotion_8_a', text: '약함', weights: { 불안형: 4, 회피형: 3 } },
        { id: 'emotion_8_b', text: '중요한 신호', weights: { 자기이해형: 5, 감정형: 3 } },
        { id: 'emotion_8_c', text: '잘 모르겠다', weights: { 회피형: 3, 불안형: 2 } },
      ],
    },
  ],
  '인간관계': [
    {
      id: 'relation_1',
      step: 'context',
      text: '현재 가장 신경 쓰이는 관계는?',
      type: 'single',
      options: [
        { id: 'relation_1_a', text: '친한 사람', weights: { 타인중심형: 4, 감정형: 3 } },
        { id: 'relation_1_b', text: '어려운 사람', weights: { 불안형: 4, 회피형: 2 } },
        { id: 'relation_1_c', text: '상사/권력 있는 사람', weights: { 불안형: 4, 타인중심형: 3 } },
      ],
    },
    {
      id: 'relation_2',
      step: 'emotion',
      text: '그 관계에서 주로 느끼는 감정은?',
      type: 'single',
      options: [
        { id: 'relation_2_a', text: '편함', weights: { 안정형: 4, 감정형: 3 } },
        { id: 'relation_2_b', text: '불안함', weights: { 불안형: 5, 타인중심형: 3 } },
        { id: 'relation_2_c', text: '거리감', weights: { 회피형: 5, 자기중심형: 3 } },
      ],
    },
    {
      id: 'relation_3',
      step: 'value',
      text: '관계를 유지하는 게 중요해?',
      type: 'single',
      options: [
        { id: 'relation_3_a', text: '매우 중요해', weights: { 타인중심형: 5, 감정형: 3 } },
        { id: 'relation_3_b', text: '적당히 중요해', weights: { 안정형: 4, 인지형: 3 } },
        { id: 'relation_3_c', text: '중요하지 않아', weights: { 자기중심형: 5, 회피형: 3 } },
      ],
    },
    {
      id: 'relation_4',
      step: 'behavior',
      text: '갈등이 생기면 어떻게 해?',
      type: 'single',
      options: [
        { id: 'relation_4_a', text: '바로 얘기한다', weights: { 직면형: 5, 감정형: 3 } },
        { id: 'relation_4_b', text: '시간을 갖고 생각한다', weights: { 자기이해형: 4, 인지형: 3 } },
        { id: 'relation_4_c', text: '피한다', weights: { 회피형: 5, 불안형: 2 } },
      ],
    },
    {
      id: 'relation_5',
      step: 'pattern',
      text: '비슷한 관계 문제가 반복되나?',
      type: 'single',
      options: [
        { id: 'relation_5_a', text: '자주 반복된다', weights: { 자기이해형: 3, 불안형: 4 } },
        { id: 'relation_5_b', text: '가끔 반복된다', weights: { 감정형: 3 } },
        { id: 'relation_5_c', text: '별로 없다', weights: { 안정형: 4 } },
      ],
    },
    {
      id: 'relation_6',
      step: 'context',
      text: '상대방의 입장을 이해하려고 노력해?',
      type: 'single',
      options: [
        { id: 'relation_6_a', text: '많이 한다', weights: { 타인중심형: 5, 감정형: 3 } },
        { id: 'relation_6_b', text: '적당히 한다', weights: { 안정형: 3, 인지형: 3 } },
        { id: 'relation_6_c', text: '거의 안 한다', weights: { 자기중심형: 5, 회피형: 3 } },
      ],
    },
    {
      id: 'relation_7',
      step: 'perception',
      text: '자신을 어떤 관계 맺음 스타일이라고 봐?',
      type: 'single',
      options: [
        { id: 'relation_7_a', text: '깊고 친밀한 관계', weights: { 감정형: 5, 타인중심형: 4 } },
        { id: 'relation_7_b', text: '적당한 거리의 관계', weights: { 안정형: 4, 인지형: 3 } },
        { id: 'relation_7_c', text: '표면적인 관계', weights: { 회피형: 5, 자기중심형: 4 } },
      ],
    },
    {
      id: 'relation_8',
      step: 'perception',
      text: '관계에서 변하고 싶은 부분이 있어?',
      type: 'single',
      options: [
        { id: 'relation_8_a', text: '더 깊어지고 싶어', weights: { 감정형: 4, 타인중심형: 4 } },
        { id: 'relation_8_b', text: '거리 두고 싶어', weights: { 회피형: 4, 자기중심형: 4 } },
        { id: 'relation_8_c', text: '지금이 딱 좋아', weights: { 안정형: 5 } },
      ],
    },
  ],
  '직업/진로': [
    {
      id: 'career_1',
      step: 'context',
      text: '현재 업무에서 가장 만족하는 부분은?',
      type: 'single',
      options: [
        { id: 'career_1_a', text: '사람과의 상호작용', weights: { 타인중심형: 5, 감정형: 3 } },
        { id: 'career_1_b', text: '성과와 결과', weights: { 자기중심형: 4, 인지형: 4 } },
        { id: 'career_1_c', text: '정해진 업무를 하는 것', weights: { 안정형: 4, 해결형: 3 } },
      ],
    },
    {
      id: 'career_2',
      step: 'emotion',
      text: '업무 스트레스를 어떻게 받아들여?',
      type: 'single',
      options: [
        { id: 'career_2_a', text: '크게 받아들인다', weights: { 불안형: 5, 감정형: 4 } },
        { id: 'career_2_b', text: '적당하다', weights: { 안정형: 4, 인지형: 3 } },
        { id: 'career_2_c', text: '별로 받지 않는다', weights: { 회피형: 4, 자기중심형: 3 } },
      ],
    },
    {
      id: 'career_3',
      step: 'value',
      text: '직업 선택 시 가장 중요한 것은?',
      type: 'single',
      options: [
        { id: 'career_3_a', text: '수입', weights: { 자기중심형: 5, 인지형: 3 } },
        { id: 'career_3_b', text: '의미감과 보람', weights: { 감정형: 5, 해결형: 3 } },
        { id: 'career_3_c', text: '안정성', weights: { 불안형: 2, 안정형: 5 } },
      ],
    },
    {
      id: 'career_4',
      step: 'behavior',
      text: '진로 결정을 할 때 주로 뭘 기준으로 해?',
      type: 'single',
      options: [
        { id: 'career_4_a', text: '감정과 직관', weights: { 감정형: 5, 자기이해형: 3 } },
        { id: 'career_4_b', text: '논리적 분석', weights: { 인지형: 5, 해결형: 3 } },
        { id: 'career_4_c', text: '남의 의견', weights: { 타인중심형: 5, 불안형: 3 } },
      ],
    },
    {
      id: 'career_5',
      step: 'pattern',
      text: '현재 하는 일이 정말 하고 싶은 일이어?',
      type: 'single',
      options: [
        { id: 'career_5_a', text: '그렇다', weights: { 해결형: 4, 감정형: 4 } },
        { id: 'career_5_b', text: '부분적으로', weights: { 인지형: 3, 감정형: 2 } },
        { id: 'career_5_c', text: '아니다', weights: { 회피형: 4, 불안형: 3 } },
      ],
    },
    {
      id: 'career_6',
      step: 'perception',
      text: '커리어 변화를 두려워해?',
      type: 'single',
      options: [
        { id: 'career_6_a', text: '많이 두려워한다', weights: { 불안형: 5, 회피형: 3 } },
        { id: 'career_6_b', text: '적당하다', weights: { 안정형: 3, 인지형: 3 } },
        { id: 'career_6_c', text: '두려워하지 않는다', weights: { 직면형: 5, 자기중심형: 3 } },
      ],
    },
    {
      id: 'career_7',
      step: 'context',
      text: '직장에서의 관계가 중요해?',
      type: 'single',
      options: [
        { id: 'career_7_a', text: '매우 중요해', weights: { 타인중심형: 5, 감정형: 3 } },
        { id: 'career_7_b', text: '적당히 중요해', weights: { 안정형: 4, 인지형: 3 } },
        { id: 'career_7_c', text: '중요하지 않아', weights: { 자기중심형: 5, 회피형: 3 } },
      ],
    },
    {
      id: 'career_8',
      step: 'perception',
      text: '5년 뒤 자신의 모습이 어떻게 되길 원해?',
      type: 'single',
      options: [
        { id: 'career_8_a', text: '더 높은 직책에', weights: { 해결형: 4, 자기중심형: 3 } },
        { id: 'career_8_b', text: '지금 같은 편한 위치에', weights: { 안정형: 5, 인지형: 2 } },
        { id: 'career_8_c', text: '아직 모르겠다', weights: { 회피형: 3, 불안형: 3 } },
      ],
    },
  ],
};


type Step = 'category' | 'relationship-group' | 'relationship-type' | 'subcategory' | 'user-context' | 'questions' | 'submitting';

/** sessionStorage에 저장하는 분석 진행 상태 */
type SavedAnalysisProgress = {
  step: Step;
  category: AnalysisCategory | null;
  subcategory: AnalysisSubcategory | null;
  relationshipGroup: RelationshipGroup | null;
  relationshipType: string | null;
  currentQuestion: number;
  answers: QuestionAnswer[];
  queryType: AnalysisType;
  userContext: string;
};

export const AnalyzeClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryType = (searchParams.get('type') ?? 'self') as AnalysisType;

  // URL의 category 파라미터로 카테고리 선택 단계 건너뛰기 (랜딩 카테고리 버튼 연동)
  const queryCategory = searchParams.get('category') as AnalysisCategory | null;
  const isValidQueryCategory = queryCategory !== null && (CATEGORIES as readonly string[]).includes(queryCategory);

  const [category, setCategory] = useState<AnalysisCategory | null>(
    isValidQueryCategory ? queryCategory : null,
  );
  const [relationshipGroup, setRelationshipGroup] = useState<RelationshipGroup | null>(null);
  const [relationshipType, setRelationshipType] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(() => {
    if (isValidQueryCategory && queryCategory) {
      return SUBCATEGORIES[queryCategory] ? 'subcategory' : 'questions';
    }
    return queryType === 'self' ? 'category' : 'relationship-group';
  });
  const [subcategory, setSubcategory] = useState<AnalysisSubcategory | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userContext, setUserContext] = useState('');

  // 제출 진행 상태 추적
  const [submittingStage, setSubmittingStage] = useState<'analyzing' | 'generating' | 'organizing' | 'completed' | 'error'>('analyzing');
  const [submittingProgress, setSubmittingProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const [submittingSessionId, setSubmittingSessionId] = useState<string | null>(null);

  // 중복 제출 방지 (모바일 빠른 탭 연타 대응)
  const isSubmittingRef = useRef(false);
  // 다음 버튼 연타 방지 — 질문 전환 애니메이션 중 중복 클릭 차단
  const isNextProcessingRef = useRef(false);
  // handleBack 최신 참조 (브라우저 뒤로가기 이벤트 핸들러에서 사용)
  const handleBackRef = useRef<() => void>(() => {});

  // 이전 분석 진행 상태 복원 배너
  const [showResumeBanner, setShowResumeBanner] = useState(false);

  // 동적으로 로드된 질문들
  const [questions, setQuestions] = useState<AnalysisQuestion[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionsLoading, setQuestionsLoading] = useState(false);
  // 질문 로드용 임시 sessionId (분석 시작 시 생성, 완료 시 실제 sessionId로 대체)
  const [tempSessionId, setTempSessionId] = useState<string | null>(null);

  const hasSubcategory = category && SUBCATEGORIES[category];
  const question = questions[currentQuestion];
  const totalSteps = (hasSubcategory ? 1 : 0) + (step !== 'category' && step !== 'relationship-group' && step !== 'relationship-type' ? questions.length : 0);

  // /api/auth/me로 현재 사용자 ID 조회
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const userData = (await response.json()) as AuthUser;
          setUserId(userData.id);
        } else {
          setUserId(null);
        }
      } catch (error) {
        console.error('[AnalyzeClient] 사용자 정보 조회 실패:', error);
        setUserId(null);
      }
    };

    checkUser();
  }, []);

  const handleCategorySelect = useCallback((selectedCategory: string) => {
    const cat = selectedCategory as AnalysisCategory;
    setCategory(cat);

    if (SUBCATEGORIES[cat]) {
      setStep('subcategory');
    } else {
      setStep('questions');
    }
  }, []);

  const handleRelationshipGroupSelect = useCallback((group: RelationshipGroup) => {
    setRelationshipGroup(group);
    // 친구는 type이 없으므로 바로 질문으로 이동
    if (group === '친구') {
      const mappedCategory = mapRelationshipGroupToCategory(group);
      setCategory(mappedCategory);
      setStep('questions');
    } else {
      // type이 있는 경우 relationship-type 단계로 이동
      setStep('relationship-type');
    }
  }, []);

  const handleRelationshipTypeSelect = useCallback((type: string) => {
    setRelationshipType(type);
    const mappedCategory = mapRelationshipGroupToCategory(relationshipGroup!);
    setCategory(mappedCategory);
    setStep('questions');
  }, [relationshipGroup]);

  const handleSubcategorySelect = useCallback((sub: string) => {
    setSubcategory(sub as AnalysisSubcategory);
    setStep('user-context');
  }, []);

  const handleSubmit = useCallback(async () => {
    // 중복 제출 방지 (모바일 빠른 탭 연타 대응)
    console.log('[handleSubmit] 🚀 Started');
    if (isSubmittingRef.current) {
      console.log('[handleSubmit] ❌ Already submitting, returning');
      return;
    }
    isSubmittingRef.current = true;
    setStep('submitting');
    setSubmittingStage('analyzing');
    setSubmittingProgress(0);
    setElapsedSeconds(0);
    setSubmittingError(null);
    console.log('[handleSubmit] ✅ Set submitting state');

    try {
      // 데이터 검증: answers, questions, weights 구조 확인
      const hasWeights = questions.some(q => q.options.some(o => o.weights && Object.keys(o.weights).length > 0));
      console.log('[handleSubmit] 🔍 Data validation:', {
        answersCount: answers.length,
        questionsCount: questions.length,
        hasWeights,
        firstAnswer: answers[0],
        firstQuestion: {
          id: questions[0]?.id,
          optionsCount: questions[0]?.options.length,
          hasWeights: questions[0]?.options.some(o => !!o.weights),
        },
        sampleOption: questions[0]?.options[0],
      });

      setSubmittingProgress(25);
      const { sessionId, currentAxis } = await submitAnalysis({
        category: category as AnalysisCategory,
        subcategory: subcategory as AnalysisSubcategory | undefined,
        answers,
        questions,
        userId: userId || undefined,
        userContext: userContext || undefined,
      });

      console.log('[handleSubmit] ✅ Session created:', { sessionId, currentAxis });

      // 2. 무료 리포트 생성
      setSubmittingStage('generating');
      setSubmittingProgress(65);
      console.log('[handleSubmit] 📝 Generating free report...');
      await generateAndSaveFreeReport(sessionId);
      console.log('[handleSubmit] ✅ Free report generated');

      // 리포트 생성 완료
      setSubmittingStage('organizing');
      setSubmittingProgress(100);
      setSubmittingSessionId(sessionId);

      // 2.5 sessionStorage 정리 (캐시된 이전 sessionId 제거)
      sessionStorage.removeItem('analyze_progress');
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('analysis_') || key.startsWith('temp_')) {
          sessionStorage.removeItem(key);
        }
      });

      // 완료 상태 표시 후 리다이렉트
      setSubmittingStage('completed');
      console.log('[handleSubmit] 🔀 Redirecting to /report/' + sessionId);
      setTimeout(() => {
        router.push(`/report/${sessionId}`);
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[handleSubmit] ❌ Error:', errorMessage);
      console.log('[handleSubmit] ❌ Full error:', error);
      setSubmittingStage('error');
      setSubmittingError(errorMessage);
    }
  }, [router, answers, questions, category, subcategory, userId]);

  const handleNext = useCallback(() => {
    // 연타 방지: 이미 처리 중이면 무시
    if (isNextProcessingRef.current || isSubmittingRef.current) return;

    isNextProcessingRef.current = true;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((n) => n + 1);
      // 다음 질문 렌더링 후 잠금 해제 (300ms — 빠른 탭 차단)
      setTimeout(() => { isNextProcessingRef.current = false; }, 300);
    } else {
      handleSubmit();
      // handleSubmit 내부에서 isSubmittingRef가 true로 전환되므로 별도 해제 불필요
      isNextProcessingRef.current = false;
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
      setStep('user-context');
    } else if (step === 'questions' && queryType === 'self') {
      setStep('category');
    } else if (step === 'questions' && queryType !== 'self' && relationshipGroup === '친구') {
      setRelationshipGroup(null);
      setStep('relationship-group');
    } else if (step === 'questions' && queryType !== 'self') {
      setRelationshipType(null);
      setStep('relationship-type');
    } else if (step === 'user-context' && hasSubcategory) {
      setStep('subcategory');
    } else if (step === 'relationship-type') {
      setRelationshipGroup(null);
      setStep('relationship-group');
    } else if (step === 'relationship-group') {
      router.push('/');
    } else if (step === 'subcategory') {
      setStep('category');
    } else if (step === 'category' && queryType !== 'self') {
      setStep('relationship-group');
    } else {
      router.push('/');
    }
  }, [currentQuestion, step, hasSubcategory, queryType, relationshipGroup, router]);

  // handleBack 최신 참조 동기화
  useEffect(() => {
    handleBackRef.current = handleBack;
  }, [handleBack]);

  // 분석 진행 상태를 sessionStorage에 저장 (새로고침/이탈 후 복원용)
  useEffect(() => {
    if (step === 'submitting') {
      // 제출 완료 시 진행 상태 제거
      sessionStorage.removeItem('analyze_progress');
      return;
    }
    if (step !== 'category' && step !== 'relationship-group' && step !== 'relationship-type') {
      const progress: SavedAnalysisProgress = {
        step, category, subcategory, relationshipGroup, relationshipType, currentQuestion, answers, queryType, userContext,
      };
      sessionStorage.setItem('analyze_progress', JSON.stringify(progress));
    }
  }, [step, category, subcategory, relationshipGroup, relationshipType, currentQuestion, answers, queryType, userContext]);

  // 마운트 시 저장된 진행 상태가 있으면 복원 배너 표시
  useEffect(() => {
    if (step === 'category' || step === 'relationship-group' || step === 'relationship-type') {
      const saved = sessionStorage.getItem('analyze_progress');
      if (saved) {
        try {
          JSON.parse(saved);
          setShowResumeBanner(true);
        } catch {
          sessionStorage.removeItem('analyze_progress');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 브라우저 뒤로가기(popstate) 처리 — 이탈 대신 이전 단계로 이동
  useEffect(() => {
    window.history.pushState({ analyzeStep: step, q: currentQuestion }, '');
  }, [step, currentQuestion]);

  // step === 'questions'일 때 임시 sessionId 생성
  useEffect(() => {
    if (step === 'questions' && !tempSessionId && category) {
      const newTempSessionId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      setTempSessionId(newTempSessionId);
    }
  }, [step, tempSessionId, category]);

  // DB에서 질문 로드 (카테고리 기반)
  useEffect(() => {
    if (step === 'questions' && questions.length === 0 && category) {
      const loadQuestionsFromDb = async () => {
        const isProduction = process.env.NODE_ENV === 'production';

        try {
          setQuestionsLoading(true);
          const dbCategory = mapCategoryToDbCategory(category);

          // 사랑 카테고리일 때 서브카테고리(썸/연애중/이별/재회)를 relationship_type으로 전달
          let url = `/api/analysis/free-questions?category=${dbCategory}`;
          if (dbCategory === 'love' && subcategory) {
            url += `&relationship_type=${encodeURIComponent(subcategory)}`;
          }

          const response = await fetch(url);

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '질문을 불러올 수 없습니다');
          }

          const data = await response.json();

          // API 응답을 AnalysisQuestion 형식으로 변환
          const convertedQuestions: AnalysisQuestion[] = data.questions.map(
            (q: any) => ({
              id: q.id,
              step: q.step,
              text: q.text,
              type: q.type,
              options: q.options.map((opt: any) => ({
                id: opt.id,
                text: opt.text,
                weights: opt.weights || {},
              })),
            })
          );

          if (convertedQuestions.length === 0) {
            console.warn('[analyze-client] No questions loaded from DB');

            // Production: 에러 처리 (fallback 없음)
            if (isProduction) {
              console.error('[analyze-client] Production: Empty questions, no fallback allowed');
              toast.error('질문을 불러올 수 없습니다. 다시 시도해주세요.');
              setQuestions([]);
              setQuestionsLoading(false);
              return;
            }

            // Development: fallback을 BASE_QUESTIONS로 사용
            const fallbackQuestions = BASE_QUESTIONS[category as Category] || [];
            console.warn(
              '[analyze-client] Development: Using fallback BASE_QUESTIONS, count:',
              fallbackQuestions.length
            );
            setQuestions(fallbackQuestions);
          } else {
            setQuestions(convertedQuestions);
          }

          setCurrentQuestion(0);
          setQuestionsLoading(false);
        } catch (error) {
          console.error('[analyze-client] Failed to load questions:', error);

          // Production: 에러 발생 시 빈 상태 유지 (fallback 없음)
          if (isProduction) {
            console.error('[analyze-client] Production: Error loading questions, no fallback allowed');
            toast.error('질문을 불러올 수 없습니다. 다시 시도해주세요.');
            setQuestions([]);
            setCurrentQuestion(0);
            setQuestionsLoading(false);
            return;
          }

          // Development: fallback을 BASE_QUESTIONS로 사용
          const fallbackQuestions = BASE_QUESTIONS[category as Category] || [];
          console.warn(
            '[analyze-client] Development: Fallback to BASE_QUESTIONS due to error, count:',
            fallbackQuestions.length
          );
          setQuestions(fallbackQuestions);
          setCurrentQuestion(0);
          setQuestionsLoading(false);
        }
      };

      loadQuestionsFromDb();
    }
  }, [step, questions.length, category]);

  // 경과 시간 추적
  useEffect(() => {
    if (step !== 'submitting') return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // 재시도 함수
  const handleRetry = useCallback(() => {
    setSubmittingStage('analyzing');
    setSubmittingProgress(0);
    setElapsedSeconds(0);
    setSubmittingError(null);
    setSubmittingSessionId(null);
    isSubmittingRef.current = false;
    handleSubmit();
  }, [handleSubmit]);

  useEffect(() => {
    const onPop = () => {
      handleBackRef.current();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /** 이전 분석 이어서 하기 */
  const handleResume = useCallback(() => {
    const saved = sessionStorage.getItem('analyze_progress');
    if (!saved) return;
    try {
      const progress = JSON.parse(saved) as SavedAnalysisProgress;
      setStep(progress.step);
      setCategory(progress.category);
      setSubcategory(progress.subcategory);
      setRelationshipGroup(progress.relationshipGroup);
      setRelationshipType(progress.relationshipType);
      setCurrentQuestion(progress.currentQuestion);
      setAnswers(progress.answers);
      setUserContext(progress.userContext || '');
      setShowResumeBanner(false);
    } catch {
      sessionStorage.removeItem('analyze_progress');
      setShowResumeBanner(false);
    }
  }, []);

  /** 이전 분석 버리고 새로 시작 */
  const handleDiscardProgress = useCallback(() => {
    sessionStorage.removeItem('analyze_progress');
    setShowResumeBanner(false);
  }, []);

  const progressStep =
    step === 'category'
      ? 0
      : step === 'relationship-group'
        ? 0
        : step === 'relationship-type'
          ? 0
          : step === 'subcategory'
            ? 0
            : currentQuestion + (hasSubcategory ? 1 : 0);
  const progressPercent = totalSteps > 0 ? Math.round((progressStep / totalSteps) * 100) : 0;
  const typeInfo = ANALYSIS_TYPE_INFO[queryType];

  if (step === 'submitting') {
    return (
      <AnalysisSubmittingScreen
        stage={submittingStage}
        progress={submittingProgress}
        elapsedSeconds={elapsedSeconds}
        errorMessage={submittingError || undefined}
        onRetry={submittingStage === 'error' ? handleRetry : undefined}
      />
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 md:py-12">
      {/* 이전 분석 진행 상태 복원 배너 (새로고침/이탈 후 복귀 시 표시) */}
      {showResumeBanner && (
        <div
          className="mb-6 rounded-2xl border p-4"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p className="mb-3 text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            이전에 분석하던 내용이 있어요.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleResume}
              className="flex-1 rounded-xl py-2 text-xs font-semibold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              이어서 하기
            </button>
            <button
              onClick={handleDiscardProgress}
              className="flex-1 rounded-xl py-2 text-xs transition-all active:scale-[0.98]"
              style={{ color: 'rgba(255, 255, 255, 0.55)' }}
            >
              새로 시작
            </button>
          </div>
        </div>
      )}

      {/* 분석 타입 & 진행 상태 */}
      {step !== 'category' && step !== 'relationship' && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {typeInfo.title}
            </span>
            <span className="text-sm font-bold" style={{
              color: getAnalysisTypeColor(queryType),
              textShadow: `0 0 8px ${getAnalysisTypeColor(queryType)}40`
            }}>
              {progressStep}/{totalSteps}
            </span>
          </div>
          <div
            className="relative h-4 w-full overflow-hidden rounded-full"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${getAnalysisTypeColor(queryType)}, #A366FF)`,
              }}
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
                  className="group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 active:scale-[0.95] md:p-8 hover:shadow-2xl hover:-translate-y-1.5"
                  style={{
                    background: `linear-gradient(135deg, ${categoryColor}35 0%, ${categoryColor}15 100%)`,
                    borderLeft: `5px solid ${categoryColor}`,
                    backdropFilter: 'blur(15px)',
                  }}
                >
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-6xl">{info.icon}</div>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white transition-transform duration-300 group-hover:scale-125"
                        style={{ backgroundColor: categoryColor }}
                      >
                        →
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3
                        className="text-xl font-bold leading-tight md:text-2xl text-white"
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
      {/* 1단계: 관계 그룹 선택 */}
      {step === 'relationship-group' && queryType !== 'self' && (
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

          {/* 관계 그룹 그리드 (2열 x 3행) */}
          <div className="grid gap-4 grid-cols-2">
            {RELATIONSHIP_GROUPS.map((group) => {
              const icon = RELATIONSHIP_GROUP_ICONS[group];
              const groupColor = RELATIONSHIP_GROUP_COLORS[group];
              return (
                <button
                  key={group}
                  onClick={() => handleRelationshipGroupSelect(group)}
                  className="group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 active:scale-[0.95] hover:shadow-2xl hover:-translate-y-2"
                  style={{
                    background: `linear-gradient(135deg, ${groupColor}25 0%, ${groupColor}05 100%)`,
                    border: `1.5px solid ${groupColor}40`,
                    backdropFilter: 'blur(15px)',
                  }}
                >
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-5xl">{icon}</div>
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold text-white transition-transform duration-300 group-hover:scale-120"
                        style={{ backgroundColor: groupColor }}
                      >
                        →
                      </div>
                    </div>
                    <h3
                      className="text-base font-bold leading-tight text-white"
                    >
                      {group}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleBack}
            className="w-full rounded-xl border py-3 text-sm font-medium transition-colors active:scale-[0.98]"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)',
            }}
          >
            이전
          </button>
        </div>
      )}

      {/* 2단계: 관계 타입 선택 */}
      {step === 'relationship-type' && queryType !== 'self' && relationshipGroup && (
        <div className="space-y-10 py-6">
          {/* 헤더 */}
          <div className="space-y-6 text-center">
            <div>
              <p
                className="mb-4 text-sm font-semibold tracking-wider"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {relationshipGroup} • {typeInfo.title}
              </p>
              <h1
                className="text-3xl font-bold leading-tight md:text-4xl"
                style={{ color: '#FFFFFF' }}
              >
                더 자세히 알려줄래?
              </h1>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              관계를 더 정확히 이해하기 위해 선택해줄래.
            </p>
          </div>

          {/* 관계 타입 목록 */}
          <div className="flex flex-col gap-3">
            {RELATIONSHIP_TYPES[relationshipGroup].map((type) => {
              const groupColor = RELATIONSHIP_GROUP_COLORS[relationshipGroup];
              return (
                <button
                  key={type}
                  onClick={() => handleRelationshipTypeSelect(type)}
                  className="group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 active:scale-[0.98] hover:shadow-lg hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(135deg, ${groupColor}20 0%, ${groupColor}05 100%)`,
                    border: `1.5px solid ${groupColor}30`,
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">{type}</h3>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white transition-transform duration-300 group-hover:scale-125"
                      style={{ backgroundColor: groupColor }}
                    >
                      →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleBack}
            className="w-full rounded-xl border py-3 text-sm font-medium transition-colors active:scale-[0.98]"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)',
            }}
          >
            이전
          </button>
        </div>
      )}

      {/* 카테고리 선택 (상대/관계 분석 후) */}
      {step === 'category' && queryType !== 'self' && relationshipGroup && (
        <div className="space-y-10 py-6">
          {/* 헤더 */}
          <div className="space-y-6 text-center">
            <div>
              <p
                className="mb-4 text-sm font-semibold tracking-wider"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {relationshipType || relationshipGroup} • {typeInfo.title}
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
                  className="group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 active:scale-[0.95] md:p-8 hover:shadow-2xl hover:-translate-y-1.5"
                  style={{
                    background: `linear-gradient(135deg, ${categoryColor}35 0%, ${categoryColor}15 100%)`,
                    borderLeft: `5px solid ${categoryColor}`,
                    backdropFilter: 'blur(15px)',
                  }}
                >
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-6xl">{info.icon}</div>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white transition-transform duration-300 group-hover:scale-125"
                        style={{ backgroundColor: categoryColor }}
                      >
                        →
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3
                        className="text-xl font-bold leading-tight md:text-2xl text-white"
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
                  className="group flex min-h-[56px] w-full items-center justify-between rounded-xl border px-5 py-4 text-left text-sm font-medium transition-colors active:scale-[0.98] hover:border-opacity-100 hover:bg-opacity-15"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(8px)',
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

      {/* 자유 입력 (상황 설명) */}
      {step === 'user-context' && (
        <div className="space-y-6">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: '#FFFFFF' }}
            >
              상황을 좀 더 알려줄래?
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
              지금 상황을 한 줄로 적어주면 훨씬 정확하게 분석해줄게
            </p>
            <p className="mt-1 text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              입력하지 않아도 진행할 수 있지만, 정확도가 많이 떨어질 수 있어
            </p>
          </div>
          <div className="space-y-2">
            <textarea
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              placeholder="예: 나는 결혼 생각 없는데 상대는 있음"
              maxLength={2000}
              className="w-full resize-none rounded-xl border p-4 text-sm"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                backdropFilter: 'blur(8px)',
                minHeight: '120px',
              }}
            />
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                상황을 적으면 훨씬 더 내 얘기 같은 결과가 나와
              </p>
              <p className="text-right text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {userContext.length}/2000
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setStep('questions')}
              className="w-full rounded-xl py-3 font-semibold text-white transition-all active:scale-[0.98]"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              {userContext.trim() ? '상황 입력하고 더 정확하게 분석하기' : '선택만으로 분석하기'}
            </button>
            {!userContext.trim() && (
              <button
                onClick={() => setStep('questions')}
                className="w-full rounded-xl py-2 text-sm transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                나중에 더 자세히 설명하기
              </button>
            )}
          </div>
        </div>
      )}

      {/* 질문 로딩 중 */}
      {step === 'questions' && questionsLoading && questions.length === 0 && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .spinner-spin { animation: spin 2.5s linear infinite; }
          `}</style>
          <div className="relative h-12 w-12" aria-hidden="true">
            <svg className="spinner-spin absolute inset-0 h-full w-full" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#A366FF" strokeWidth="2.5" opacity="0.3" />
              <circle cx="40" cy="40" r="35" fill="none" stroke="url(#spinGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="55 220" />
              <defs>
                <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: "#A366FF"}} />
                  <stop offset="100%" style={{stopColor: "#F5D7E8"}} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            질문을 준비하고 있어...
          </p>
        </div>
      )}

      {/* 질문 로드 실패 */}
      {step === 'questions' && !questionsLoading && questions.length === 0 && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
          <div className="text-5xl">⚠️</div>
          <div className="space-y-2">
            <p className="text-lg font-semibold" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              질문을 불러올 수 없습니다
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              네트워크를 확인하고 다시 시도해주세요.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl border px-6 py-3 text-sm font-medium transition-colors active:scale-[0.98]"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
              }}
            >
              새로고침
            </button>
            <button
              onClick={handleBack}
              className="rounded-xl border px-6 py-3 text-sm font-medium transition-colors active:scale-[0.98]"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
              }}
            >
              뒤로가기
            </button>
          </div>
        </div>
      )}
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
                  className="flex min-h-[52px] w-full items-center rounded-xl border px-5 py-3 text-left text-sm font-medium transition-colors active:scale-[0.98]"
                  style={{
                    borderColor: isSelected
                      ? focusColor
                      : 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: isSelected
                      ? `${focusColor}30`
                      : 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(8px)',
                    '--focus-color': focusColor,
                  } as React.CSSProperties & { '--focus-color': string }}
                >
                  {option.text}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 rounded-xl border py-3 text-sm font-medium transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:bg-opacity-20"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
              }}
            >
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className="flex-[2] rounded-xl py-3 text-sm font-medium text-white transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
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
