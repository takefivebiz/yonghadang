"use client"

interface GuestVerifyModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * 비회원 조회 모달 - 전화번호 + PIN 입력 후 기존 결과 조회
 * TODO: [백엔드 연동] POST /api/guest/verify 호출 후 /result/[session_id] 리다이렉트 구현
 */
const GuestVerifyModal = ({ isOpen, onClose }: GuestVerifyModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 딤드 배경 */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* TODO: 비회원 조회 모달 UI 구현 (PRD 5.2 비회원 조회 모달 참고) */}
    </div>
  )
}

export default GuestVerifyModal
