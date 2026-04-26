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

    // 더미 인증: admin@corelog.com / admin1234
    if (email === "admin@corelog.com" && password === "admin1234") {
      router.push("/admin");
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F0420 0%, #1A0B3F 100%)' }}>
      {/* 배경 장식 - blur 요소 */}
      <div
        className="pointer-events-none absolute top-1/4 left-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#6495ED", opacity: 0.1 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#A366FF", opacity: 0.12 }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-widest" style={{ color: '#F0E6FA' }}>
            코어로그
          </h1>
          <p className="mt-3 text-sm" style={{ color: '#B8A8D8' }}>관리자 전용 로그인</p>
        </div>

        {/* 폼 카드 */}
        <div
          className="rounded-2xl p-8 backdrop-blur-md border"
          style={{
            background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))',
            borderColor: 'rgba(230, 230, 250, 0.15)',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 이메일 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: '#D4C5E2' }}>
                이메일
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@corelog.com"
                  required
                  className="w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(230, 230, 250, 0.2)',
                    color: '#F5F5F5',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#6495ED';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(100, 149, 237, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(230, 230, 250, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: '#D4C5E2' }}>
                비밀번호
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  required
                  className="w-full rounded-lg border py-3 pl-10 pr-12 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(230, 230, 250, 0.2)',
                    color: '#F5F5F5',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#6495ED';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(100, 149, 237, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(230, 230, 250, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
                  style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5' }}>
                {error}
              </p>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 rounded-lg py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)' }}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 더미 힌트 (개발 전용) */}
          <p className="mt-6 text-center text-xs" style={{ color: 'rgba(212, 197, 226, 0.6)' }}>
            데모: admin@corelog.com / admin1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
