import { type Metadata } from 'next';
import { HeroSection } from './_components/hero-section';
import { BentoFeatureSection } from './_components/bento-feature-section';
import { ContentSection } from './_components/content-section';

export const metadata: Metadata = {
  title: '용하당 — AI 사주, MBTI, 타로, 점성술',
  description:
    'AI가 분석하는 심층 사주, MBTI, 타로, 점성술 서비스. 당신만의 운명 보고서를 3분 안에 확인하세요.',
  openGraph: {
    title: '용하당 — AI 사주, MBTI, 타로, 점성술',
    description: 'AI가 분석하는 심층 사주, MBTI, 타로, 점성술 서비스.',
  },
};

const HomePage = () => {
  return (
    <>
      {/* 1. 히어로 — 메인 CTA */}
      <HeroSection />

      {/* 2. 핵심 기능 소개 — Bento Grid */}
      <BentoFeatureSection />

      {/* 3. 콘텐츠 그리드 — 카테고리 탭 + 카드 */}
      <ContentSection />
    </>
  );
};

export default HomePage;
