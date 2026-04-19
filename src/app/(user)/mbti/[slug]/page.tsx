import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentDetail } from "@/lib/dummy-content-details";
import { ContentDetailPage } from "../../_components/content-detail-page";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const detail = getContentDetail(`mbti-${slug}`);
  if (!detail) return { title: "MBTI 분석" };
  return {
    title: detail.title,
    description: detail.longDescription,
    openGraph: { title: detail.title, description: detail.longDescription },
  };
};

const MbtiDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const detail = getContentDetail(`mbti-${slug}`);
  // is_active === false이면 비공개 콘텐츠 — 404 처리
  if (!detail || detail.is_active === false) notFound();
  return <ContentDetailPage detail={detail} />;
};

export default MbtiDetailPage;
