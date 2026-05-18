import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const POST = async () => {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[auth/logout] signOut 실패:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[auth/logout] 예외 발생:", err);
    return NextResponse.json({ error: "로그아웃 처리 중 오류가 발생했습니다" }, { status: 500 });
  }
};
