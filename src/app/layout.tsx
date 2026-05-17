import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ViewportMeta } from "@/components/layout/viewport-meta";
import "./globals.css";

/**
 * Root Layout: html/body 래퍼 + SEO 메타데이터 + GA4
 * 하위 레이아웃: (user)/layout.tsx (Navbar/Footer), (admin)/layout.tsx (사이드바)
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    template: "%s | VEIL",
    default: "VEIL | 지금 너에게 가장 필요한 말",
  },
  description:
    "연애, 결혼, 인간관계, 직업, 진로, 감정까지. VEIL은 다양한 고민을 듣고 정확하게 해석해주는 맞춤 해석 서비스입니다.",
  keywords: [
    "연애 고민",
    "관계 고민",
    "상대 심리",
    "인간관계",
    "진로 고민",
    "감정 해석",
    "연애 상담",
    "짝사랑 고민",
    "직장 고민",
    "감정 분석",
    "마음 읽기",
    "VEIL",
  ],
  openGraph: {
    title: "VEIL | 지금 너에게 가장 필요한 말",
    description:
      "연애, 결혼, 인간관계, 직업, 진로, 감정까지. VEIL은 다양한 고민을 듣고 정확하게 해석해주는 맞춤 해석 서비스입니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://veil-veil.vercel.app",
    siteName: "VEIL",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEIL | 지금 너에게 가장 필요한 말",
    description:
      "연애, 결혼, 인간관계, 직업, 진로, 감정까지. VEIL은 다양한 고민을 듣고 정확하게 해석해주는 맞춤 해석 서비스입니다.",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <body>
        <ViewportMeta />
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
  );
};

export default RootLayout;
