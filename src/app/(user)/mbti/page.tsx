import { type Metadata } from "next";
import { CategoryPageLayout } from "../_components/category-page-layout";

export const metadata: Metadata = {
  title: "MBTI 심층 분석",
  description:
    "16가지 성격 유형으로 당신의 진짜 모습을 발견하세요. AI가 분석하는 심층 MBTI 보고서.",
};

const MbtiPage = () => (
  <CategoryPageLayout
    category="mbti"
    emoji="🧠"
    title="MBTI 심층 분석"
    description="16가지 성격 유형으로 당신의 진짜 모습을 발견하세요. AI가 분석하는 심층 성격 보고서."
  />
);

export default MbtiPage;
