import { Metadata } from "next";
import { getShareMetadata } from "@/app/actions/share";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ share_id: string }>;
}

export async function generateMetadata({
  params,
}: Omit<LayoutProps, "children">): Promise<Metadata> {
  const { share_id } = await params;
  const metadata = await getShareMetadata(share_id);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL_PRODUCTION || "https://veil.app";

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "website",
      url: `${baseUrl}/share/${share_id}`,
      images: metadata.imageUrl
        ? [
            {
              url: metadata.imageUrl,
              width: 1200,
              height: 630,
              alt: metadata.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: metadata.imageUrl ? [metadata.imageUrl] : [],
    },
  };
}

export default function ShareLayout({ children }: LayoutProps) {
  return children;
}
