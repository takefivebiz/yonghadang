import { Content } from "@/lib/types/content"
import ContentCard from "@/components/home/content-card"

interface TrendingSectionProps {
  contents: Content[]
}

const TrendingSection = ({ contents }: TrendingSectionProps) => {
  return (
    <section className="mb-10 px-4">
      <div className="mb-5 flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-accent" />
        <h2 className="text-base font-bold text-highlight">지금 많이 보는</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {contents.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    </section>
  )
}

export default TrendingSection
