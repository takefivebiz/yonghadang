import { Content } from "@/lib/types/content";
import ContentCard from "@/components/home/content-card";

interface TrendingSectionProps {
  contents: Content[];
}

const TrendingSection = ({ contents }: TrendingSectionProps) => {
  // API 실패로 빈 배열이 오면 섹션 자체를 숨긴다
  if (contents.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mx-auto max-w-xl px-4">
        <div className="mb-5 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-accent" />
          <h2 className="text-base font-nomal tracking-wider text-highlight">
            지금 많이 보는
          </h2>
        </div>
        <div
          className="grid grid-cols-2 gap-x-3 gap-y-4 lg:gap-x-4 lg:gap-y-6 lg:max-w-[600px] lg:mx-auto"
          data-testid="trending-grid"
        >
          {contents.map((content, index) => (
            <ContentCard
              key={content.id}
              content={content}
              variant="trending"
              priority={index < 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
