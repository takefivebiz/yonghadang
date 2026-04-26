import { AnalysisSession, AnalysisCategory, TraitScores } from '@/types/analysis';
import { FreeReport, PaidQuestion, FullReport } from '@/types/report';

/**
 * 리포트 생성 서비스 입력
 * 분석 세션 정보를 기반으로 리포트를 생성하기 위한 요청 형식
 */
export interface GenerateReportRequest {
  /** 분석 세션 ID */
  sessionId: string;
  /** 분석 카테고리 */
  category: AnalysisCategory;
  /** 사용자 성향 점수 */
  traitScores: TraitScores;
  /** 추론된 사용자 타입 정보 */
  inferredUserType: {
    topTraits: Array<{ trait: keyof TraitScores; score: number }>;
    reportTone: '인지형' | '감정형' | '균형형';
    questionStrategy: '구조중심' | '감정중심' | '미래흐름' | '자기합리화깨기';
  };
  /** 사용자가 입력한 선택지 텍스트 (맥락 제공용) */
  contextAnswers?: string[];
  /** 소유자 타입 */
  ownerType: 'member' | 'guest';
  /** 회원 ID (회원일 때만) */
  memberId?: string;
  /** 비회원 전화번호 (비회원일 때만) */
  phoneNumber?: string;
}

/**
 * 리포트 생성 서비스 출력
 * AI가 생성한 리포트 콘텐츠
 */
export interface GenerateReportResponse {
  /** 무료 리포트 */
  freeReport: FreeReport;
  /** 유료 확장 질문들 (3개) */
  paidQuestions: PaidQuestion[];
}

/**
 * 리포트 생성 서비스 인터페이스
 * 분석 결과를 받아 AI 기반 리포트를 생성
 */
export interface IReportGeneratorService {
  /**
   * 리포트 생성 (메인 메서드)
   * @param request 리포트 생성 요청
   * @returns 생성된 리포트 (무료 리포트 + 유료 질문)
   * @throws ReportGenerationError
   */
  generateReport(request: GenerateReportRequest): Promise<GenerateReportResponse>;

  /**
   * 무료 리포트만 생성 (테스트/재생성용)
   */
  generateFreeReport(request: GenerateReportRequest): Promise<FreeReport>;

  /**
   * 유료 확장 질문만 생성 (테스트/재생성용)
   */
  generatePaidQuestions(request: GenerateReportRequest): Promise<PaidQuestion[]>;
}

/**
 * 리포트 생성 에러
 */
export class ReportGenerationError extends Error {
  constructor(
    message: string,
    public code: 'AI_ERROR' | 'INVALID_INPUT' | 'TIMEOUT' | 'UNKNOWN',
    public sessionId?: string,
  ) {
    super(message);
    this.name = 'ReportGenerationError';
  }
}

/**
 * AI 프롬프트 템플릿 버전 정의
 * PRD 3.8: AI 프롬프트 템플릿은 카테고리별로 다름
 */
export interface PromptTemplate {
  /** 템플릿 ID */
  id: string;
  /** 적용 카테고리 */
  category: AnalysisCategory;
  /** 무료 리포트 생성 프롬프트 */
  freeReportPrompt: string;
  /** 유료 질문 생성 프롬프트 */
  paidQuestionPrompt: string;
  /** 버전 */
  version: string;
  /** 생성 날짜 */
  createdAt: string;
  /** 업데이트 날짜 */
  updatedAt: string;
}

/**
 * DB 저장용 리포트 레코드
 * FullReport에 생성 타임스탬프와 추가 메타데이터 포함
 */
export interface ReportRecord extends FullReport {
  /** 리포트 생성 완료 시각 */
  completedAt?: string;
  /** 생성에 사용된 AI 모델 버전 */
  aiModelVersion?: string;
  /** 생성에 사용된 프롬프트 템플릿 버전 */
  promptVersion?: string;
}

/**
 * TODO: [백엔드 연동]
 * 다음 구현 필요:
 * 1. ReportGeneratorService 구현 (Anthropic SDK 사용)
 * 2. PromptTemplate 관리 (DB 또는 파일 기반)
 * 3. API 라우트: POST /api/reports/generate
 * 4. Server Action: generateReport()
 */
