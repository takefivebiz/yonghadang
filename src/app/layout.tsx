import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

/**
 * Root Layout: html/body 래퍼 + SEO 메타데이터 + GA4
 * 하위 레이아웃: (user)/layout.tsx (Navbar/Footer), (admin)/layout.tsx (사이드바)
 */
export const metadata: Metadata = {
  title: {
    template: "%s | VEIL",
    default: "VEIL — 베일에 가려진 진짜 나",
  },
  description:
    "콘텐츠와 간단한 입력을 통해 현재 상황, 감정, 관계를 해석하는 AI 자기 해석 서비스",
  openGraph: {
    title: "VEIL — 베일에 가려진 진짜 나",
    description:
      "콘텐츠와 간단한 입력을 통해 현재 상황, 감정, 관계를 해석하는 AI 자기 해석 서비스",
    type: "website",
    locale: "ko_KR",
    // TODO: [배포 연동] 실제 서비스 URL로 교체
    url: "https://veil.app",
    siteName: "VEIL",
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <body>
        {children}
        {/* TODO: [GA4 연동] NEXT_PUBLIC_GA_ID 환경변수 설정 후 자동 활성화 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}

export default RootLayout
