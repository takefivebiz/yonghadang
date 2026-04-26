import { type Metadata } from "next";
import { Suspense } from "react";
import { ContactClient } from "./_components/contact-client";

export const metadata: Metadata = {
  title: "문의하기 — 코어로그",
  description: "자주하는 질문을 확인하고 문의사항을 보내세요.",
  openGraph: {
    title: "문의하기 — 코어로그",
    description: "자주하는 질문을 확인하고 문의사항을 보내세요.",
  },
  robots: { index: true, follow: true },
};

/**
 * PRD 6-12.3 문의하기 페이지 (/contact)
 * - FAQ 아코디언
 * - 문의 폼
 */
const ContactPage = () => {
  return (
    <Suspense fallback={null}>
      <ContactClient />
    </Suspense>
  );
};

export default ContactPage;
