import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CONTENTS } from "@/lib/data/contents"
import ContentIntro from "@/components/content/content-intro"

interface PageProps {
  params: Promise<{ id: string }>
}

// TODO: [백엔드 연동] CONTENTS를 GET /api/contents/[id] 실제 호출로 교체
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params
  const content = CONTENTS.find((c) => c.id === id)
  if (!content) return { title: "VEIL" }

  const plainTitle = content.title.replace(/\n\s*/g, " ").trim()
  return {
    // template "%s | VEIL"이 자동 적용되어 "제목 | VEIL" 형식으로 렌더링됨
    title: plainTitle,
    description: content.subtitle ?? undefined,
    openGraph: {
      title: `${plainTitle} | VEIL`,
      description: content.subtitle ?? undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${plainTitle} | VEIL`,
      description: content.subtitle ?? undefined,
    },
  }
}

// TODO: [백엔드 연동] CONTENTS를 GET /api/contents/[id] 실제 호출로 교체
const ContentPage = async ({ params }: PageProps) => {
  const { id } = await params
  const content = CONTENTS.find((c) => c.id === id)
  if (!content) notFound()

  return <ContentIntro content={content} />
}

export default ContentPage
