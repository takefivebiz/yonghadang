"use client";

import Link from "next/link";

interface CategoryType {
  title: string;
  subtitle: string;
  category: string;
  iconBg: string;
  iconColor: string;
}

const CATEGORY_TYPES: CategoryType[] = [
  {
    title: "연애·결혼",
    subtitle: "마음이 흔들리는 순간",
    category: "love",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-400/80",
  },
  {
    title: "인간관계",
    subtitle: "사람 사이의 거리",
    category: "relationship",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400/80",
  },
  {
    title: "직업·진로",
    subtitle: "선택 앞의 망설임",
    category: "career",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400/80",
  },
  {
    title: "감정",
    subtitle: "설명되지 않는 마음",
    category: "emotion",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400/80",
  },
];

const CategoryIcon = ({
  category,
  className,
}: {
  category: string;
  className?: string;
}) => {
  if (category === "love") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={className}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    );
  }
  if (category === "relationship") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={className}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    );
  }
  if (category === "career") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={className}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
        />
      </svg>
    );
  }
  // emotion: moon
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );
};

const CategoryTypeSection = () => {
  return (
    <section className="mx-auto max-w-xl px-2 mb-16">
      <div className="mb-3 px-2 items-center gap-1.5">
        {/* 카드 그리드 (2열) */}
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_TYPES.map((item) => (
            <Link
              key={item.category}
              href={`#${item.category}`}
              className="group block"
            >
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-2 py-3 transition-all duration-200 group-hover:border-white/15 group-hover:bg-white/[0.06]">
                {/* 아이콘 박스 */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                >
                  <CategoryIcon
                    category={item.category}
                    className={`h-4 w-4 ${item.iconColor}`}
                  />
                </div>

                {/* 텍스트 영역 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-nomal leading-tight text-white/90">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-white/40">
                    {item.subtitle}
                  </p>
                </div>

                {/* 화살표 */}
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-white/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/50 -mr-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryTypeSection;
