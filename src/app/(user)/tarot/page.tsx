import { type Metadata } from "next";
import { CategoryPageLayout } from "../_components/category-page-layout";

export const metadata: Metadata = {
  title: "타로 리딩",
  description:
    "78장의 카드가 들려주는 당신의 이야기. AI가 해석하는 심층 타로 리딩.",
};

const TarotPage = () => (
  <CategoryPageLayout
    category="tarot"
    emoji="🃏"
    title="타로 리딩"
    description="78장의 카드가 들려주는 당신의 이야기를 들어보세요. 지금 이 순간의 흐름을 AI가 읽어드립니다."
  />
);

export default TarotPage;
