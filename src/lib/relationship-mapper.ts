/**
 * UI 관계 선택값 ↔ 내부 DB 구조 (relationship_group + relationship_type) 매핑
 *
 * MVP에서는 UI를 단순하게 유지하면서, 내부적으로는 group + type 구조로 확장 가능하게 설계
 */

export type UIRelationshipValue =
  | '썸'
  | '연애 중'
  | '이별'
  | '재회'
  | '친구'
  | '가족'
  | '직장 동료'
  | '기타';

export interface RelationshipMapping {
  group: string | null;
  type: string | null;
}

/**
 * UI 선택값 → 내부 DB 구조로 변환
 * 예: '썸' → { group: '연인', type: '썸' }
 */
export const mapUIToInternal = (
  uiValue: UIRelationshipValue
): RelationshipMapping => {
  const mapping: Record<UIRelationshipValue, RelationshipMapping> = {
    // 로맨틱 관계 (relationship_group='연인')
    '썸': { group: '연인', type: '썸' },
    '연애 중': { group: '연인', type: '연애 중' },
    '이별': { group: '연인', type: '이별' },
    '재회': { group: '연인', type: '재회' },

    // 기타 관계 (relationship_type=null, group만 사용)
    '친구': { group: '친구', type: null },
    '가족': { group: '가족', type: null },
    '직장 동료': { group: '동료', type: null },
    '기타': { group: '기타', type: null },
  };

  return mapping[uiValue];
};

/**
 * 내부 DB 구조 → UI 선택값으로 변환
 * 예: { group: '연인', type: '썸' } → '썸'
 */
export const mapInternalToUI = (
  group: string | null,
  type: string | null
): UIRelationshipValue | null => {
  const reverseMap: Record<string, UIRelationshipValue> = {
    // 로맨틱 관계
    '연인-썸': '썸',
    '연인-연애 중': '연애 중',
    '연인-이별': '이별',
    '연인-재회': '재회',

    // 기타 관계
    '친구-null': '친구',
    '가족-null': '가족',
    '동료-null': '직장 동료',
    '기타-null': '기타',
  };

  const key = `${group}-${type}`;
  return reverseMap[key] || null;
};

/**
 * 관계 그룹 목록 (향후 확장용)
 * - '연인': 썸, 연애 중, 이별, 재회, (향후: 기혼, 배우자, 이혼, 별거 등)
 * - '배우자': (향후 구현)
 * - '친구': 단순 유형 (type 미사용)
 * - '가족': 단순 유형 (type 미사용)
 * - '동료': 단순 유형 (type 미사용)
 * - '경쟁자': 단순 유형 (type 미사용)
 * - '기타': 단순 유형 (type 미사용)
 */
export const RELATIONSHIP_GROUPS = [
  '연인',
  '배우자',
  '친구',
  '가족',
  '동료',
  '경쟁자',
] as const;

export type RelationshipGroup = (typeof RELATIONSHIP_GROUPS)[number];

/**
 * 관계 타입 (group별로 다름)
 * 각 group의 세부 type 정의 (친구는 type 없음)
 */
export const RELATIONSHIP_TYPES: Record<RelationshipGroup, string[]> = {
  '연인': ['썸', '연애 중', '이별', '재회'],
  '배우자': ['기혼', '별거', '이혼'],
  '친구': [],
  '가족': ['부모', '형제자매', '자녀', '친척'],
  '동료': ['직장 동료', '상사', '후배', '거래처'],
  '경쟁자': ['비교 대상', '라이벌', '질투 대상'],
};

/**
 * 현재 UI 선택지 목록 (MVP)
 */
export const UI_RELATIONSHIP_OPTIONS: UIRelationshipValue[] = [
  '썸',
  '연애 중',
  '이별',
  '재회',
  '친구',
  '가족',
  '직장 동료',
  '기타',
];
