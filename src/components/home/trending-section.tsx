import { PublicContent } from "@/lib/types/content";
import ContentCard from "@/components/home/content-card";

interface TrendingSectionProps {
  contents: PublicContent[];
}

const TrendingSection = ({ contents }: TrendingSectionProps) => {
  // API 실패로 빈 배열이 오면 섹션 자체를 숨긴다
  if (contents.length === 0) return null;

  return (
    <section className="mx-auto max-w-xl px-2 mb-10">
      <div className="mb-3 px-2 flex items-center gap-1.5">
        <span className="h-3 w-1 rounded-full bg-highlight/40" />
        <h2 className="text-sm font-nomal tracking-wider text-highlight">
          지금 많이 보는 케이스
        </h2>
      </div>
      <div className="px-2">
        <div
          className="grid grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] gap-x-2 gap-y-4 lg:w-[88%] lg:gap-x-3 lg:gap-y-6"
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
