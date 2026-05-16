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
    user_id: "user-1",
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
    user_id: "user-1",
    guest_id: null,
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
    user_id: "user-1",
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
  "session-5": {
    id: "session-5",
    content_id: "emotion-2",
    user_id: "user-1",
    guest_id: null,
    inferred_user_type: {
      tendency: "emotional_numbness",
      intensity: "medium",
      pattern: "avoidance",
    },
    status: "completed" as SessionStatus,
    created_at: "2026-04-20T16:15:00Z",
    updated_at: "2026-04-20T17:00:00Z",
  },
  "session-6": {
    id: "session-6",
    content_id: "relationship-1",
    user_id: "user-1",
    guest_id: null,
    inferred_user_type: {
      tendency: "interpersonal_anxiety",
      intensity: "medium",
      pattern: "boundary_issue",
    },
    status: "completed" as SessionStatus,
    created_at: "2026-05-03T13:20:00Z",
    updated_at: "2026-05-03T14:00:00Z",
  },
  "session-guest-1": {
    id: "session-guest-1",
    content_id: "love-1",
    user_id: null,
    guest_id: "guest-1",
    inferred_user_type: {
      tendency: "anxious_attachment",
      intensity: "high",
      pattern: "checking_behavior",
    },
    status: "completed" as SessionStatus,
    created_at: "2026-05-04T10:00:00Z",
    updated_at: "2026-05-04T10:45:00Z",
  },
  "session-guest-2": {
    id: "session-guest-2",
    content_id: "career-1",
    user_id: null,
    guest_id: "guest-1",
    inferred_user_type: {
      tendency: "career_confusion",
      intensity: "medium",
      pattern: "lack_of_direction",
    },
    status: "completed" as SessionStatus,
    created_at: "2026-04-30T14:30:00Z",
    updated_at: "2026-04-30T15:10:00Z",
  },
};

// ── 세션별 답변 더미 데이터 ────────────────────────────────────────
export const DUMMY_SESSION_ANSWERS: Record<string, Answer[]> = {
  "session-1": [
    {
      step_id: "free_input",
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "자꾸 상대가 의심되고, 확인하면 안 되는 걸 알면서도 휴대폰이나 SNS를 보게 돼. 상대가 최근에 업데이트를 덜 해서 더 불안한 상태고, 이 감정이 나를 힘들게 해",
    },
    {
      step_id: "q1",
      question_text: "이런 행동이 얼마나 자주 일어나?",
      answer_options: ["daily"],
    },
    {
      step_id: "q2",
      question_text: "이 상황이 얼마나 오래됐어?",
      answer_options: ["months"],
    },
    {
      step_id: "q3",
      question_text: "상대의 반응은 어떤 편이야?",
      answer_options: ["frustrated"],
    },
    {
      step_id: "q4",
      question_text: "이런 마음이 들 때 너는 주로 어떻게 해?",
      answer_options: ["check_sns"],
    },
  ],
  "session-2": [
    {
      step_id: "free_input",
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "최근에 만나기 시작한 사람이 있는데, 이 감정이 진심인지 아니면 그냥 외로워서 그런 건지 구분이 안 돼. 자기 전에만 생각나고, 만날 땐 별로 특별한 감정이 안 느껴져",
    },
    {
      step_id: "q1",
      question_text: "만난 지 얼마나 됐어?",
      answer_options: ["recent"],
    },
    {
      step_id: "q2",
      question_text: "상대를 만날 때 주로 어떤 감정이야?",
      answer_options: ["comfortable"],
    },
  ],
  "session-3": [
    {
      step_id: "free_input",
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "썸 중인데, 상대가 나를 좋아하는 건지 모르겠어. 자꾸 연락을 미루고, 만날 땐 좋은데 시간이 지나면 또 연락이 뜸해",
    },
    {
      step_id: "q1",
      question_text: "이 상황이 얼마나 오래됐어?",
      answer_options: ["months"],
    },
    {
      step_id: "q2",
      question_text: "상대의 패턴을 어떻게 해석해?",
      answer_options: ["mixed_signals"],
    },
  ],
  "session-4": [
    {
      step_id: "free_input",
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "지금 직장에 만족을 못 하고 있는데, 뭘 해야 할지 모르겠어. 스펙도 없고, 나이도 늦은 것 같은데 전환이 가능할지 의심스러워",
    },
    {
      step_id: "q1",
      question_text: "직장에서 가장 불만족한 부분은?",
      answer_options: ["growth"],
    },
    {
      step_id: "q2",
      question_text: "전환 생각은 얼마나 자주 해?",
      answer_options: ["daily"],
    },
  ],
  "session-5": [
    {
      step_id: "free_input",
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "요즘 뭘 해도 감정이 안 느껴져. 좋은 일이 생겨도 별로고, 나쁜 일이 있어도 뭔가 멀게만 느껴져. 이 상태가 며칠째 계속되고 있어",
    },
    {
      step_id: "q1",
      question_text: "이 감정이 얼마나 오래됐어?",
      answer_options: ["weeks"],
    },
    {
      step_id: "q2",
      question_text: "이런 느낌이 들 때 너는 주로 뭘 하고 싶어?",
      answer_options: ["avoid_interaction"],
    },
  ],
  "session-6": [
    {
      step_id: "free_input",
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "친구들과의 관계에서 자꾸 밀려나는 기분이 들어. 나만 노력하는 것 같고, 상대들은 나한테 관심이 없는 것 같아. 어떻게 해야 할지 모르겠어",
    },
    {
      step_id: "q1",
      question_text: "이 상황이 얼마나 오래됐어?",
      answer_options: ["months"],
    },
    {
      step_id: "q2",
      question_text: "이 상황이 모든 관계에 해당돼?",
      answer_options: ["specific_relationships"],
    },
  ],
  "session-guest-1": [
    {
      step_id: "free_input",
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "사귀는 사람이 있는데 자꾸 의심이 생겨. 핸드폰을 자주 확인하게 되고, SNS에서 상대 활동을 체크하는 습관이 있어. 이게 정상인지 모르겠고 내 집착이 문제라고 생각해",
    },
    {
      step_id: "q1",
      question_text: "이런 행동이 얼마나 자주 일어나?",
      answer_options: ["daily"],
    },
    {
      step_id: "q2",
      question_text: "이 상황이 얼마나 오래됐어?",
      answer_options: ["months"],
    },
    {
      step_id: "q3",
      question_text: "상대의 반응은 어떤 편이야?",
      answer_options: ["frustrated"],
    },
    {
      step_id: "q4",
      question_text: "이런 마음이 들 때 너는 주로 어떻게 해?",
      answer_options: ["check_sns"],
    },
  ],
  "session-guest-2": [
    {
      step_id: "free_input",
      question_text: "지금 상황을 편하게 적어줘",
      answer_text:
        "지금 하는 일에 만족이 안 되는데, 뭘 해야 할지 몰라. 이미 이 일 경력이 3년이 되었는데 지금 바꿔도 될까 싶고, 다른 분야는 자신이 없어",
    },
    {
      step_id: "q1",
      question_text: "직장에서 가장 불만족한 부분은?",
      answer_options: ["growth"],
    },
    {
      step_id: "q2",
      question_text: "전환 생각은 얼마나 자주 해?",
      answer_options: ["weekly"],
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

// 세션 ID로 content 정보 조회 (더미)
export const getContentTitle = (contentId: string): string => {
  const contentTitles: Record<string, { title: string; category: string }> = {
    "love-1": { title: "사랑일까, 집착일까?", category: "love" },
    "love-2": { title: "나는 진심일까, 그냥 외로운 걸까?", category: "love" },
    "love-3": { title: "왜 항상 나만 더 좋아하게 될까?", category: "love" },
    "love-4": { title: "왜 항상 썸에서 끝날까?", category: "love" },
    "love-5": { title: "이 사람, 나 좋아하는 거 맞아?", category: "love" },
    "relationship-1": { title: "나만 노력하는 건 아닐까?", category: "relationship" },
    "career-1": { title: "지금 내 커리어가 맞나?", category: "career" },
    "emotion-2": { title: "요즘 왜 이럴까?", category: "emotion" },
  };

  return contentTitles[contentId]?.title || "알 수 없는 콘텐츠";
};

export const getContentCategory = (contentId: string): string => {
  const contentTitles: Record<string, { title: string; category: string }> = {
    "love-1": { title: "사랑일까, 집착일까?", category: "love" },
    "love-2": { title: "나는 진심일까, 그냥 외로운 걸까?", category: "love" },
    "love-3": { title: "왜 항상 나만 더 좋아하게 될까?", category: "love" },
    "love-4": { title: "왜 항상 썸에서 끝날까?", category: "love" },
    "love-5": { title: "이 사람, 나 좋아하는 거 맞아?", category: "love" },
    "relationship-1": { title: "나만 노력하는 건 아닐까?", category: "relationship" },
    "career-1": { title: "지금 내 커리어가 맞나?", category: "career" },
    "emotion-2": { title: "요즘 왜 이럴까?", category: "emotion" },
  };

  return contentTitles[contentId]?.category || "general";
};
