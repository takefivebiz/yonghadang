import { type Metadata } from "next";
import { CategoryPageLayout } from "../_components/category-page-layout";

export const metadata: Metadata = {
  title: "AI 사주 분석",
  description:
    "오행과 천간지지의 원리로 삶의 흐름을 분석합니다. AI가 풀이하는 정밀 사주 보고서.",
};

const SajuPage = () => (
  <CategoryPageLayout
    category="saju"
    emoji="☯️"
    title="AI 사주 분석"
    description="오행과 천간지지의 원리로 삶의 흐름을 분석합니다. 생년월일로 읽는 나만의 운명 지도."
  />
);

export default SajuPage;
