import { AnalysisCategory } from './analysis';

/** 리포트 섹션 */
export interface ReportSection {
  title: string;
  paragraphs: string[];
}

/** 무료 리포트 — PRD 3.5 */
export interface FreeReport {
  headline: string;
  sections: ReportSection[];
  /** 결핍 문장 — PRD 3.10.7: 다음 질문으로 연결하는 마지막 문장 */
  deficitSentence: string;
}

/** 유료 확장 질문 — PRD 3.6 */
export interface PaidQuestion {
  id: string;
  question: string;
  /** 결제 금액 (KRW) */
  price: number;
  isPurchased: boolean;
  /** 구매 후 열람 가능한 확장 리포트 */
  report?: ReportSection[];
}

/** 전체 리포트 레코드 */
export interface FullReport {
  sessionId: string;
  category: AnalysisCategory;
  status: 'generating' | 'done' | 'error';
  freeReport?: FreeReport;
  paidQuestions: PaidQuestion[];
  ownerType: 'member' | 'guest';
  memberId?: string;
  /** 비회원 전화번호 (숫자만, 하이픈 없음) */
  phoneNumber?: string;
  /** 비회원 리포트 만료 시각 (ISO 8601) — PRD 5.3: 결제 후 180일 */
  expiresAt?: string;
  createdAt: string;
}
