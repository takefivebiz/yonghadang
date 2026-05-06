import { AnalysisSession, SessionStatus } from "@/lib/types/session";
import { Answer } from "@/lib/types/analyze";

// TODO: [백엔드 연동] 더미데이터를 실제 DB 쿼리로 교체
// POST /api/sessions - 새 세션 생성
// GET /api/sessions/[id] - 세션 조회
// GET /api/sessions/[id]/answers - 세션 답변 조회

// ── 분석 세션 더미 데이터 ────────────────────────────────────────
export const DUMMY_SESSIONS: Record<string, AnalysisSession> = {
  "session-1": {
    id: "session-1",
    content_id: "love-1",
    user_id: "user-1",
    guest_id: null,
    inferred_user_type: {
      tendency: "anxious_attachment",
      intensity: "high",
      pattern: "checking_behavior",
    },
    status: "completed" as SessionStatus,
    created_at: "2026-05-01T10:00:00Z",
    updated_at: "2026-05-01T10:45:00Z",
  },
  "session-2": {
    id: "session-2",
    content_id: "love-2",
    user_id: "user-2",
    guest_id: null,
    inferred_user_type: {
      tendency: "confused_emotion",
      intensity: "medium",
      pattern: "loneliness_vs_love",
    },
    status: "completed" as SessionStatus,
    created_at: "2026-04-28T14:30:00Z",
    updated_at: "2026-04-28T15:10:00Z",
  },
  "session-3": {
    id: "session-3",
    content_id: "love-5",
    user_id: null,
    guest_id: "guest-1",
    inferred_user_type: {
      tendency: "uncertainty",
      intensity: "medium",
      pattern: "mixed_signals",
    },
    status: "completed" as SessionStatus,
    created_at: "2026-04-25T09:00:00Z",
    updated_at: "2026-04-25T09:30:00Z",
  },
  "session-4": {
    id: "session-4",
    content_id: "career-1",
    user_id: "user-3",
    guest_id: null,
    inferred_user_type: {
      tendency: "career_confusion",
      intensity: "high",
      pattern: "lack_of_direction",
    },
    status: "completed" as SessionStatus,
    created_at: "2026-05-02T11:00:00Z",
    updated_at: "2026-05-02T11:45:00Z",
  },
};

// ── 세션별 답변 더미 데이터 ────────────────────────────────────────
export const DUMMY_SESSION_ANSWERS: Record<string, Answer[]> = {
  "session-1": [
    {
      question_index: 1,
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "자꾸 상대가 의심되고, 확인하면 안 되는 걸 알면서도 휴대폰이나 SNS를 보게 돼. 상대가 최근에 업데이트를 덜 해서 더 불안한 상태고, 이 감정이 나를 힘들게 해",
    },
    {
      question_index: 2,
      question_text: "이런 행동이 얼마나 자주 일어나?",
      answer_options: ["daily"],
    },
    {
      question_index: 3,
      question_text: "이 상황이 얼마나 오래됐어?",
      answer_options: ["months"],
    },
    {
      question_index: 4,
      question_text: "상대의 반응은 어떤 편이야?",
      answer_options: ["frustrated"],
    },
    {
      question_index: 5,
      question_text: "이런 마음이 들 때 너는 주로 어떻게 해?",
      answer_options: ["check_sns"],
    },
  ],
  "session-2": [
    {
      question_index: 1,
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "최근에 만나기 시작한 사람이 있는데, 이 감정이 진심인지 아니면 그냥 외로워서 그런 건지 구분이 안 돼. 자기 전에만 생각나고, 만날 땐 별로 특별한 감정이 안 느껴져",
    },
    {
      question_index: 2,
      question_text: "만난 지 얼마나 됐어?",
      answer_options: ["recent"],
    },
    {
      question_index: 3,
      question_text: "상대를 만날 때 주로 어떤 감정이야?",
      answer_options: ["comfortable"],
    },
  ],
  "session-3": [
    {
      question_index: 1,
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "썸 중인데, 상대가 나를 좋아하는 건지 모르겠어. 자꾸 연락을 미루고, 만날 땐 좋은데 시간이 지나면 또 연락이 뜸해",
    },
    {
      question_index: 2,
      question_text: "이 상황이 얼마나 오래됐어?",
      answer_options: ["months"],
    },
    {
      question_index: 3,
      question_text: "상대의 패턴을 어떻게 해석해?",
      answer_options: ["mixed_signals"],
    },
  ],
  "session-4": [
    {
      question_index: 1,
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "지금 직장에 만족을 못 하고 있는데, 뭘 해야 할지 모르겠어. 스펙도 없고, 나이도 늦은 것 같은데 전환이 가능할지 의심스러워",
    },
    {
      question_index: 2,
      question_text: "직장에서 가장 불만족한 부분은?",
      answer_options: ["growth"],
    },
    {
      question_index: 3,
      question_text: "전환 생각은 얼마나 자주 해?",
      answer_options: ["daily"],
    },
  ],
};

// 세션과 답변을 함께 조회하는 헬퍼 함수
export const getSessionWithAnswers = (
  sessionId: string
): { session: AnalysisSession; answers: Answer[] } | null => {
  const session = DUMMY_SESSIONS[sessionId];
  const answers = DUMMY_SESSION_ANSWERS[sessionId] || [];

  if (!session) return null;
  return { session, answers };
};

// 사용자별 세션 목록 조회
export const getUserSessions = (userId: string | null, guestId: string | null) => {
  return Object.values(DUMMY_SESSIONS).filter(
    (s) =>
      (userId && s.user_id === userId) ||
      (guestId && s.guest_id === guestId)
  );
};
