"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TypeAInput from "@/components/analyze/type-a-input";
import CorrectionQuestions from "@/components/analyze/correction-questions";
import ReactionBubble from "@/components/analyze/reaction-bubble";
import { getInputConfig } from "@/lib/data/dummy-analyze-config";
import { AnalyzeState, Answer, AnalyzeAnswers } from "@/lib/types/analyze";

interface PageProps {
  params: Promise<{ session_id: string }>;
}

type Stage =
  | "free_input"
  | "reaction_after_free"
  | "correction_questions"
  | "completing";

const AnalyzePage = ({ params }: PageProps) => {
  const router = useRouter();
  const [session_id, setSessionId] = useState<string>("mock-session-001");

  useEffect(() => {
    params.then((resolved) => {
      setSessionId(resolved.session_id);
    });
  }, [params]);

  const [stage, setStage] = useState<Stage>("free_input");
  const [analyzeData, setAnalyzeData] = useState<AnalyzeState>({
    session_id,
    content_id: "love-1",
    stage: "free_input",
    free_input: "",
    answers: [],
  });

  const config = getInputConfig(analyzeData.content_id);

  // 자유입력 → reaction_after_free
  const handleFreeInputSubmit = (input: string) => {
    setAnalyzeData((prev) => ({
      ...prev,
      free_input: input,
      stage: "free_input",
    }));
    setStage("reaction_after_free");
  };

  // reaction_after_free → correction_questions
  const handleReactionAfterFreeComplete = () => {
    setStage("correction_questions");
  };

  // correction_questions 완료 → completing
  const handleCorrectionSubmit = (answers: Answer[]) => {
    const finalData: AnalyzeAnswers = {
      session_id: analyzeData.session_id,
      content_id: analyzeData.content_id,
      free_input: analyzeData.free_input,
      answers,
      created_at: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(
        `veil_analysis_${analyzeData.session_id}`,
        JSON.stringify(finalData),
      );
    }

    setAnalyzeData((prev) => ({
      ...prev,
      answers,
    }));
    setStage("completing");

    // 완료 메시지 표시 후 이동
    setTimeout(() => {
      router.push(`/result/${analyzeData.session_id}`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 완료 화면 */}
      {stage === "completing" && (
        <div className="flex min-h-screen flex-col items-center justify-start pt-40 px-4">
          {/* 체크 아이콘 */}
          <div
            className="mb-8 flex items-center justify-center"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "2px solid rgba(209, 109, 172, 0.6)",
              animation: "scaleIn 500ms ease-out",
            }}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="rgba(209, 109, 172, 0.8)"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* 메인 텍스트 */}
          <h1
            className="text-2xl sm:text-3xl font-normal text-center mb-6"
            style={{ color: "rgba(249, 249, 229, 0.85)" }}
          >
            모든 질문이 끝났어.
          </h1>

          <p
            className="text-sm text-center mb-12 leading-relaxed"
            style={{ color: "rgba(249, 249, 229, 0.5)" }}
          >
            네 이야기를 바탕으로
            <br />
            흐름을 정리하고 있어.
          </p>

          {/* 로딩 닷 */}
          <div className="mb-12 flex flex-col items-center gap-6">
            <div
              className="flex gap-2 justify-center items-end"
              style={{ height: "24px" }}
            >
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: "rgba(209, 109, 172, 0.6)",
                    animation: `dotBounce 1.2s infinite ease-in-out`,
                    animationDelay: `${idx * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* 하단 안내 */}
          <p
            className="text-xs text-center"
            style={{ color: "rgba(255, 255, 255, 0.25)" }}
          >
            잠시만 기다려줘
          </p>

          <style>{`
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.8);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            @keyframes dotBounce {
              0%, 80%, 100% {
                transform: translateY(0);
                opacity: 0.5;
              }
              40% {
                transform: translateY(-8px);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {/* 입력 단계 */}
      {stage === "free_input" && (
        <TypeAInput config={config} onSubmit={handleFreeInputSubmit} />
      )}

      {/* 자유입력 후 반응 */}
      {stage === "reaction_after_free" && (
        <ReactionBubble
          messages={[
            "고마워",
            "상황을 자세히 이해하기 위해",
            "몇 가지만 더 볼게.",
          ]}
          onComplete={handleReactionAfterFreeComplete}
          completedSteps={1}
        />
      )}

      {/* 선택형 질문들 (reaction 없음, 빠르게) */}
      {stage === "correction_questions" && (
        <CorrectionQuestions
          config={config}
          onSubmit={handleCorrectionSubmit}
        />
      )}
    </div>
  );
};

export default AnalyzePage;
