export * from './analysis';
export * from './payment';
export * from './report';
export * from './order';
export * from './admin';
export * from './member';

// Supabase 쿼리 결과 타입
export interface Question extends Record<string, unknown> {
  id: string;
  title?: string;
  description?: string;
  question_axis?: string;
  hooking_type?: string;
}
