import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DUMMY_CONTENTS } from "@/lib/data/dummy-contents"
import ContentIntro from "@/components/content/content-intro"

interface PageProps {
  params: Promise<{ id: string }>
}

// TODO: [백엔드 연동] DUMMY_CONTENTS를 GET /api/contents/[id] 실제 호출로 교체
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params
  const content = DUMMY_CONTENTS.find((c) => c.id === id)
  if (!content) return { title: "VEIL" }

  const plainTitle = content.title.replace(/\n\s*/g, " ")
  return {
    title: `${plainTitle} — VEIL`,
    description: content.subtitle,
  }
}

// TODO: [백엔드 연동] DUMMY_CONTENTS를 GET /api/contents/[id] 실제 호출로 교체
const ContentPage = async ({ params }: PageProps) => {
  const { id } = await params
  const content = DUMMY_CONTENTS.find((c) => c.id === id)
  if (!content) notFound()

  return <ContentIntro content={content} />
}

export default ContentPage
