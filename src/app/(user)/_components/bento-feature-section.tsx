/**
 * 서비스 핵심 기능을 Bento Grid 레이아웃으로 소개하는 섹션 (파스텔 테마)
 */

const CATEGORY_ITEMS = [
  { emoji: '🧠', label: 'MBTI' },
  { emoji: '☯️', label: '사주' },
  { emoji: '🃏', label: '타로' },
  { emoji: '⭐', label: '점성술' },
];

export const BentoFeatureSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      {/* 섹션 헤더 */}
      <div className="mb-12 text-center">
        <p className="font-display mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Why 용하당
        </p>
        <h2 className="font-display text-3xl font-bold text-deep-purple md:text-4xl">
          단순한 점술을 넘어서
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2">

        {/* ── Cell A: AI 심층 분석 (2×2 대형 카드) ── */}
        <div
          className="relative overflow-hidden rounded-3xl border p-8 sm:col-span-2 md:col-span-2 md:row-span-2"
          style={{
            background: 'linear-gradient(135deg, #EDE0F8 0%, #F5EBF8 50%, #F5D7E8 100%)',
            borderColor: 'rgba(74, 59, 92, 0.1)',
          }}
        >
          {/* 배경 글로우 */}
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-2xl"
            style={{ backgroundColor: '#E8D4F0', opacity: 0.6 }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 text-5xl">🤖</div>
              <h3 className="font-display mb-3 text-2xl font-bold leading-tight text-deep-purple md:text-3xl">
                AI 심층 분석
              </h3>
              <p className="mb-6 leading-relaxed text-foreground/70">
                단순한 점술이 아닙니다.
                <br />
                수백만 건의 데이터로 학습한 AI가 당신만의 패턴과 운명의 흐름을 정밀하게 읽어냅니다.
              </p>
            </div>

            {/* 분석 유형 태그 */}
            <div className="flex flex-wrap gap-2">
              {['MBTI', '사주', '타로', '점성술'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(74, 59, 92, 0.08)',
                    color: '#4A3B5C',
                    border: '1px solid rgba(74, 59, 92, 0.15)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Cell B: 4가지 전문 분야 ── */}
        <div
          className="overflow-hidden rounded-3xl border p-6"
          style={{
            background: 'linear-gradient(135deg, #F5F0FF 0%, #EDE0F8 100%)',
            borderColor: 'rgba(74, 59, 92, 0.1)',
          }}
        >
          <div className="mb-1 text-3xl">✨</div>
          <h3 className="font-display mb-2 text-lg font-bold text-deep-purple">4가지 전문 분야</h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {CATEGORY_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ backgroundColor: 'rgba(74, 59, 92, 0.06)' }}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-medium text-deep-purple">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cell C: 3분 완성 ── */}
        <div
          className="overflow-hidden rounded-3xl border p-6"
          style={{
            background: 'linear-gradient(135deg, #FFF8EE 0%, #F8ECD8 100%)',
            borderColor: 'rgba(74, 59, 92, 0.1)',
          }}
        >
          <div className="mb-1 text-3xl">⚡</div>
          <h3 className="font-display mb-2 text-lg font-bold text-deep-purple">3분 완성</h3>
          <p className="text-sm leading-relaxed text-foreground/65">
            입력 후 단 3분 안에 보고서 완성. 기다림 없이 바로 확인하세요.
          </p>
          <p className="mt-4 text-3xl font-bold" style={{ color: '#D4A5A5' }}>3 min</p>
        </div>

        {/* ── Cell D: 프리미엄 보고서 ── */}
        <div
          className="overflow-hidden rounded-3xl border p-6"
          style={{
            background: 'linear-gradient(135deg, #FFF0F8 0%, #F5D7E8 100%)',
            borderColor: 'rgba(74, 59, 92, 0.1)',
          }}
        >
          <div className="mb-1 text-3xl">📋</div>
          <h3 className="font-display mb-2 text-lg font-bold text-deep-purple">상세 보고서</h3>
          <p className="text-sm leading-relaxed text-foreground/65">
            10페이지 이상의 심층 분석 리포트. 두고두고 읽고 싶은 나의 이야기.
          </p>
        </div>

        {/* ── Cell E: SNS 공유 ── */}
        <div
          className="overflow-hidden rounded-3xl border p-6"
          style={{
            background: 'linear-gradient(135deg, #F0EEFF 0%, #E8D4F0 100%)',
            borderColor: 'rgba(74, 59, 92, 0.1)',
          }}
        >
          <div className="mb-1 text-3xl">🔗</div>
          <h3 className="font-display mb-2 text-lg font-bold text-deep-purple">SNS 공유</h3>
          <p className="text-sm leading-relaxed text-foreground/65">
            결과 링크로 친구에게 바로 공유. 카카오톡, 인스타그램 지원.
          </p>
        </div>
      </div>
    </section>
  );
};
