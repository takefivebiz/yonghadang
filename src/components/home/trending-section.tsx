import { Content } from "@/lib/types/content";
import ContentCard from "@/components/home/content-card";

interface TrendingSectionProps {
  contents: Content[];
}

const TrendingSection = ({ contents }: TrendingSectionProps) => {
  return (
    <section className="mb-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-5 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-accent" />
          <h2 className="text-base font-nomal tracking-wider text-highlight">
            지금 많이 보는
          </h2>
        </div>
        <div
          className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10 lg:max-w-[960px] lg:mx-auto"
          data-testid="trending-grid"
        >
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} variant="list" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
