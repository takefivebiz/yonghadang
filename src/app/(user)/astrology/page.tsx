import { type Metadata } from "next";
import { CategoryPageLayout } from "../_components/category-page-layout";

export const metadata: Metadata = {
  title: "점성술 분석",
  description:
    "태어난 순간의 별자리 배치로 읽는 당신의 운명. AI가 분석하는 출생 차트 보고서.",
};

const AstrologyPage = () => (
  <CategoryPageLayout
    category="astrology"
    emoji="⭐"
    title="점성술 분석"
    description="태어난 순간의 별자리 배치로 읽는 당신의 운명. 행성과 별자리가 새기는 나만의 운명 지도."
  />
);

export default AstrologyPage;
