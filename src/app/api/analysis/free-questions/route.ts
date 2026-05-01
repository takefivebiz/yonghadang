import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * GET /api/analysis/free-questions?category=love
 *
 * category 기반으로 초기 분석(무료) 질문 세트 조회
 * 선택적 필터: relationship_group, relationship_type (향후 확장용)
 *
 * 테이블 구조:
 * - question_sets: purpose='free' + category
 * - questions: purpose='free' + question_set_id
 * - question_options: question_id 기반 선택지 (각 질문당 4개)
 */
export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const relationshipGroup = searchParams.get('relationship_group');
    const relationshipType = searchParams.get('relationship_type');

    console.log('[free-questions API] Request params:', {
      category,
      relationshipGroup,
      relationshipType,
    });

    if (!category) {
      return NextResponse.json(
        { error: 'category 파라미터가 필요합니다' },
        { status: 400 }
      );
    }

    // 유효한 카테고리 확인
    const validCategories = ['love', 'emotion', 'relationship', 'career'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: '유효하지 않은 카테고리입니다' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 사랑 카테고리일 때 relationship_type 필수 확인
    if (category === 'love' && !relationshipType) {
      return NextResponse.json(
        { error: 'love 카테고리에서는 relationship_type 파라미터가 필수입니다' },
        { status: 400 }
      );
    }

    // 1. 무료 질문 세트 조회 (purpose='free' + category + relationship_type)
    let setQuery = supabase
      .from('question_sets')
      .select('id, relationship_type')
      .eq('purpose', 'free')
      .eq('category', category)
      .eq('is_active', true)
      .limit(1);

    // 사랑 카테고리: relationship_type으로 필터
    if (category === 'love' && relationshipType) {
      setQuery = setQuery.eq('relationship_type', relationshipType);
    }

    // 선택적 필터: relationship_group (MVP에서는 기본적으로 ALL 조회)
    if (relationshipGroup) {
      setQuery = setQuery.eq('relationship_group', relationshipGroup);
    }

    const { data: questionSetArray, error: setError } = await setQuery;
    const questionSet = questionSetArray?.[0] || null;

    if (setError || !questionSet) {
      const message = `무료 질문 세트를 찾을 수 없습니다 (category: ${category}${relationshipType ? `, relationship_type: ${relationshipType}` : ''})`;
      console.error('[free-questions API]', message, setError);

      // Production: 에러 반환 (fallback 없음)
      if (isProduction) {
        return NextResponse.json({ error: message }, { status: 404 });
      }

      // Development: null 질문 세트로 진행 (fallback 허용, 빈 배열 반환)
      console.warn('[free-questions API] Development mode: 빈 질문으로 진행');
      return NextResponse.json({
        questionSetId: null,
        category,
        questions: [],
        totalQuestions: 0,
        isDevelopment: true,
      });
    }

    // 2. 무료 질문 조회 (purpose='free' + question_set_id + is_active=true)
    let questionsQuery = supabase
      .from('questions')
      .select('id, text, step, question_type, display_order, sort_order')
      .eq('purpose', 'free')
      .eq('question_set_id', questionSet.id)
      .eq('is_active', true)
      .order('step', { ascending: true })
      .order('sort_order', { ascending: true });

    // 선택적 필터: relationship_group (향후 사용)
    if (relationshipGroup) {
      questionsQuery = questionsQuery.eq('relationship_group', relationshipGroup);
    }

    let { data: questions, error: questionsError } = await questionsQuery;

    if (questionsError || !questions || questions.length === 0) {
      const message = `질문을 불러올 수 없습니다 (set_id: ${questionSet.id})`;
      console.error('[free-questions API]', message, questionsError);

      // Production: 에러 반환
      if (isProduction) {
        return NextResponse.json({ error: message }, { status: 500 });
      }

      // Development: 빈 배열로 반환
      return NextResponse.json({
        questionSetId: questionSet.id,
        category,
        questions: [],
        totalQuestions: 0,
        isDevelopment: true,
      });
    }

    // 각 step별로 sort_order 1 또는 2 중 랜덤 선택 (love 카테고리는 각 step당 2개씩 있음)
    // step별 질문 그룹화
    const questionsByStep = questions.reduce((map, q) => {
      const step = q.step;
      if (!map.has(step)) {
        map.set(step, []);
      }
      map.get(step).push(q);
      return map;
    }, new Map<string, any[]>());

    // 각 step에서 랜덤하게 1개 선택 (sort_order 1 또는 2)
    const selectedQuestions = Array.from(questionsByStep.entries()).map(([step, stepsQuestions]) => {
      if (stepsQuestions.length === 0) return null;
      // 같은 step에 여러 개가 있으면 sort_order 1과 2 중 랜덤 선택
      if (stepsQuestions.length > 1) {
        const randomIdx = Math.floor(Math.random() * stepsQuestions.length);
        return stepsQuestions[randomIdx];
      }
      return stepsQuestions[0];
    }).filter((q) => q !== null);

    console.log('[free-questions API] Step-based selection:', {
      beforeCount: questions.length,
      afterCount: selectedQuestions.length,
      byStep: Array.from(questionsByStep.entries()).map(([step, qs]) => ({
        step,
        count: qs.length,
        sortOrders: qs.map(q => q.sort_order),
      })),
    });

    questions = selectedQuestions;

    console.log('[free-questions API] selected questions:', selectedQuestions.map(q => ({
      step: q.step,
      sort_order: q.sort_order,
      text: q.text,
    })));

    // 3. 각 질문의 선택지 조회
    const { data: allOptions, error: optionsError } = await supabase
      .from('question_options')
      .select('question_id, id, text, display_order, weights')
      .in('question_id', questions.map((q) => q.id))
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (optionsError) {
      console.error('[free-questions API] Options fetch error:', optionsError);

      // Production: 에러 반환
      if (isProduction) {
        return NextResponse.json(
          { error: '선택지를 불러올 수 없습니다' },
          { status: 500 }
        );
      }

      // Development: 빈 옵션으로 진행
      console.warn('[free-questions API] Development mode: 옵션 없이 진행');
    }

    // 4. 응답 구성 (AnalysisQuestion 호환 형식)
    const questionsWithOptions = questions.map((q) => ({
      id: q.id,
      step: q.step,
      text: q.text,
      type: q.question_type || 'single',
      options: (allOptions || [])
        .filter((opt) => opt.question_id === q.id)
        .map((opt) => ({
          id: opt.id,
          text: opt.text,
          weights: opt.weights || {},
        })),
    }));

    return NextResponse.json({
      questionSetId: questionSet.id,
      category,
      questions: questionsWithOptions,
      totalQuestions: questions.length,
      isDevelopment: false,
    });
  } catch (error) {
    console.error('[free-questions API] Unexpected error:', error);

    const message = '서버 오류가 발생했습니다';
    if (isProduction) {
      return NextResponse.json({ error: message }, { status: 500 });
    }

    // Development: 에러 메시지 포함
    return NextResponse.json(
      { error: message, details: String(error) },
      { status: 500 }
    );
  }
};
