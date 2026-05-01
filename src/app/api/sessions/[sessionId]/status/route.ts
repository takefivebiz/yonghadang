import { createClient } from '@/lib/supabase/server';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) => {
  const { sessionId } = await params;

  console.log('[status API] ===== REQUEST START =====');
  console.log('[status API] Route params received:', { sessionId });
  console.log('[status API] Param type:', typeof sessionId);
  console.log('[status API] Param empty?', !sessionId);

  try {
    const supabase = await createClient();
    console.log('[status API] Supabase client created');

    console.log('[status API] Querying analysis_sessions:', {
      table: 'analysis_sessions',
      columns: 'id, free_report_status, report_data',
      filter: { id: sessionId },
    });

    const { data: session, error } = await supabase
      .from('analysis_sessions')
      .select('id, free_report_status, report_data')
      .eq('id', sessionId)
      .single();

    console.log('[status API] Query completed');
    console.log('[status API] Supabase error:', {
      hasError: !!error,
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      fullError: JSON.stringify(error),
    });
    console.log('[status API] Session data:', {
      exists: !!session,
      id: session?.id,
      hasReportData: !!session?.report_data,
      status: session?.free_report_status,
    });

    if (error) {
      console.error('[status API] ❌ Supabase query error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        statusCode: error.status,
      });
    }

    if (!session) {
      console.warn('[status API] ⚠️ No session found for sessionId:', sessionId);
    }

    if (error || !session) {
      console.log('[status API] ===== REQUEST END (404) =====\n');
      return new Response(
        JSON.stringify({ error: 'not-found', message: '세션을 찾을 수 없습니다' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // report_data가 존재하면 무조건 'done' (리포트 생성 완료)
    // 아니면 free_report_status 기반 판단
    let status = 'pending';

    if (session.report_data) {
      status = 'done';
    } else {
      const statusMap: Record<string, string> = {
        pending: 'pending',
        generating: 'generating',
        completed: 'done',
        failed: 'error',
      };
      status = statusMap[session.free_report_status] || 'pending';
    }

    console.log('[status API] ✅ Returning status:', status);
    console.log('[status API] ===== REQUEST END (200) =====\n');

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        status,
        report_data: session.report_data,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[status API] ❌ Catch block error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    console.log('[status API] ===== REQUEST END (500) =====\n');
    return new Response(
      JSON.stringify({ error: '서버 오류가 발생했습니다' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
