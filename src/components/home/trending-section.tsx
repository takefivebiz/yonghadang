import { PublicContent } from "@/lib/types/content";
import ContentCard from "@/components/home/content-card";

interface TrendingSectionProps {
  contents: PublicContent[];
}

const TrendingSection = ({ contents }: TrendingSectionProps) => {
  // API 실패로 빈 배열이 오면 섹션 자체를 숨긴다
  if (contents.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mx-auto max-w-xl px-5">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-3 w-1 rounded-full bg-accent" />
          <h2 className="text-sm font-nomal tracking-wider text-highlight">
            지금 많이 보는 케이스
          </h2>
        </div>
        <div
          className="grid grid-cols-2 gap-x-2 gap-y-4 lg:gap-x-2 lg:gap-y-6 lg:max-w-[600px] lg:mx-auto"
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
