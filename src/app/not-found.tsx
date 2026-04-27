import { type Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요 | 코어로그",
};

/**
 * PRD 5.8 404 페이지.
 * 존재하지 않는 리포트나 잘못된 링크 접근 시.
 */
const NotFoundPage = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0F0420 0%, #1A0B3F 100%)",
      }}
    >
      {/* 배경 장식 */}
      <div
        className="pointer-events-none fixed top-1/4 left-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#6495ED", opacity: 0.1 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-1/3 right-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#A366FF", opacity: 0.12 }}
        aria-hidden="true"
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 max-w-md text-center">
        {/* 에러 코드 */}
        <div className="mb-6">
          <p
            className="text-7xl font-bold"
            style={{
              background: "linear-gradient(135deg, #6495ED 0%, #A366FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </p>
        </div>

        {/* 메시지 */}
        <h1
          className="mb-3 text-2xl font-bold"
          style={{ color: "#F0E6FA" }}
        >
          해당 페이지를 찾을 수 없어요
        </h1>

        {/* 부제 */}
        <p
          className="mb-8 text-sm"
          style={{ color: "#B8A8D8" }}
        >
          존재하지 않는 리포트이거나 링크가 잘못되었을 수 있습니다
        </p>

        {/* 설명 텍스트 */}
        <p
          className="mb-8 text-xs leading-relaxed"
          style={{ color: "#9A8CB0" }}
        >
          요청하신 페이지가 삭제되었거나, <br />
          주소가 잘못되었을 수 있습니다.
        </p>

        {/* CTA 버튼 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #6495ED 0%, #A366FF 100%)",
          }}
        >
          <ArrowLeft size={16} />
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
