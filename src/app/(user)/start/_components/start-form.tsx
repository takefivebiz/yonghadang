"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Content } from "@/types/content";
import { savePendingOrder } from "@/lib/payment";

// ── 타입 정의 ─────────────────────────────────────────────────────────

interface DateGenderForm {
  birthDate: string;
  gender: "남" | "여" | "";
  birthTime: string;
}

interface TarotForm {
  question: string;
  spread: "" | "3-card" | "5-card" | "celtic-cross";
}

type MbtiDimension = "EI" | "NS" | "TF" | "JP";

interface MbtiQuestion {
  id: number;
  dimension: MbtiDimension;
  question: string;
  /** A = E, N, T, J 방향 */
  optionA: string;
  /** B = I, S, F, P 방향 */
  optionB: string;
}

// ── MBTI 검사 문항 (4차원 × 3문항 = 12문항) ──────────────────────────

const MBTI_QUESTIONS: MbtiQuestion[] = [
  // E / I
  {
    id: 1,
    dimension: "EI",
    question: "힘든 하루를 보낸 후, 에너지를 충전하려면?",
    optionA: "친구들과 만나 이야기하며 기운을 낸다",
    optionB: "혼자 조용히 쉬며 회복한다",
  },
  {
    id: 2,
    dimension: "EI",
    question: "처음 만나는 사람들이 많은 자리에서 나는?",
    optionA: "먼저 말을 걸고 적극적으로 어울린다",
    optionB: "상황을 살피며 천천히 가까워진다",
  },
  {
    id: 3,
    dimension: "EI",
    question: "생각을 정리할 때 주로?",
    optionA: "말하면서 자연스럽게 정리된다",
    optionB: "혼자 조용히 생각을 가다듬는다",
  },
  // N / S
  {
    id: 4,
    dimension: "NS",
    question: "새로운 아이디어를 접할 때 나는?",
    optionA: "가능성과 미래 의미를 먼저 떠올린다",
    optionB: "실제로 얼마나 실현 가능한지 따져본다",
  },
  {
    id: 5,
    dimension: "NS",
    question: "어떤 일을 할 때 더 즐거운 편인가?",
    optionA: "큰 그림을 구상하고 새로운 방향을 모색한다",
    optionB: "구체적인 절차를 밟아 착실하게 완성한다",
  },
  {
    id: 6,
    dimension: "NS",
    question: "미래에 대해 생각할 때 나는?",
    optionA: "다양한 가능성과 시나리오를 상상한다",
    optionB: "현실적인 계획과 대비책을 먼저 세운다",
  },
  // T / F
  {
    id: 7,
    dimension: "TF",
    question: "중요한 결정을 내릴 때 나는?",
    optionA: "논리와 객관적 분석을 기준으로 삼는다",
    optionB: "사람들에게 미칠 영향을 먼저 헤아린다",
  },
  {
    id: 8,
    dimension: "TF",
    question: "친구가 힘든 고민을 털어놓으면?",
    optionA: "문제를 해결할 조언을 먼저 건넨다",
    optionB: "충분히 공감하고 위로하는 것이 먼저다",
  },
  {
    id: 9,
    dimension: "TF",
    question: "누군가와 의견이 충돌할 때 나는?",
    optionA: "근거와 논리로 내 입장을 설득한다",
    optionB: "상대의 감정을 이해하며 타협점을 찾는다",
  },
  // J / P
  {
    id: 10,
    dimension: "JP",
    question: "여행이나 약속을 앞두고 나는?",
    optionA: "일정과 동선을 미리 꼼꼼히 계획한다",
    optionB: "큰 틀만 잡고 그때그때 유연하게 움직인다",
  },
  {
    id: 11,
    dimension: "JP",
    question: "마감이 다가올 때 나의 모습은?",
    optionA: "이미 끝내 두었거나 거의 마무리된 상태다",
    optionB: "마감이 가까울수록 집중력이 높아진다",
  },
  {
    id: 12,
    dimension: "JP",
    question: "하루를 보내는 방식이 더 가까운 쪽은?",
    optionA: "계획한 것들을 순서대로 처리하는 편이다",
    optionB: "상황에 따라 자유롭게 흘러가는 편이다",
  },
];

// ── MBTI 결과 계산 ────────────────────────────────────────────────────

/** answers: 각 문항의 선택 ('A' | 'B') */
const calcMbtiResult = (answers: Record<number, "A" | "B">): string => {
  const counts: Record<MbtiDimension, { A: number; B: number }> = {
    EI: { A: 0, B: 0 },
    NS: { A: 0, B: 0 },
    TF: { A: 0, B: 0 },
    JP: { A: 0, B: 0 },
  };

  MBTI_QUESTIONS.forEach((q) => {
    const ans = answers[q.id];
    if (ans) counts[q.dimension][ans]++;
  });

  return [
    counts.EI.A >= counts.EI.B ? "E" : "I",
    counts.NS.A >= counts.NS.B ? "N" : "S",
    counts.TF.A >= counts.TF.B ? "T" : "F",
    counts.JP.A >= counts.JP.B ? "J" : "P",
  ].join("");
};

// ── 공유 스타일 ───────────────────────────────────────────────────────

const inputBase =
  "w-full rounded-xl border px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200";
const inputStyle = {
  borderColor: "rgba(74, 59, 92, 0.2)",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
};

const CATEGORY_LABELS: Record<string, string> = {
  mbti: "MBTI",
  saju: "사주",
  tarot: "타로",
  astrology: "점성술",
};

const SPREAD_OPTIONS = [
  { value: "3-card", label: "3장 스프레드", desc: "과거 · 현재 · 미래" },
  { value: "5-card", label: "5장 스프레드", desc: "상황 · 장애 · 조언 · 결과 · 총평" },
  { value: "celtic-cross", label: "켈틱 크로스", desc: "10장 심층 분석" },
];

// ── 서브 폼: 사주 / 점성술 ────────────────────────────────────────────

const DateGenderFormFields = ({
  data,
  onChange,
}: {
  data: DateGenderForm;
  onChange: (d: DateGenderForm) => void;
}) => (
  <div className="space-y-5">
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground/80">
        생년월일 <span className="text-rose-400">*</span>
      </label>
      <input
        type="date"
        value={data.birthDate}
        onChange={(e) => onChange({ ...data, birthDate: e.target.value })}
        max={new Date().toISOString().split("T")[0]}
        className={inputBase}
        style={inputStyle}
        required
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-foreground/80">
        성별 <span className="text-rose-400">*</span>
      </label>
      <div className="flex gap-3">
        {(["남", "여"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange({ ...data, gender: g })}
            className="flex-1 rounded-xl border py-3 text-sm font-medium transition-all duration-200"
            style={
              data.gender === g
                ? {
                    backgroundColor: "#F5D7E8",
                    borderColor: "rgba(74, 59, 92, 0.25)",
                    color: "#4A3B5C",
                    boxShadow: "0 2px 12px rgba(245, 215, 232, 0.7)",
                  }
                : {
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(74, 59, 92, 0.15)",
                    color: "#9B88AC",
                  }
            }
          >
            {g === "남" ? "남성" : "여성"}
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-foreground/80">
        태어난 시간{" "}
        <span className="text-xs text-muted-foreground">(선택 · 정확도 향상)</span>
      </label>
      <input
        type="time"
        value={data.birthTime}
        onChange={(e) => onChange({ ...data, birthTime: e.target.value })}
        className={inputBase}
        style={inputStyle}
      />
    </div>
  </div>
);

// ── 서브 폼: 타로 ─────────────────────────────────────────────────────

const TarotFormFields = ({
  data,
  onChange,
}: {
  data: TarotForm;
  onChange: (d: TarotForm) => void;
}) => (
  <div className="space-y-5">
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground/80">
        어떤 것이 궁금하신가요?{" "}
        <span className="text-rose-400">*</span>
      </label>
      <textarea
        value={data.question}
        onChange={(e) => onChange({ ...data, question: e.target.value })}
        placeholder="예: 지금 이 선택이 맞는 걸까요? 이 사람은 나를 어떻게 생각하고 있을까요?"
        rows={4}
        maxLength={200}
        className={`${inputBase} resize-none`}
        style={inputStyle}
        required
      />
      <p className="mt-1.5 text-right text-xs text-muted-foreground">
        {data.question.length} / 200
      </p>
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-foreground/80">
        카드 스프레드{" "}
        <span className="text-xs text-muted-foreground">(선택)</span>
      </label>
      <div className="space-y-2">
        {SPREAD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              onChange({ ...data, spread: opt.value as TarotForm["spread"] })
            }
            className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200"
            style={
              data.spread === opt.value
                ? {
                    backgroundColor: "#F5D7E8",
                    borderColor: "rgba(74, 59, 92, 0.25)",
                    color: "#4A3B5C",
                  }
                : {
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(74, 59, 92, 0.15)",
                    color: "#9B88AC",
                  }
            }
          >
            <span className="text-sm font-medium">{opt.label}</span>
            <span className="text-xs opacity-70">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ── MBTI 검사 플로우 ──────────────────────────────────────────────────

type QuizPhase = "intro" | "quiz" | "result";

const MbtiQuiz = ({
  onComplete,
}: {
  onComplete: (mbtiType: string) => void;
}) => {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B">>({});
  const [result, setResult] = useState("");

  const total = MBTI_QUESTIONS.length;
  const question = MBTI_QUESTIONS[current];
  const progress = Math.round((current / total) * 100);

  const handleAnswer = (choice: "A" | "B") => {
    const next = { ...answers, [question.id]: choice };
    setAnswers(next);

    if (current + 1 < total) {
      setCurrent((c) => c + 1);
    } else {
      const mbti = calcMbtiResult(next);
      setResult(mbti);
      setPhase("result");
    }
  };

  // 인트로 화면
  if (phase === "intro") {
    return (
      <div className="space-y-6 text-center">
        <div>
          <p className="font-display mb-1 text-4xl font-bold text-deep-purple">
            MBTI
          </p>
          <p className="text-sm text-muted-foreground">심층 성격 유형 검사</p>
        </div>

        <div
          className="rounded-2xl p-5 text-left text-sm leading-relaxed text-foreground/70"
          style={{
            backgroundColor: "rgba(232, 212, 240, 0.25)",
            border: "1px solid rgba(74, 59, 92, 0.1)",
          }}
        >
          <p className="mb-2 font-medium text-foreground/80">검사 안내</p>
          <ul className="space-y-1.5">
            <li>· 총 12문항 · 약 3분 소요</li>
            <li>· 각 문항에서 자신과 더 가까운 쪽을 선택하세요</li>
            <li>· 정답은 없습니다. 직관적으로 답하세요</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => setPhase("quiz")}
          className="w-full rounded-full py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "#F5D7E8",
            color: "#4A3B5C",
            boxShadow: "0 4px 24px rgba(245, 215, 232, 0.8)",
          }}
        >
          검사 시작하기 ✦
        </button>
      </div>
    );
  }

  // 결과 화면
  if (phase === "result") {
    return (
      <div className="space-y-6 text-center">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">검사 완료!</p>
          <p className="mb-1 text-sm font-medium text-foreground/70">
            당신의 유형은
          </p>
          <p className="font-display text-5xl font-bold text-deep-purple">
            {result}
          </p>
        </div>

        <div
          className="rounded-2xl p-4 text-sm text-foreground/60"
          style={{
            backgroundColor: "rgba(232, 212, 240, 0.25)",
            border: "1px solid rgba(74, 59, 92, 0.1)",
          }}
        >
          AI가 {result} 유형에 맞는 심층 분석 보고서를 생성합니다.
        </div>

        <button
          type="button"
          onClick={() => onComplete(result)}
          className="w-full rounded-full py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "#F5D7E8",
            color: "#4A3B5C",
            boxShadow: "0 4px 24px rgba(245, 215, 232, 0.8)",
          }}
        >
          분석 시작하기 ✦
        </button>

        <button
          type="button"
          onClick={() => {
            setPhase("quiz");
            setCurrent(0);
            setAnswers({});
          }}
          className="w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          다시 검사하기
        </button>
      </div>
    );
  }

  // 문항 화면
  return (
    <div className="space-y-6">
      {/* 진행 바 */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{current + 1} / {total}</span>
          <span>{progress}%</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: "rgba(74, 59, 92, 0.1)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #C4AED8, #F5D7E8)",
            }}
          />
        </div>
      </div>

      {/* 질문 */}
      <p className="text-base font-medium leading-relaxed text-foreground/85">
        {question.question}
      </p>

      {/* 보기 */}
      <div className="space-y-3">
        {(["A", "B"] as const).map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => handleAnswer(choice)}
            className="flex w-full items-start gap-3 rounded-2xl border px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(74,59,92,0.1)]"
            style={{
              backgroundColor: "rgba(255,255,255,0.85)",
              borderColor: "rgba(74, 59, 92, 0.15)",
            }}
          >
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{
                backgroundColor: "rgba(74, 59, 92, 0.08)",
                color: "#9B88AC",
              }}
            >
              {choice}
            </span>
            <span className="text-sm leading-relaxed text-foreground/75">
              {choice === "A" ? question.optionA : question.optionB}
            </span>
          </button>
        ))}
      </div>

      {/* 이전 문항 */}
      {current > 0 && (
        <button
          type="button"
          onClick={() => setCurrent((c) => c - 1)}
          className="w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          이전 문항으로
        </button>
      )}
    </div>
  );
};

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────

interface StartFormProps {
  content: Content;
}

export const StartForm = ({ content }: StartFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mbtiCompleted, setMbtiCompleted] = useState(false);
  const [mbtiResult, setMbtiResult] = useState("");

  const [dateGenderData, setDateGenderData] = useState<DateGenderForm>({
    birthDate: "",
    gender: "",
    birthTime: "",
  });
  const [tarotData, setTarotData] = useState<TarotForm>({
    question: "",
    spread: "",
  });

  const isValid = (): boolean => {
    if (content.category === "saju" || content.category === "astrology") {
      return !!dateGenderData.birthDate && !!dateGenderData.gender;
    }
    if (content.category === "tarot") {
      return tarotData.question.trim().length > 0;
    }
    if (content.category === "mbti") {
      return mbtiCompleted;
    }
    return false;
  };

  /** 입력값을 결제 페이지에서 요약 표시할 수 있도록 sessionStorage 에 저장 */
  const buildInputSummary = (
    overrideMbti?: string,
  ): Array<{ label: string; value: string }> => {
    if (content.category === "saju" || content.category === "astrology") {
      const summary: Array<{ label: string; value: string }> = [
        { label: "생년월일", value: dateGenderData.birthDate },
        { label: "성별", value: dateGenderData.gender === "남" ? "남성" : "여성" },
      ];
      if (dateGenderData.birthTime) {
        summary.push({ label: "태어난 시간", value: dateGenderData.birthTime });
      }
      return summary;
    }
    if (content.category === "tarot") {
      return [
        { label: "질문", value: tarotData.question },
        ...(tarotData.spread
          ? [
              {
                label: "스프레드",
                value:
                  SPREAD_OPTIONS.find((o) => o.value === tarotData.spread)
                    ?.label ?? tarotData.spread,
              },
            ]
          : []),
      ];
    }
    if (content.category === "mbti") {
      return [{ label: "MBTI 유형", value: overrideMbti ?? mbtiResult }];
    }
    return [];
  };

  const handleMbtiComplete = async (type: string) => {
    setMbtiResult(type);
    setMbtiCompleted(true);
    setIsSubmitting(true);

    // 결제 페이지에서 입력 정보 요약 렌더링을 위한 sessionStorage 저장
    savePendingOrder({
      contentSlug: content.slug,
      category: content.category,
      summary: buildInputSummary(type),
    });

    // TODO: [백엔드 연동] createOrder Server Action 호출 후 서버 order-id 를 /payments 로 전달
    router.push(`/payments?content=${content.slug}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid() || isSubmitting) return;
    setIsSubmitting(true);

    savePendingOrder({
      contentSlug: content.slug,
      category: content.category,
      summary: buildInputSummary(),
    });

    // TODO: [백엔드 연동] createOrder Server Action 호출 후 서버 order-id 를 /payments 로 전달
    router.push(`/payments?content=${content.slug}`);
  };

  const isMbti = content.category === "mbti";

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* ── 콘텐츠 헤더 ── */}
      <div
        className="mb-6 overflow-hidden rounded-3xl"
        style={{ border: "1.5px solid rgba(74, 59, 92, 0.1)" }}
      >
        {/* 이미지 영역 */}
        <div
          className="flex items-center justify-center py-10"
          style={{
            background: `linear-gradient(135deg, ${content.gradientFrom}, ${content.gradientTo})`,
          }}
        >
          <span className="text-7xl" role="img" aria-label={content.title}>
            {content.thumbnailEmoji}
          </span>
        </div>

        {/* 콘텐츠 정보 */}
        <div
          className="px-6 py-5"
          style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
        >
          <span
            className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs"
            style={{
              backgroundColor: "rgba(74, 59, 92, 0.07)",
              color: "#9B88AC",
            }}
          >
            {CATEGORY_LABELS[content.category]}
          </span>
          <h1 className="mb-2 text-lg font-bold text-deep-purple">
            {content.title}
          </h1>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {content.description}
          </p>
          <p className="text-base font-bold text-deep-purple">
            {content.price.toLocaleString("ko-KR")}원
          </p>
        </div>
      </div>

      {/* ── 폼 영역 ── */}
      {isMbti ? (
        // MBTI는 별도 검사 플로우 (자체 제출 버튼 포함)
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "rgba(255,255,255,0.7)",
            border: "1.5px solid rgba(74, 59, 92, 0.1)",
            backdropFilter: "blur(8px)",
          }}
        >
          <MbtiQuiz onComplete={handleMbtiComplete} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              border: "1.5px solid rgba(74, 59, 92, 0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <h2 className="mb-5 text-sm font-semibold text-deep-purple">
              정보를 입력해주세요
            </h2>

            {(content.category === "saju" ||
              content.category === "astrology") && (
              <DateGenderFormFields
                data={dateGenderData}
                onChange={setDateGenderData}
              />
            )}
            {content.category === "tarot" && (
              <TarotFormFields data={tarotData} onChange={setTarotData} />
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid() || isSubmitting}
            className="w-full rounded-full py-4 text-sm font-semibold transition-all duration-300"
            style={
              isValid() && !isSubmitting
                ? {
                    backgroundColor: "#F5D7E8",
                    color: "#4A3B5C",
                    boxShadow:
                      "0 4px 28px rgba(245, 215, 232, 0.9), 0 2px 8px rgba(74, 59, 92, 0.1)",
                  }
                : {
                    backgroundColor: "rgba(74, 59, 92, 0.08)",
                    color: "#9B88AC",
                    cursor: "not-allowed",
                  }
            }
          >
            {isSubmitting ? "분석 준비 중..." : "분석 시작하기 ✦"}
          </button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            이 해석은 자기 이해를 돕기 위한 참고 자료이며,
            <br />
            의학적·심리학적 진단을 대체하지 않습니다.
          </p>
        </form>
      )}
    </div>
  );
};
