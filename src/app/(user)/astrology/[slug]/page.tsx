import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentDetail } from "@/lib/dummy-content-details";
import { ContentDetailPage } from "../../_components/content-detail-page";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const detail = getContentDetail(`astrology-${slug}`);
  if (!detail) return { title: "점성술 분석" };
  return {
    title: detail.title,
    description: detail.longDescription,
    openGraph: { title: detail.title, description: detail.longDescription },
  };
};

const AstrologyDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const detail = getContentDetail(`astrology-${slug}`);
  if (!detail || detail.is_active === false) notFound();
  return <ContentDetailPage detail={detail} />;
};

export default AstrologyDetailPage;
