/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";

const Footer = () => {
  const [openModal, setOpenModal] = useState<
    "terms" | "privacy" | "contact" | null
  >(null);

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

  return (
    <>
      <footer className="border-t border-surface bg-background py-10 text-center">
        <div className="mx-auto max-w-screen-lg px-4">
          {/* 사업자 정보 */}
          {/* TODO: 실제 사업자 등록 정보로 교체 */}
          <div className="mb-6 space-y-1 text-xs text-highlight/40">
            <p>VEIL | 대표자: 홍길동</p>
            <p>사업자등록번호 : 00-00-00000</p>
            <p>통신판매업신고: 제2026-서울-0000호</p>
            <p>서울특별시 땡땡구 땡땡동 땡떙로 77</p>
          </div>

          {/* 링크 */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-highlight/40">
            <button
              onClick={() => setOpenModal("terms")}
              className="transition-colors hover:text-highlight/70"
            >
              이용약관
            </button>
            <button
              onClick={() => setOpenModal("privacy")}
              className="transition-colors hover:text-highlight/70"
            >
              개인정보처리방침
            </button>
            <button
              onClick={() => setOpenModal("contact")}
              className="transition-colors hover:text-highlight/70"
            >
              문의하기
            </button>
          </div>

          <p className="mt-6 text-xs text-highlight/20">
            © 2026 VEIL. All rights reserved.
          </p>
        </div>
      </footer>

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

      {/* 문의하기 모달 */}
      {openModal === "contact" && (
        <Modal
          isOpen={openModal === "contact"}
          onClose={() => setOpenModal(null)}
          title="문의하기"
          content={<ContactContent />}
        />
      )}
    </>
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
      data-testid="modal-overlay"
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
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

const TermsContent = () => (
  <div className="space-y-4 text-xs leading-relaxed text-highlight/70">
    <section className="space-y-2 border-b border-surface/20 pb-4">
      <p className="text-sm text-highlight">여러분을 환영합니다.</p>
      <p>
        VEIL(이하 &quot;서비스&quot;)을 이용해 주셔서 감사합니다.
        본 약관은 VEIL(이하 &quot;회사&quot;)이 제공하는 서비스의 이용과 관련하여 회사와
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
            "회원"이란 회사의 서비스에 접속하여 본 약관에 따라 이용계약을 체결하고
            서비스를 이용하는 자를 의미합니다.
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
      <h3 className="font-semibold text-highlight">제2조 (약관의 효력 및 변경)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>본 약관은 서비스 화면 또는 기타 방법을 통해 공지함으로써 효력이 발생합니다.</li>
        <li>회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
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
          서비스 이용계약은 이용자가 본 약관에 동의하고 서비스를 이용하거나 회원가입을
          완료한 시점에 성립합니다.
        </li>
        <li>회사는 특별한 사정이 없는 한 회원가입 신청을 승인합니다.</li>
        <li>다만 다음의 경우 회원가입 또는 서비스 이용을 제한하거나 거부할 수 있습니다.</li>
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
      <h3 className="font-semibold text-highlight">제4조 (개인정보의 수집 및 보호)</h3>
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
        <li>이용자는 언제든지 개인정보 수집 및 이용 동의를 철회할 수 있습니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제5조 (서비스의 제공)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>회사는 연중무휴 24시간 서비스 제공을 위해 노력합니다.</li>
        <li>
          다만 시스템 점검, 유지보수, 장애 또는 기타 불가피한 사유로 서비스가 일시
          중단될 수 있습니다.
        </li>
        <li>회사는 서비스 품질 향상을 위해 서비스의 일부 또는 전부를 변경하거나 종료할 수 있습니다.</li>
        <li>서비스의 중대한 변경 또는 종료가 발생하는 경우 사전에 공지합니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제6조 (콘텐츠 및 저작권)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>서비스 및 결과물에 대한 저작권과 지식재산권은 회사에 귀속됩니다.</li>
        <li>
          이용자는 회사의 사전 동의 없이 결과물을 복제, 배포, 수정, 판매 또는
          상업적으로 이용할 수 없습니다.
        </li>
        <li>
          이용자가 서비스 이용 과정에서 직접 입력한 콘텐츠에 대한 권리는 원칙적으로
          이용자에게 있습니다.
        </li>
        <li>
          회사는 서비스 운영, 개선 및 품질 향상을 위해 이용자가 입력한 데이터를
          활용할 수 있습니다.
        </li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제7조 (AI 생성 결과물의 특성 및 한계)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>서비스는 생성형 인공지능(AI)을 기반으로 결과물을 제공합니다.</li>
        <li>
          결과물은 참고 및 콘텐츠 이용 목적의 정보이며, 객관적 사실이나 전문적
          판단을 대체하지 않습니다.
        </li>
        <li>
          동일한 입력이라도 생성 시점 및 AI 모델 특성에 따라 결과가 달라질 수
          있습니다.
        </li>
        <li>회사는 결과물의 완전성, 정확성, 신뢰성에 대해 보장하지 않습니다.</li>
        <li>
          이용자가 결과물을 바탕으로 내린 판단이나 행동에 대한 책임은 이용자 본인에게
          있습니다.
        </li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제8조 (유료서비스 및 환불)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>유료서비스는 결제 완료 후 이용할 수 있습니다.</li>
        <li>
          서비스 오류 또는 회사 사정으로 정상적인 결과 제공이 어려운 경우 회사는
          재제공 또는 대체 제공을 진행합니다.
        </li>
        <li>
          재제공 또는 대체 제공이 불가능한 경우 관련 법령에 따라 환불이 진행될 수
          있습니다.
        </li>
        <li>
          이용자가 결과물을 이미 열람하거나 이용한 경우 환불이 제한될 수 있습니다.
        </li>
        <li>인앱 결제의 경우 각 앱 마켓 정책에 따라 환불이 진행됩니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제9조 (회사의 의무)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>회사는 안정적인 서비스 제공을 위해 노력합니다.</li>
        <li>회사는 이용자의 개인정보를 보호하기 위해 관련 법령을 준수합니다.</li>
        <li>회사는 이용자의 의견이나 문의가 정당하다고 판단되는 경우 이를 신속하게 처리합니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제10조 (이용자의 의무)</h3>
      <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
      <ul className="space-y-1 pl-4">
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>타인의 정보 도용</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>불법 목적의 서비스 이용</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>회사 서비스 운영 방해</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>결과물의 무단 복제 및 상업적 이용</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>자동화 수단을 통한 비정상적 접근</span>
        </li>
        <li className="flex gap-2">
          <span className="text-highlight/40">•</span>
          <span>관련 법령 및 본 약관 위반 행위</span>
        </li>
      </ul>
      <p>
        이용자가 본 조항을 위반할 경우 회사는 서비스 이용 제한 또는 회원 자격 제한
        조치를 취할 수 있습니다.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제11조 (서비스 이용 제한)</h3>
      <p>
        회사는 이용자가 본 약관 또는 관련 법령을 위반하는 경우 사전 통지 없이
        서비스 이용을 제한하거나 회원 자격을 박탈할 수 있습니다.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제12조 (면책)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>
          회사는 천재지변, 시스템 장애, 불가항력 등 회사의 책임 없는 사유로 발생한
          손해에 대해 책임을 지지 않습니다.
        </li>
        <li>회사는 무료서비스 이용 과정에서 발생한 손해에 대해 책임을 지지 않습니다.</li>
        <li>
          회사는 결과물의 정확성, 신뢰성 및 이용자가 이를 기반으로 내린 판단에
          대해 책임을 지지 않습니다.
        </li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제13조 (회원 탈퇴 및 계약 종료)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>이용자는 언제든지 회원 탈퇴를 요청할 수 있습니다.</li>
        <li>
          회원 탈퇴 시 관련 법령 및 개인정보처리방침에 따라 필요한 정보를 제외한
          개인정보는 삭제됩니다.
        </li>
        <li>회사는 서비스 종료 시 사전에 관련 내용을 공지합니다.</li>
      </ol>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">제14조 (준거법 및 관할법원)</h3>
      <ol className="space-y-1 pl-4 list-decimal">
        <li>본 약관은 대한민국 법률에 따라 해석 및 적용됩니다.</li>
        <li>
          서비스 이용과 관련하여 발생한 분쟁은 관련 법령에 따른 관할 법원을 전속
          관할로 합니다.
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
        VEIL(이하 "회사")은 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
      </p>
      <p>
        본 개인정보처리방침은 회사가 어떤 정보를 수집하고, 어떻게 이용 및 보호하는지 안내하기 위한 내용입니다.
      </p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">1. 개인정보의 수집 및 이용 목적</h3>
      <p>회사는 다음 목적을 위해 개인정보를 수집 및 이용합니다.</p>

      <div className="space-y-2.5 pl-4">
        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">회원가입 및 서비스 이용</p>
          <div className="text-xs text-highlight/65 space-y-1 mt-1 pl-2">
            <p>수집 항목: 소셜 로그인 정보, 이메일, 닉네임</p>
            <p>이용 목적: 회원 식별, 서비스 제공, 기록 저장 및 다시보기</p>
            <p>보유 기간: 회원 탈퇴 또는 서비스 이용 종료 시까지</p>
          </div>
        </div>

        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">비회원 서비스 이용</p>
          <div className="text-xs text-highlight/65 space-y-1 mt-1 pl-2">
            <p>수집 항목: 휴대전화 번호, 비밀번호(4자리)</p>
            <p>이용 목적: 비회원 결과 조회, 결과 다시 확인</p>
            <p>보유 기간: 결과 보관 기간 종료 시까지</p>
          </div>
        </div>

        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">문의 및 고객 응대</p>
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
      <h3 className="font-semibold text-highlight">2. 개인정보의 보유 및 이용 기간</h3>
      <p>회사는 개인정보 수집 및 이용 목적이 달성된 후 지체 없이 개인정보를 삭제합니다.</p>
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
      <p>회사는 원활한 서비스 제공을 위해 일부 업무를 외부 업체에 위탁할 수 있습니다.</p>

      <div className="space-y-1.5 pl-4">
        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">결제 처리</p>
          <p className="text-xs text-highlight/65 mt-1">수탁 업체: 결제대행사(PG사) | 위탁 업무: 결제 처리 및 환불 지원</p>
        </div>

        <div className="rounded-lg border border-surface/20 bg-surface/5 p-2">
          <p className="font-medium text-highlight text-xs">서비스 분석</p>
          <p className="text-xs text-highlight/65 mt-1">수탁 업체: Google Analytics | 위탁 업무: 서비스 이용 통계 및 분석</p>
        </div>
      </div>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">5. 이용자의 권리</h3>
      <p>이용자는 언제든지 자신의 개인정보에 대해 다음 권리를 행사할 수 있습니다:</p>
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
      <p>회사는 개인정보 보유 기간이 종료되거나 처리 목적이 달성된 경우 지체 없이 개인정보를 삭제합니다.</p>
      <p>전자적 파일은 복구가 불가능한 방식으로 삭제되며, 출력물은 분쇄 또는 소각 처리됩니다.</p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">7. 개인정보 보호를 위한 조치</h3>
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
      <p>서비스 품질 개선 및 안정적인 운영을 위해 이용자가 입력한 일부 데이터가 비식별화된 형태로 분석 및 활용될 수 있습니다.</p>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">9. 개인정보 보호책임자</h3>
      <p>회사는 개인정보 보호 및 관련 문의 대응을 위해 다음과 같이 개인정보 보호책임자를 지정합니다.</p>
      <div className="rounded-lg border border-surface/20 bg-surface/5 p-2.5">
        <p className="text-xs text-highlight/65">이메일: support@veil.xxx</p>
      </div>
    </section>

    <section className="space-y-2">
      <h3 className="font-semibold text-highlight">10. 개인정보처리방침의 변경</h3>
      <p>본 개인정보처리방침은 관련 법령 또는 서비스 변경에 따라 수정될 수 있습니다.</p>
      <p>변경 사항은 서비스 내 공지사항 또는 화면을 통해 안내합니다.</p>
    </section>

    <section className="space-y-2 border-t border-surface/20 pt-4">
      <p className="font-semibold text-highlight">시행일자</p>
      <p>2026년 5월 8일</p>
    </section>
  </div>
);

const ContactContent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "결과는 왜 매번 조금씩 달라질 수 있나요?",
      answer:
        "VEIL은 생성형 AI를 기반으로 결과를 제공하고 있습니다. 같은 내용이라도 표현이나 흐름이 조금씩 달라질 수 있습니다.",
    },
    {
      question: "이전 결과는 어디에서 다시 볼 수 있나요?",
      answer:
        "로그인한 경우 마이페이지의 지난 기록에서 다시 확인할 수 있습니다. 비회원 이용자는 입력했던 정보로 다시 조회할 수 있습니다.",
    },
    {
      question: "비회원으로도 이용할 수 있나요?",
      answer: "가능합니다. 일부 기능은 비회원 상태에서도 이용할 수 있습니다.",
    },
    {
      question: "결제한 결과가 보이지 않아요.",
      answer:
        "일시적인 네트워크 문제일 수 있습니다. 잠시 후 다시 확인하거나, 동일한 계정으로 로그인되어 있는지 확인해 주세요.",
    },
    {
      question: "환불은 어떻게 진행되나요?",
      answer:
        "디지털 콘텐츠 특성상 결과를 이미 열람한 경우에는 환불이 제한될 수 있습니다.\n\n다만, 결제 오류, 서비스 장애, 정상적으로 결과를 확인할 수 없는 경우에는 확인 후 환불을 도와드리고 있습니다.\n\n문의하기를 통해 접수해 주세요.",
    },
    {
      question: "결과는 실제 상담이나 전문적인 판단을 대신하나요?",
      answer:
        "아닙니다. VEIL의 결과는 참고 및 콘텐츠 이용 목적의 해석입니다. 중요한 결정은 스스로의 판단과 함께 신중하게 진행해 주세요.",
    },
    {
      question: "문의는 어디로 보내면 되나요?",
      answer: "아래 이메일로 문의하실 수 있습니다.\nsupport@veil.xxx",
    },
  ];

  return (
    <div className="space-y-6 text-xs text-highlight/70">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 text-highlight"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-highlight">자주 묻는 질문</h3>
      </div>

      {/* 아코디언 */}
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="group border border-surface/20 rounded-lg overflow-hidden transition-all hover:border-highlight/20"
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full flex items-start justify-between gap-3 px-4 py-3.5 hover:bg-highlight/3 transition-colors"
            >
              <span className="text-left font-medium text-highlight text-xs leading-snug">
                {faq.question}
              </span>
              <span
                className={`shrink-0 text-highlight/40 mt-0.5 transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {openIndex === index && (
              <div className="px-4 py-3.5 bg-highlight/3 border-t border-surface/20 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-highlight/65 whitespace-pre-wrap leading-relaxed text-xs">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 이메일 문의 */}
      <div className="space-y-3 pt-4 border-t border-surface/20 text-center">
        <p className="font-medium text-highlight text-xs">더 궁금하신 점이 있으신가요?</p>
        <a
          href="mailto:support@veil.xxx"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-highlight/20 bg-highlight/5 px-4 py-2.5 text-xs font-medium text-highlight hover:border-highlight/40 hover:bg-highlight/10 transition-all"
        >
          <span>✉️</span>
          <span>support@veil.xxx</span>
        </a>
      </div>
    </div>
  );
};

export default Footer;
