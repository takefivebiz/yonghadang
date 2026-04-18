import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentDetail } from "@/lib/dummy-content-details";
import { ContentDetailPage } from "../../_components/content-detail-page";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const detail = getContentDetail(`tarot-${slug}`);
  if (!detail) return { title: "타로 리딩" };
  return {
    title: detail.title,
    description: detail.longDescription,
    openGraph: { title: detail.title, description: detail.longDescription },
  };
};

const TarotDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const detail = getContentDetail(`tarot-${slug}`);
  if (!detail) notFound();
  return <ContentDetailPage detail={detail} />;
};

export default TarotDetailPage;
