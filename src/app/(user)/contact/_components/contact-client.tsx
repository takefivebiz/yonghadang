"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    question: "결제는 어떻게 하나요?",
    answer:
      "서비스에서 원하는 콘텐츠를 선택하신 후 '결제하기' 버튼을 클릭하시면 토스페이먼츠를 통해 결제하실 수 있습니다. 신용카드, 계좌이체 등 다양한 결제 수단을 지원합니다.",
  },
  {
    id: "faq-2",
    question: "무료 리포트를 다시 볼 수 있나요?",
    answer:
      "네, 무료 기본 분석은 로그인하지 않아도 언제든지 다시 볼 수 있습니다. 세션이 만료된 경우 다시 로그인하거나 비회원 주문 조회를 통해 접근할 수 있습니다.",
  },
  {
    id: "faq-3",
    question: "비회원으로 구매한 리포트는 어떻게 조회하나요?",
    answer:
      "헤더의 '비회원 리포트 조회' 버튼을 클릭한 후, 결제 시 등록한 휴대폰번호와 비밀번호로 로그인하시면 구매 내역을 확인할 수 있습니다.",
  },
  {
    id: "faq-4",
    question: "환불은 어떻게 받나요?",
    answer:
      "서비스의 특성상 일반적인 환불은 불가능하나, 결제 오류가 발생한 경우 문의하기를 통해 문제를 알려주시면 처리해드립니다.",
  },
  {
    id: "faq-5",
    question: "개인정보는 안전하게 관리되나요?",
    answer:
      "네, 모든 개인정보는 SSL 암호화를 통해 안전하게 전송되며, 비밀번호는 암호화하여 저장됩니다. 자세한 내용은 개인정보처리방침을 참고해주세요.",
  },
];

type FormState = "idle" | "submitting" | "success" | "error";

/**
 * PRD 6-12.3 문의하기 페이지 (/contact)
 * - FAQ 아코디언
 * - 문의 폼
 */
export const ContactClient = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "기타",
    title: "",
    content: "",
  });

  const handleFAQToggle = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "submitting") return;

    // 유효성 검사
    if (!formData.name.trim()) {
      toast.error("이름을 입력해주세요");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("올바른 이메일을 입력해주세요");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("내용을 입력해주세요");
      return;
    }

    setFormState("submitting");

    // 시뮬레이션: 0.8초 후 성공
    window.setTimeout(() => {
      // TODO: [백엔드 연동] POST /api/contact 호출
      setFormState("success");
      toast.success("문의가 접수되었습니다. 빠른 시일 내에 답변드릴게요.");
      setFormData({
        name: "",
        email: "",
        category: "기타",
        title: "",
        content: "",
      });
      window.setTimeout(() => setFormState("idle"), 3000);
    }, 800);
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      {/* ── 배경 — 파스텔 라벤더 그라디언트 ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 55%, #F5F0E8 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#E8D4F0", opacity: 0.35 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-72 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "#F5D7E8", opacity: 0.3 }}
      />

      <div
        className="relative z-10 mx-auto max-w-2xl px-4 py-12"
        style={{ animation: "authFadeIn 0.6s ease-out" }}
      >
        {/* 헤더 */}
        <header className="mb-12 text-center">
          <h1 className="font-display text-3xl font-bold text-[#4A3B5C] mb-2">
            문의하기
          </h1>
          <p className="text-sm text-[#4A3B5C]/60">
            궁금한 점이 있으신가요? 아래에서 답변을 찾거나 문의해주세요.
          </p>
        </header>

        {/* FAQ 섹션 */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold text-[#4A3B5C] mb-5">
            자주하는 질문 (FAQ)
          </h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleFAQToggle(item.id)}
                className="w-full rounded-xl text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A3B5C]/40"
              >
                <div
                  className="flex items-center justify-between rounded-xl px-5 py-4 transition-all duration-300"
                  style={{
                    backgroundColor:
                      expandedFAQ === item.id
                        ? "rgba(232, 212, 240, 0.4)"
                        : "rgba(255, 255, 255, 0.8)",
                    border: "1.5px solid rgba(74, 59, 92, 0.1)",
                  }}
                >
                  <h3 className="font-medium text-[#4A3B5C] pr-4">
                    {item.question}
                  </h3>
                  <span
                    className="flex-shrink-0 text-[#4A3B5C]/60 transition-transform duration-300"
                    style={{
                      transform:
                        expandedFAQ === item.id
                          ? "rotate(180deg)"
                          : "rotate(0)",
                    }}
                  >
                    ▼
                  </span>
                </div>

                {expandedFAQ === item.id && (
                  <div
                    className="mt-2 rounded-xl px-5 py-4"
                    style={{
                      backgroundColor: "rgba(232, 212, 240, 0.2)",
                      border: "1px solid rgba(74, 59, 92, 0.1)",
                    }}
                  >
                    <p className="text-sm leading-relaxed text-[#4A3B5C]/80">
                      {item.answer}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 구분선 */}
        <div className="my-10 border-t border-[#D4A5A5]/30" />

        {/* 문의 폼 섹션 */}
        <section>
          <h2 className="font-display text-xl font-bold text-[#4A3B5C] mb-5">
            문의하기
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* 이름 */}
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-sm font-medium text-[#4A3B5C]"
              >
                이름 <span className="text-rose-400">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="홍길동"
                className="w-full rounded-xl border px-4 py-3 text-sm text-[#4A3B5C] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#4A3B5C]/40"
                style={{
                  borderColor: "rgba(74, 59, 92, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                }}
                required
              />
            </div>

            {/* 이메일 */}
            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-sm font-medium text-[#4A3B5C]"
              >
                이메일 <span className="text-rose-400">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="example@email.com"
                className="w-full rounded-xl border px-4 py-3 text-sm text-[#4A3B5C] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#4A3B5C]/40"
                style={{
                  borderColor: "rgba(74, 59, 92, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                }}
                required
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label
                htmlFor="contact-category"
                className="mb-2 block text-sm font-medium text-[#4A3B5C]"
              >
                카테고리 (선택)
              </label>
              <select
                id="contact-category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full rounded-xl border px-4 py-3 text-sm text-[#4A3B5C] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#4A3B5C]/40"
                style={{
                  borderColor: "rgba(74, 59, 92, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                }}
              >
                <option>결제</option>
                <option>기술</option>
                <option>기타</option>
              </select>
            </div>

            {/* 제목 */}
            <div>
              <label
                htmlFor="contact-title"
                className="mb-2 block text-sm font-medium text-[#4A3B5C]"
              >
                제목 <span className="text-rose-400">*</span>
              </label>
              <input
                id="contact-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="문의 제목을 입력해주세요"
                className="w-full rounded-xl border px-4 py-3 text-sm text-[#4A3B5C] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#4A3B5C]/40"
                style={{
                  borderColor: "rgba(74, 59, 92, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                }}
                required
              />
            </div>

            {/* 내용 */}
            <div>
              <label
                htmlFor="contact-content"
                className="mb-2 block text-sm font-medium text-[#4A3B5C]"
              >
                내용 <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="contact-content"
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                placeholder="자세한 내용을 입력해주세요 (최소 10자)"
                rows={6}
                className="w-full rounded-xl border px-4 py-3 text-sm text-[#4A3B5C] outline-none resize-none transition-colors focus-visible:ring-2 focus-visible:ring-[#4A3B5C]/40"
                style={{
                  borderColor: "rgba(74, 59, 92, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                }}
                required
              />
            </div>

            {/* 성공 메시지 */}
            {formState === "success" && (
              <div
                className="rounded-xl px-4 py-3 text-sm text-center"
                style={{
                  backgroundColor: "rgba(76, 175, 80, 0.15)",
                  color: "#2E7D32",
                }}
              >
                문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="w-full rounded-full py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A3B5C]/50"
              style={
                formState === "submitting"
                  ? {
                      backgroundColor: "rgba(74, 59, 92, 0.12)",
                      color: "#9B88AC",
                      cursor: "not-allowed",
                    }
                  : {
                      backgroundColor: "#4A3B5C",
                      color: "#F5F0E8",
                      boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
                    }
              }
            >
              {formState === "submitting" ? "보내는 중..." : "문의 보내기 ✦"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-relaxed text-[#4A3B5C]/60">
            빠른 응답이 필요하신 경우 이메일로 직접 문의해주세요.
            <br />
            <Link
              href="mailto:contact@yonghadang.com"
              className="font-medium text-[#4A3B5C] hover:underline"
            >
              contact@yonghadang.com
            </Link>
          </p>
        </section>

        {/* 하단 버튼 */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: "#4A3B5C",
              color: "#F5F0E8",
              boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
            }}
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes authFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
