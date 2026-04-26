import { type Metadata } from 'next';
import { HeroSection } from './_components/hero-section';
import { EmpathySection } from './_components/empathy-section';
import { TrustSection } from './_components/trust-section';
import { CTASection } from './_components/cta-section';

export const metadata: Metadata = {
  title: 'Corelog — 사람을 읽는 AI 리포트',
  description:
    '사람은 읽힌다. 나도, 저 사람도, 우리 사이도. 3분 안에 무료로 시작하세요.',
  openGraph: {
    title: 'Corelog — 사람을 읽는 AI 리포트',
    description: '선택과 패턴을 통해 사람을 해석합니다. 나의 선택, 상대의 행동, 관계의 구조를 한눈에 파악하세요.',
  },
};

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <EmpathySection />
      <TrustSection />
      <CTASection />
    </>
  );
};

export default HomePage;
