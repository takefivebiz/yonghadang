"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// useSearchParams()는 Suspense 경계 안에서만 사용 가능 (Next.js 15 요구사항)
const AuthPageContent = () => {
  const [openModal, setOpenModal] = useState<"terms" | "privacy" | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "kakao" | null
  >(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // ESC 키 처리 및 배경 스크롤 차단
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openModal) {
        setOpenModal(null);
      }
    };

    if (openModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [openModal]);

  // OAuth callback 실패 시 에러 표시
  useEffect(() => {
    const error = searchParams.get("error");
    if (error)
      setOauthError("로그인 중 문제가 발생했어요. 다시 시도해 주세요.");
  }, [searchParams]);

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    setLoadingProvider(provider);
    setOauthError(null);

    // 로그인 후 돌아갈 경로: sessionStorage(컴포넌트 설정) > URL ?next=(미들웨어) > "/"
    const next =
      sessionStorage.getItem("redirect_to") ?? searchParams.get("next") ?? "/";
    sessionStorage.removeItem("redirect_to");

    const callbackUrl = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`;

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
    });

    if (error) {
      console.error(`[auth] ${provider} OAuth 실패:`, error.message);
      setOauthError("로그인 중 문제가 발생했어요. 다시 시도해 주세요.");
      setLoadingProvider(null);
    }
    // 성공 시 브라우저가 OAuth 페이지로 이동 → 여기서 추가 처리 없음
  };

  return (
    <div className="relative flex min-h-[calc(100vh-60px)] w-full max-w-full overflow-hidden px-6 pb-10 pt-11">
      <div className="pointer-events-none absolute inset-0 bg-[#171322]" />
      <div
        className="pointer-events-none absolute -top-28 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(95, 79, 152, 0.26) 0%, rgba(209, 109, 172, 0.08) 42%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[348px] flex-col items-center">
        {/* 메인 카피 + 서브텍스트 */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-body text-[13px] text-highlight/42">
            심리탐정 리포트
          </span>

          <div className="relative mt-6 w-full">
            <h1 className="font-hero text-[1.7rem] leading-[1.18] tracking-normal text-highlight/95">
              파일 열람을
              <br />
              계속하려면
            </h1>
            <p className="mt-4 max-w-[285px] font-body text-[0.8rem] leading-4 text-highlight/62">
              의뢰 기록을 안전하게 <br /> 보관하기 위해 로그인이 필요해.
            </p>
          </div>

          <div
            className="relative mt-8 h-[100px] w-[150px] pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 58% 52% at 50% 50%, rgba(229, 190, 118, 0.315) 10%, rgba(210, 145, 95, 0.155) 34%, transparent 86%)",
              }}
            />
            <Image
              src="/img/cat2.png"
              alt=""
              fill
              priority
              className="object-contain opacity-90"
            />
          </div>
        </div>

        {/* 소셜 로그인 섹션 */}
        <div className="mt-7 w-full space-y-3">
          {/* OAuth 에러 메시지 */}
          {oauthError && (
            <p className="text-center text-xs text-red-400/80">{oauthError}</p>
          )}
          {/* Google 로그인 */}
          <button
            onClick={() => handleSocialLogin("google")}
            disabled={loadingProvider !== null}
            className="group flex h-[60px] w-full items-center justify-center gap-4 rounded-lg border border-white/12 bg-highlight/10 px-4 text-[#ffffffb5] shadow-[0_14px_40px_rgba(0,0,0,0.20)] transition-all duration-200 hover:bg-highlight/90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {loadingProvider === "google" ? (
              <span className="h-4 w-4 animate-spin rounded-full border border-[#1f1a2d]/25 border-t-[#1f1a2d]/80" />
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}

            <span className="text-base font-nomal transition-colors duration-200">
              {loadingProvider === "google"
                ? "연결 중..."
                : "Google로 계속하기"}
            </span>
          </button>

          {/* Kakao 로그인 — Supabase Dashboard에서 Kakao provider 활성화 후 동작 */}
          <button
            onClick={() => handleSocialLogin("kakao")}
            disabled={loadingProvider !== null}
            className="group flex h-[60px] w-full items-center justify-center gap-4 rounded-lg border border-white/12 bg-highlight/10 px-4 text-[#ffffffb5] shadow-[0_14px_40px_rgba(0,0,0,0.20)] transition-all duration-200 hover:bg-highlight/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingProvider === "kakao" ? (
              <span className="h-4 w-4 animate-spin rounded-full border border-highlight/30 border-t-highlight/80" />
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 1C5.925 1 1 4.82 1 9.5c0 3.12 2.003 5.843 5.03 7.282l-1.207 4.397c-.113.412.268.781.654.56l3.868-2.343c.506.038 1.022.104 1.655.104 6.075 0 11-3.82 11-8.5S18.075 1 12 1z"
                  fill="#FEE500"
                />
              </svg>
            )}

            <span className="text-base font-nomal transition-colors duration-200">
              {loadingProvider === "kakao" ? "연결 중..." : "Kakao로 계속하기"}
            </span>
          </button>
        </div>
        {/* 하단 약관 안내 */}
        <div className="mt-1 flex w-full items-center gap-4"></div>

        <div className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-highlight/30">
          <svg
            className="h-3 w-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <p className="text-[0.55rem] leading-relaxed">
            로그인하면{" "}
            <button
              onClick={() => setOpenModal("terms")}
              className="text-highlight/60 hover:text-highlight transition-colors"
              data-testid="auth-terms-btn"
            >
              이용약관
            </button>{" "}
            및{" "}
            <button
              onClick={() => setOpenModal("privacy")}
              className="text-highlight/60 hover:text-highlight transition-colors"
              data-testid="auth-privacy-btn"
            >
              개인정보처리방침
            </button>
            에 동의하게 됩니다
          </p>
        </div>
        {/* 이용약관 모달 */}
        {openModal === "terms" && (
          <Modal
            isOpen={openModal === "terms"}
            onClose={() => setOpenModal(null)}
            title="이용약관"
            content={<TermsContent />}
          />
        )}
        {/* 개인정보처리방침 모달 */}
        {openModal === "privacy" && (
          <Modal
            isOpen={openModal === "privacy"}
            onClose={() => setOpenModal(null)}
            title="개인정보처리방침"
            content={<PrivacyContent />}
          />
        )}
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, content }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      data-testid="terms-modal-overlay"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-surface/30 bg-background flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 border-b border-surface/30 bg-background/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-highlight">{title}</h2>
            <button
              onClick={onClose}
              className="text-highlight/50 transition-colors hover:text-highlight"
              aria-label="닫기"
              data-testid="terms-modal-close-btn"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{content}</div>

        {/* 푸터 */}
        <div className="border-t border-surface/30 bg-background/95 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-highlight/20 bg-highlight/5 py-2.5 text-xs font-medium text-highlight transition-colors hover:bg-highlight/10"
            data-testid="terms-modal-footer-close-btn"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

/* eslint-disable react/no-unescaped-entities */
const TermsContent = () => (
  <div className="space-y-4 text-xs leading-relaxed text-highlight/70">
    <section className="space-y-2 border-b border-surface/20 pb-4">
      <p className="text-sm text-highlight">여러분을 환영합니다.</p>
      <p>
        VEIL(이하 &quot;서비스&quot;)을 이용해 주셔서 감사합니다. 본 약관은
        VEIL(이하 &quot;회사&quot;)이 제공하는 서비스의 이용과 관련하여 회사와
        이용자 간의 권리, 의무 및 책임 사항을 규정합니다.
      </p>
      <p>
        서비스를 이용하거나 회원가입을 진행하는 경우, 본 약관 및 관련 운영
        정책에 동의한 것으로 간주됩니다.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제1조 (용어의 정의)</h3>
      <p>본 약관에서 사용하는 용어의 의미는 다음과 같습니다.</p>
      <ul className="space-y-1 pl-4">
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>
            "회원"이란 회사의 서비스에 접속하여 본 약관에 따라 이용계약을
            체결하고 서비스를 이용하는 자를 의미합니다.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>
            "이용자"란 회원 및 비회원을 포함하여 서비스를 이용하는 모든 자를
            의미합니다.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>
            "서비스"란 회사가 제공하는 AI 기반 콘텐츠 해석 및 결과 제공 서비스
            일체를 의미합니다.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>
            "무료서비스"란 이용자가 별도의 결제 없이 이용할 수 있는 서비스를
            의미합니다.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>
            "유료서비스"란 이용자가 일정 금액을 결제한 후 이용할 수 있는
            서비스를 의미합니다.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>
            "결과물"이란 서비스 내에서 제공되는 텍스트, 해석 콘텐츠, 이미지 및
            기타 생성 결과 일체를 의미합니다.
          </span>
        </li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">
        제2조 (약관의 효력 및 변경)
      </h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>
          본 약관은 서비스 화면 또는 기타 방법을 통해 공지함으로써 효력이
          발생합니다.
        </li>
        <li>
          회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수
          있습니다.
        </li>
        <li>약관이 변경되는 경우 적용일 및 변경 사유를 사전에 공지합니다.</li>
        <li>
          이용자가 변경된 약관 시행 이후에도 서비스를 계속 이용하는 경우 변경
          사항에 동의한 것으로 간주합니다.
        </li>
        <li>
          이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원
          탈퇴를 요청할 수 있습니다.
        </li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제3조 (이용계약의 성립)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>
          서비스 이용계약은 이용자가 본 약관에 동의하고 서비스를 이용하거나
          회원가입을 완료한 시점에 성립합니다.
        </li>
        <li>회사는 특별한 사정이 없는 한 회원가입 신청을 승인합니다.</li>
        <li>
          다만 다음의 경우 회원가입 또는 서비스 이용을 제한하거나 거부할 수
          있습니다.
        </li>
      </ol>
      <ul className="space-y-1 pl-8">
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>타인의 정보를 도용한 경우</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>허위 정보를 입력한 경우</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>서비스 운영을 방해할 목적으로 이용하는 경우</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>관련 법령 또는 본 약관을 위반한 경우</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>기타 회사 정책상 부적절하다고 판단되는 경우</span>
        </li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">
        제4조 (개인정보의 수집 및 보호)
      </h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>
          회사는 서비스 제공에 필요한 범위 내에서 이용자의 개인정보를 수집 및
          이용합니다.
        </li>
        <li>개인정보 처리에 관한 자세한 사항은 개인정보처리방침에 따릅니다.</li>
        <li>
          회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단,
          관련 법령에 따른 요청이 있는 경우 예외로 합니다.
        </li>
        <li>
          이용자는 언제든지 개인정보 수집 및 이용 동의를 철회할 수 있습니다.
        </li>
      </ol>
    </section>

    <section className="space-y-2 border-t border-surface/20 pt-4">
      <p className="font-semibold text-highlight">부칙</p>
      <p>본 약관은 2026년 5월 8일부터 시행됩니다.</p>
    </section>
  </div>
);

const PrivacyContent = () => (
  <div className="space-y-4 text-xs leading-relaxed text-highlight/70">
    <section className="space-y-2 border-b border-surface/20 pb-4">
      <p className="text-sm text-highlight">VEIL 개인정보처리방침</p>
      <p>
        VEIL(이하 "회사")은 이용자의 개인정보를 중요하게 생각하며, 「개인정보
        보호법」 등 관련 법령을 준수합니다.
      </p>
      <p>
        본 개인정보처리방침은 회사가 어떤 정보를 수집하고, 어떻게 이용 및
        보호하는지 안내하기 위한 내용입니다.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">
        1. 개인정보의 수집 및 이용 목적
      </h3>
      <p>회사는 다음 목적을 위해 개인정보를 수집 및 이용합니다.</p>

      <div className="space-y-2.5 pl-4">
        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">
            회원가입 및 서비스 이용
          </p>
          <div className="text-xs text-highlight/65 space-y-1 mt-1 pl-2">
            <p>수집 항목: 소셜 로그인 정보, 이메일, 닉네임</p>
            <p>이용 목적: 회원 식별, 서비스 제공, 기록 저장 및 다시보기</p>
            <p>보유 기간: 회원 탈퇴 또는 서비스 이용 종료 시까지</p>
          </div>
        </div>

        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">
            비회원 서비스 이용
          </p>
          <div className="text-xs text-highlight/65 space-y-1 mt-1 pl-2">
            <p>수집 항목: 휴대전화 번호, 비밀번호(4자리)</p>
            <p>이용 목적: 비회원 결과 조회, 결과 다시 확인</p>
            <p>보유 기간: 결과 보관 기간 종료 시까지</p>
          </div>
        </div>

        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">
            문의 및 고객 응대
          </p>
          <div className="text-xs text-highlight/65 space-y-1 mt-1 pl-2">
            <p>수집 항목: 이메일, 문의 내용, 서비스 이용 정보</p>
            <p>이용 목적: 문의 응대, 오류 확인 및 서비스 개선</p>
            <p>보유 기간: 문의 처리 완료 후 관련 법령에 따른 기간까지</p>
          </div>
        </div>

        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">유료 서비스 이용</p>
          <div className="text-xs text-highlight/65 space-y-1 mt-1 pl-2">
            <p>수집 항목: 결제 정보, 결제 기록, 주문 관련 정보</p>
            <p>이용 목적: 결제 처리, 구매 내역 확인, 환불 및 고객 지원</p>
            <p>보유 기간: 관련 법령에 따른 보관 기간까지</p>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">
        2. 개인정보의 보유 및 이용 기간
      </h3>
      <p>
        회사는 개인정보 수집 및 이용 목적이 달성된 후 지체 없이 개인정보를
        삭제합니다.
      </p>
      <p>다만 관련 법령에 따라 일정 기간 보관이 필요한 경우:</p>
      <ul className="space-y-1 pl-4">
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>계약 또는 청약철회 기록: 5년</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>결제 및 공급 기록: 5년</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>소비자 불만 및 분쟁 처리 기록: 3년</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>서비스 방문 기록: 3개월</span>
        </li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">3. 개인정보의 제3자 제공</h3>
      <p>회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.</p>
      <p>다만 아래의 경우에는 예외로 할 수 있습니다:</p>
      <ul className="space-y-1 pl-4">
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>관련 법령에 따른 요청이 있는 경우</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>이용자가 사전에 동의한 경우</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>서비스 제공 및 결제 처리에 필요한 경우</span>
        </li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">4. 개인정보 처리 위탁</h3>
      <p>
        회사는 원활한 서비스 제공을 위해 일부 업무를 외부 업체에 위탁할 수
        있습니다.
      </p>

      <div className="space-y-1.5 pl-4">
        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">결제 처리</p>
          <p className="text-xs text-highlight/65 mt-1">
            수탁 업체: 결제대행사(PG사) | 위탁 업무: 결제 처리 및 환불 지원
          </p>
        </div>

        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">서비스 분석</p>
          <p className="text-xs text-highlight/65 mt-1">
            수탁 업체: Google Analytics | 위탁 업무: 서비스 이용 통계 및 분석
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">5. 이용자의 권리</h3>
      <p>
        이용자는 언제든지 자신의 개인정보에 대해 다음 권리를 행사할 수 있습니다:
      </p>
      <ul className="space-y-1 pl-4">
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>개인정보 열람</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>수정 요청</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>삭제 요청</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>처리 정지 요청</span>
        </li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">6. 개인정보의 파기</h3>
      <p>
        회사는 개인정보 보유 기간이 종료되거나 처리 목적이 달성된 경우 지체 없이
        개인정보를 삭제합니다.
      </p>
      <p>
        전자적 파일은 복구가 불가능한 방식으로 삭제되며, 출력물은 분쇄 또는 소각
        처리됩니다.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">
        7. 개인정보 보호를 위한 조치
      </h3>
      <p>회사는 개인정보 보호를 위해 다음과 같은 조치를 적용합니다:</p>
      <ul className="space-y-1 pl-4">
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>개인정보 접근 제한</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>비밀번호 및 인증 정보 보호</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>보안 시스템 운영</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>접근 권한 최소화 및 개인정보 처리 인원 최소화</span>
        </li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">8. AI 서비스 관련 안내</h3>
      <p>VEIL은 생성형 인공지능(AI)을 기반으로 콘텐츠 및 결과를 제공합니다.</p>
      <p>
        서비스 품질 개선 및 안정적인 운영을 위해 이용자가 입력한 일부 데이터가
        비식별화된 형태로 분석 및 활용될 수 있습니다.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">9. 개인정보 보호책임자</h3>
      <p>
        회사는 개인정보 보호 및 관련 문의 대응을 위해 다음과 같이 개인정보
        보호책임자를 지정합니다.
      </p>
      <div className="rounded-lg border border-surface/20 bg-surface/5 p-2.5">
        <p className="text-xs text-highlight/65">이메일: support@veil.xxx</p>
      </div>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">
        10. 개인정보처리방침의 변경
      </h3>
      <p>
        본 개인정보처리방침은 관련 법령 또는 서비스 변경에 따라 수정될 수
        있습니다.
      </p>
      <p>변경 사항은 서비스 내 공지사항 또는 화면을 통해 안내합니다.</p>
    </section>

    <section className="space-y-2 border-t border-surface/20 pt-4">
      <p className="font-semibold text-highlight">시행일자</p>
      <p>2026년 5월 8일</p>
    </section>
  </div>
);

const AuthPage = () => (
  <Suspense>
    <AuthPageContent />
  </Suspense>
);

export default AuthPage;
