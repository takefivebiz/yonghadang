"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

/**
 * PRD 7-1 관리자 로그인 (/admin/login).
 * - 이메일/비밀번호 로그인 폼
 * - 로그인 성공 시 /admin으로 리다이렉트
 *
 * TODO: [백엔드 연동] Server Action으로 admins 테이블 검증 후 JWT 세션 쿠키 발급
 */
const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // TODO: [백엔드 연동] POST /api/admin/auth/login 실제 호출로 교체
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 더미 인증: admin@yonghadang.com / admin1234
    if (email === "admin@yonghadang.com" && password === "admin1234") {
      router.push("/admin");
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-widest text-primary">
            용하당
          </h1>
          <p className="mt-2 text-sm text-foreground/60">관리자 전용 로그인</p>
        </div>

        {/* 폼 카드 */}
        <div className="rounded-2xl bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 이메일 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">
                이메일
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yonghadang.com"
                  required
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">
                비밀번호
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  required
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-10 text-sm outline-none transition-colors focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 더미 힌트 (개발 전용) */}
          <p className="mt-5 text-center text-xs text-foreground/40">
            데모: admin@yonghadang.com / admin1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
