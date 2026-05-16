import { InputConfig } from "@/lib/types/content";

// ── 콘텐츠별 입력 설정 더미 데이터 ──────────────────────────────────
// TODO: [백엔드 연동] 더미데이터를 GET /api/contents/[id] 응답의 input_config로 교체

export const DUMMY_INPUT_CONFIGS: Record<string, InputConfig> = {
  "love-1": {
    placeholder: "그 사람 이야기를 편하게 적어줘",
    example_inputs: [
      "연락은 계속 하는데 이 사람이 나를 좋아하는 건지 잘 모르겠어",
      "둘이 있으면 분위기는 좋은데, 관계를 확실히 하려는 말은 없어",
    ],

    questions: [
      // ── Q1: 흔들림의 현재 위상 (single, 7 options) ──────────────────
      // 7개 흔들림 subtype의 1차 진입 신호. 모두 "이미 흔들리고 있다"는 전제.
      // 강한흔들림/확인욕구/반복해석/고백전/기대접기/소진/미련 subtype에 각각 +3씩 진입.
      {
        index: 1,
        text: "지금 너의 흔들림은\n어디쯤 와 있어?",
        type: "single",
        options: [
          {
            label: "막 흔들리기 시작한 것 같아",
            value: "just_started_shaking",
          },
          {
            label: "좋아하는지 아닌지, 답이 필요해",
            value: "need_clear_answer",
          },
          {
            label: "같은 대화를 계속 다시 보고 있어",
            value: "replaying_conversations",
          },
          {
            label: "곧 뭔가 해야 할 것 같은데, 한 번만 더 확인하고 싶어",
            value: "last_check_before_action",
          },
          {
            label: "천천히 기대를 접는 중이야",
            value: "slowly_lowering_expectation",
          },
          {
            label: "너무 오래 흔들려서 지쳐가고 있어",
            value: "worn_out_from_shaking",
          },
          {
            label: "끝난 것 같은데 마음이 못 놓아",
            value: "cant_let_go_after_end",
          },
        ],
      },

      // ── Q2: 상대 태도 (single, 5 options) ───────────────────────────
      // 모두 "애매하거나 결정적이지 않은" 상태 전제. 관망형/우위형 제거.
      {
        index: 2,
        text: "상대 태도는\n어떤 애매함에 가까워?",
        type: "single",
        options: [
          {
            label: "마음은 있는 것 같은데 확실한 표현이 없어",
            value: "emotion_without_clarity",
          },
          {
            label: "다가왔다가 다시 거리를 둬",
            value: "inconsistent_interest",
          },
          {
            label: "편한 관계처럼 두려고 해",
            value: "comfortable_without_progress",
          },
          {
            label: "신호는 있는데 매번 결정적이지 않아",
            value: "signal_without_commitment",
          },
          {
            label: "이제는 반응 자체가 줄어들고 있어",
            value: "fading_response",
          },
        ],
      },

      // ── Q3: 흔들릴 때 내 반응 (multiple, 7 options) ─────────────────
      // 7개 subtype별 행동 패턴. 관망/정의권 행동 제거, 흔들림의 결로 통일.
      {
        index: 3,
        text: "흔들릴 때\n너는 보통 어떻게 반응해?",
        type: "multiple",
        options: [
          {
            label: "나눴던 대화를 계속 다시 봐",
            value: "rechecking_signals",
          },
          {
            label: "괜찮은 척하지만 혼자 의미를 찾아",
            value: "silent_overthinking",
          },
          {
            label: "상대 반응 하나에 하루 기분이 좌우돼",
            value: "mood_swings_by_signal",
          },
          {
            label: "직접 묻고 싶지만 괜히 참아",
            value: "holding_back_question",
          },
          {
            label: "한 번만 더 확인하면 결정할 것 같아",
            value: "one_more_check_then_decide",
          },
          {
            label: "이제 의미 부여를 줄이려고 노력해",
            value: "trying_to_detach",
          },
          {
            label: "다 잊은 줄 알았는데 자꾸 떠올라",
            value: "unwanted_recurrence",
          },
        ],
      },

      // ── Q4: 가장 지치게 만드는 것 (single, 6 options) ──────────────
      // "어디에서 소진되는가" → 흔들림의 결 차이를 가른다. 호기심/우위형 제거.
      {
        index: 4,
        text: "이 관계에서 너를\n가장 지치게 만드는 건 뭐야?",
        type: "single",
        options: [
          {
            label: "나만 진심이라는 게 자꾸 확인되는 것",
            value: "confirmed_one_sided",
          },
          {
            label: "이 애매한 상태가 길어지는 것",
            value: "prolonged_ambiguity",
          },
          {
            label: "같은 신호를 매번 해석하고 있는 나 자신",
            value: "exhausted_by_my_own_interpretation",
          },
          {
            label: "곧 결정해야 한다는 압박",
            value: "pressure_to_decide_soon",
          },
          {
            label: "기대를 접으려는데 자꾸 흔들리는 것",
            value: "failing_to_let_go",
          },
          {
            label: "끝났는데도 마음이 자꾸 돌아가는 것",
            value: "mind_keeps_returning",
          },
        ],
      },

      // ── Q5: 진짜 원하는 것 (single, 6 options) ─────────────────────
      // 흔들림의 출구. 자기기준/거리두기형 제거, 행동/정리 옵션 추가.
      {
        index: 5,
        text: "솔직히 지금\n가장 원하는 건 뭐야?",
        type: "single",
        options: [
          {
            label: "상대가 먼저 확실한 표현을 해줬으면",
            value: "want_expression",
          },
          {
            label: "이 관계가 어디로 가는 건지 알고 싶어",
            value: "want_direction",
          },
          {
            label: "상대 마음이 어떤지 정확히 알고 싶어",
            value: "want_to_know_their_heart",
          },
          {
            label: "내가 할 말 하고 결정하고 싶어",
            value: "want_to_act_and_decide",
          },
          {
            label: "천천히 마음을 정리할 시간이 필요해",
            value: "want_time_to_fold",
          },
          {
            label: "솔직히 아직은 끝난 관계가 아니길",
            value: "want_possibility",
          },
        ],
      },
    ],
  },

  "rel-1": {
    placeholder: "관계에서 '을'이 되는 상황을 설명해줘",
    example_inputs: [
      "항상 상대의 의견에 맞춰주고, 내 생각을 잘 말하지 않아. 그래서 자꾸만 상대가 나를 무시하는 것 같은 기분이 들어.",
      "대화할 때 항상 내 말이 먼저 끝나고, 상대가 리드하는 형태가 돼. 결정도 상대가 주도적으로 해.",
    ],
    questions: [
      {
        index: 1,
        text: "이런 상황이 주로 \n 어떤 관계에서 일어나?",
        type: "multiple",
        options: [
          { label: "연애 관계", value: "romantic" },
          { label: "친구", value: "friend" },
          { label: "가족", value: "family" },
          { label: "직장", value: "work" },
          { label: "거의 모든 관계에서", value: "all" },
        ],
      },
      {
        index: 2,
        text: "상대가 너를 \n 무시한다고 느끼는 순간은?",
        type: "multiple",
        options: [
          { label: "내 의견을 무시할 때", value: "opinion" },
          { label: "내 시간을 함부로 할 때", value: "time" },
          { label: "내 요청을 거절할 때", value: "request" },
          { label: "말투가 무례할 때", value: "tone" },
          { label: "우선순위에서 나를 뒤로 할 때", value: "behavior" },
        ],
      },
      {
        index: 3,
        text: "이런 상황에서 \n 너는 보통 어떻게 반응해?",
        type: "single",
        options: [
          { label: "더 맞춰주려고 함", value: "comply" },
          { label: "기분 나쁘지만 참음", value: "suppress" },
          { label: "거리를 둠", value: "withdraw" },
          { label: "직접 얘기함", value: "confront" },
        ],
      },
      {
        index: 4,
        text: "이렇게 느낀지는 \n 얼마나 오래됐어?",
        type: "single",
        options: [
          { label: "최근에 시작됐어", value: "recent" },
          { label: "점점 이렇게 변했어", value: "gradual" },
          { label: "예전부터 계속 그랬어", value: "longterm" },
          { label: "어릴 때부터 이런 패턴이 있었어", value: "childhood" },
        ],
      },
      {
        index: 5,
        text: "이 상황을 바꾸려고 \n 노력한 적이 있어?",
        type: "single",
        options: [
          { label: "노력해본 적 없음", value: "never" },
          { label: "시도했지만 실패했음", value: "tried_failed" },
          { label: "계속 노력 중", value: "ongoing" },
          { label: "포기했음", value: "gave_up" },
        ],
      },
    ],
  },

  "career-1": {
    placeholder: "지금 일이 자신에게 맞는지 설명해줘",
    example_inputs: [
      "일 자체는 재미있는데, 회사 문화나 인간관계 때문에 힘들어. 이직할지 말지 고민이야.",
      "처음엔 좋아했는데, 요즘은 일하면서 의욕이 안 생겨. 이게 번아웃인지, 아니면 진짜 안 맞는 일인지 모르겠어.",
    ],
    questions: [
      {
        index: 1,
        text: "일 자체는 어떤 편이야?",
        type: "single",
        options: [
          { label: "너무 재미있고 의미 있음", value: "love" },
          { label: "그럭저럭 괜찮음", value: "okay" },
          { label: "따분하고 의미 없음", value: "boring" },
          { label: "너무 힘들고 싫음", value: "hate" },
        ],
      },
      {
        index: 2,
        text: "일이 힘들다면, \n 주된 이유는?",
        type: "multiple",
        options: [
          { label: "일의 난도나 양", value: "task" },
          { label: "직장 인간관계", value: "people" },
          { label: "회사 문화나 가치관", value: "culture" },
          { label: "업무량 대비 시간", value: "work_life" },
          { label: "성장 기회 부족", value: "growth" },
        ],
      },
      {
        index: 3,
        text: "이 회사에 들어오기 전에 \n 기대했던 것과 현실은?",
        type: "single",
        options: [
          { label: "기대와 비슷함", value: "match" },
          { label: "예상보다 좋음", value: "better" },
          { label: "예상보다 못함", value: "worse" },
          { label: "기대한 것과 완전히 다름", value: "different" },
        ],
      },
      {
        index: 4,
        text: "월요일 아침이나 \n 출근 생각이 들 때는?",
        type: "single",
        options: [
          { label: "설렘", value: "excited" },
          { label: "그냥 그럼", value: "neutral" },
          { label: "싫음", value: "dread" },
          { label: "불안하거나 우울함", value: "anxiety" },
        ],
      },
      {
        index: 5,
        text: "여기서 계속 일하고 싶어?",
        type: "single",
        options: [
          { label: "계속하고 싶음", value: "yes" },
          { label: "확실하지 않음", value: "uncertain" },
          { label: "그만두고 싶음", value: "no" },
          { label: "지금 당장이라도 나가고 싶음", value: "asap" },
        ],
      },
    ],
  },

  "career-2": {
    placeholder: "지금 상황을 구체적으로 설명해줘",
    example_inputs: [
      "일이 싫은 건지, 회사가 싫은 건지 분간이 안 가.",
      "퇴사해야 할 것 같은데, 그냥 지쳐서 그런 건지 모르겠어.",
      "한두 달 쉬면 괜찮아질 것 같기도 하고, 영구적으로 떠나야 할 것 같기도 해.",
    ],
    questions: [
      {
        index: 1,
        text: "지금 고민의 핵심은?",
        type: "single",
        options: [
          {
            label: "지금 당장 떠나야 하는지 판단 안 됨",
            value: "immediate_decision",
          },
          {
            label: "일은 좋은데 환경이 견디기 힘듦",
            value: "environment_issue",
          },
          { label: "회사도 일도 다 지침", value: "everything_tired" },
          {
            label: "지금이 일시적인 피로인지 신호인지 구분 안 됨",
            value: "signal_unclear",
          },
          { label: "떠날 장점과 남을 장점이 모두 있음", value: "both_valid" },
        ],
      },
      {
        index: 2,
        text: "가장 크게 지치는 이유는?",
        type: "single",
        options: [
          { label: "일 자체의 난도나 양", value: "work_itself" },
          { label: "사람 (팀, 리더, 조직 문화)", value: "people" },
          { label: "성장이 안 보이고 반복되는 업무", value: "no_growth" },
          { label: "신체적 피로 (야근, 긴 시간)", value: "physical" },
          { label: "일이 자신의 가치관과 맞지 않음", value: "values_mismatch" },
          { label: "여러 가지가 다 복합적으로 쌓임", value: "cumulative" },
        ],
      },
      {
        index: 3,
        text: "최근에 반복되는 패턴이 있다면?",
        type: "single",
        options: [
          { label: "매일 출근길에 우울함 또는 불안감", value: "daily_dread" },
          {
            label: "특정 상황 (회의, 업무, 상사와의 대면)에서 피하고 싶음",
            value: "situation_specific",
          },
          { label: "퇴근 후에도 일 생각이 떠나지 않음", value: "after_work" },
          { label: "주말도 쉬어지지 않는 피로감", value: "weekend_dread" },
          { label: "휴가 가도 돌아올 생각에 우울함", value: "return_dread" },
        ],
      },
      {
        index: 4,
        text: "결정하지 못하는 가장 큰 이유는?",
        type: "single",
        options: [
          { label: "경제적 불안정성 (이직하면 수입 변동)", value: "financial" },
          {
            label: "지금보다 더 좋을 회사가 있을지 확신 없음",
            value: "uncertainty",
          },
          { label: "떠나는 게 패배처럼 느껴짐", value: "ego" },
          { label: "지금이 정말 떠날 때인지 확실하지 않음", value: "timing" },
          {
            label: "떠나도 다른 곳도 비슷할 수 있다는 생각",
            value: "same_elsewhere",
          },
        ],
      },
      {
        index: 5,
        text: "지금 가장 중요한 판단 기준은?",
        type: "single",
        options: [
          { label: "신체와 정신 건강", value: "health" },
          { label: "경제적 안정성", value: "financial_security" },
          { label: "성장과 경력 발전", value: "career_growth" },
          { label: "일과 삶의 균형", value: "work_life_balance" },
          { label: "일의 의미와 가치관 맞춤", value: "meaning" },
        ],
      },
    ],
  },

  "career-3": {
    placeholder: "게으름과 번아웃의 차이를 구분하기 위해 설명해줄래",
    example_inputs: [
      "일에 의욕이 없는데, 이게 내가 게으른 건지 번아웃인지 모르겠어.",
      "하고 싶은 게 없는 상태예요. 회사에서 뭘 하든 반응이 없어.",
      "피곤함이 계속되는데, 쉬어도 안 회복되는 느낌이 들어.",
    ],
    questions: [
      {
        index: 1,
        text: "지금 하고 싶은 일이 있어?",
        type: "single",
        options: [
          { label: "명확한 목표가 있음", value: "clear" },
          { label: "어느 정도 있음", value: "some" },
          { label: "거의 없음", value: "little" },
          { label: "아무것도 하고 싶지 않음", value: "nothing" },
        ],
      },
      {
        index: 2,
        text: "평소와 비교했을 때 \n 피로도는?",
        type: "single",
        options: [
          { label: "비슷한 수준", value: "normal" },
          { label: "조금 더 피곤함", value: "somewhat" },
          { label: "매우 피곤함", value: "very" },
          { label: "회복이 안 되는 수준", value: "exhausted" },
        ],
      },
      {
        index: 3,
        text: "업무 난도와 내 실력의 \n 관계는?",
        type: "single",
        options: [
          { label: "적절한 수준", value: "match" },
          { label: "조금 어려움", value: "challenging" },
          { label: "훨씬 어려움", value: "overwhelming" },
          { label: "모르겠음", value: "unclear" },
        ],
      },
      {
        index: 4,
        text: "쉬거나 휴가를 가면 \n 회복이 되는 편이야?",
        type: "single",
        options: [
          { label: "충분히 회복됨", value: "recover" },
          { label: "어느 정도 회복됨", value: "partially" },
          { label: "별로 회복 안 됨", value: "no_recovery" },
          { label: "회복할 기회가 없음", value: "no_break" },
        ],
      },
      {
        index: 5,
        text: "퇴근 후 개인 시간을 \n 어떻게 보내는 편이야?",
        type: "multiple",
        options: [
          { label: "취미나 운동을 함", value: "hobby" },
          { label: "가족이나 친구와 시간을 보냄", value: "social" },
          { label: "스마트폰, SNS만 봄", value: "phone" },
          { label: "집에만 누워있음", value: "rest" },
          { label: "야근으로 바빔", value: "work" },
        ],
      },
    ],
  },

  "career-4": {
    placeholder: "내가 잘하고 있는지 확실하지 않은 이유를 이야기해줄래",
    example_inputs: [
      "일은 하고 있는데, 진짜 잘하고 있는 건지 모르겠어. 피드백도 잘 안 받아.",
      "성장하는 느낌이 없는데, 그게 내 탓인지 환경 탓인지 모르겠어.",
      "매년 반복되는 일만 하니까, 새로운 걸 배우는 기회가 없다고 느껴.",
    ],
    questions: [
      {
        index: 1,
        text: "회사에서 성장 기회를 \n 느낀다면?",
        type: "single",
        options: [
          { label: "충분히 느낌", value: "plenty" },
          { label: "어느 정도 있음", value: "some" },
          { label: "거의 없음", value: "little" },
          { label: "전혀 없음", value: "none" },
        ],
      },
      {
        index: 2,
        text: "기술이나 스킬 발전을 \n 얼마나 체감해?",
        type: "single",
        options: [
          { label: "확실히 발전함", value: "clear_growth" },
          { label: "조금 발전한 것 같음", value: "slight_growth" },
          { label: "정체된 느낌", value: "stagnant" },
          { label: "퇴화하는 것 같음", value: "decline" },
        ],
      },
      {
        index: 3,
        text: "향후 내 커리어 경로가 \n 명확해?",
        type: "single",
        options: [
          { label: "명확함", value: "clear" },
          { label: "어느 정도 있음", value: "some" },
          { label: "불명확함", value: "unclear" },
          { label: "전혀 모름", value: "no_idea" },
        ],
      },
      {
        index: 4,
        text: "피드백이나 평가를 \n 얼마나 받는 편이야?",
        type: "single",
        options: [
          { label: "자주 받음", value: "frequent" },
          { label: "가끔 받음", value: "sometimes" },
          { label: "거의 안 받음", value: "rarely" },
          { label: "받은 적 없음", value: "never" },
        ],
      },
      {
        index: 5,
        text: "새로운 것을 배우거나 \n 도전할 기회는?",
        type: "multiple",
        options: [
          { label: "프로젝트 참여", value: "project" },
          { label: "교육이나 강의", value: "training" },
          { label: "자격증이나 공부", value: "certification" },
          { label: "부서 이동", value: "transfer" },
          { label: "특별한 기회가 없음", value: "none" },
        ],
      },
    ],
  },

  "career-5": {
    placeholder: "이직을 고민하는 실제 이유를 자세히 설명해줄래",
    example_inputs: [
      "이직하고 싶은데, 정말 이직이 답일지 모르겠어. 다른 회사도 똑같지 않을까?",
      "좋은 조건의 회사를 만났는데, 지금 회사를 떠날 만한 이유가 충분한지 확실하지 않아.",
      "매일 퇴사를 생각하는데, 결정을 못 하고 있어. 뭘 기준으로 결정해야 할지 모르겠어.",
    ],
    questions: [
      {
        index: 1,
        text: "이직 이유로 가장 중요한 건?",
        type: "single",
        options: [
          { label: "더 높은 연봉과 복지", value: "compensation" },
          { label: "성장 기회와 경력 개발", value: "growth" },
          { label: "업무 환경과 인간관계", value: "environment" },
          { label: "일-삶의 균형", value: "work_life_balance" },
        ],
      },
      {
        index: 2,
        text: "더 나은 회사가 있을 것 같은 \n 이유는?",
        type: "multiple",
        options: [
          { label: "아는 회사나 직군이 더 있을 것 같음", value: "market" },
          { label: "구체적인 오퍼를 받았음", value: "offer" },
          {
            label: "업계에서 더 좋은 회사를 알고 있음",
            value: "known_company",
          },
          { label: "일반적인 추측일 뿐", value: "assumption" },
          { label: "현재 회사가 너무 안 맞아서", value: "current_bad" },
        ],
      },
      {
        index: 3,
        text: "지금 회사에서 \n 바꾸고 싶은 게 있다면?",
        type: "multiple",
        options: [
          { label: "업무 내용이나 직급", value: "role" },
          { label: "팀 조직이나 리더", value: "team" },
          { label: "급여나 보상", value: "compensation" },
          { label: "회사 문화나 방향", value: "culture" },
          { label: "다 바꾸고 싶음", value: "everything" },
        ],
      },
      {
        index: 4,
        text: "이직 결정이 \n 얼마나 시급해?",
        type: "single",
        options: [
          { label: "서두를 필요 없음", value: "no_hurry" },
          { label: "언제쯤 하면 좋을 것 같음", value: "sometime" },
          { label: "올해 안에는 해야 할 것 같음", value: "this_year" },
          { label: "지금 당장이라도 나가고 싶음", value: "asap" },
        ],
      },
      {
        index: 5,
        text: "이직이 문제를 \n 해결할 거라고 생각해?",
        type: "single",
        options: [
          { label: "확실히 해결할 것 같음", value: "solve" },
          { label: "어느 정도 도움이 될 듯", value: "help" },
          { label: "불확실함", value: "uncertain" },
          { label: "해결 안 할 것 같음", value: "no_solve" },
        ],
      },
    ],
  },

  "rel-2": {
    placeholder: "당신이 느끼는 예민함을 구체적으로 설명해줄래",
    example_inputs: [
      "상대의 작은 말도 자꾸 상처가 돼. 내가 너무 예민한 건 아닐까?",
      "상대가 내 말을 무시하는 것 같아서 화나는데, 이게 내 과민 반응일 수도 있고 상대가 진짜 무례한 건지 모르겠어.",
    ],
    questions: [
      {
        index: 1,
        text: "상대의 어떤 행동이 \n 가장 상처가 돼?",
        type: "multiple",
        options: [
          { label: "내 의견을 무시하거나 깎아내림", value: "dismissive" },
          { label: "내 기분을 모르고 무심하게 대함", value: "indifferent" },
          {
            label: "약속을 자꾸 깨거나 우선순위가 낮아 보임",
            value: "unreliable",
          },
          { label: "일부러 상처 주려는 말을 함", value: "intentional" },
          { label: "내 말에 적절한 반응이 없음", value: "lack_response" },
        ],
      },
      {
        index: 2,
        text: "이 예민함이 생기기 전에 \n 뭔가 축적된 게 있어?",
        type: "single",
        options: [
          { label: "갑자기 생긴 것 같음", value: "sudden" },
          { label: "작은 일들이 자꾸 쌓인 것", value: "accumulation" },
          { label: "큰 싸움이나 배신감이 있었음", value: "specific_event" },
          { label: "처음부터 있던 것 같음", value: "always" },
        ],
      },
      {
        index: 3,
        text: "상대가 당신을 \n 어떻게 보는 것 같아?",
        type: "single",
        options: [
          { label: "이해하고 소중하게 생각함", value: "valued" },
          { label: "일반적인 관심 수준", value: "normal" },
          { label: "귀찮아하거나 거리감 둠", value: "distant" },
          { label: "모르겠음", value: "unclear" },
        ],
      },
      {
        index: 4,
        text: "상대에게 이 예민함을 \n 얘기했을 때는?",
        type: "single",
        options: [
          { label: "이해하고 노력해줬음", value: "understanding" },
          { label: "형식적으로만 인정함", value: "dismissive" },
          { label: "내 탓으로 돌림", value: "blame" },
          { label: "얘기한 적 없음", value: "not_discussed" },
        ],
      },
      {
        index: 5,
        text: "혼자 있을 때는 \n 이 예민함이 있어?",
        type: "single",
        options: [
          { label: "없음", value: "no" },
          { label: "어느 정도 있음", value: "some" },
          { label: "비슷한 수준", value: "same" },
          { label: "더 심함", value: "worse" },
        ],
      },
    ],
  },

  "rel-3": {
    placeholder: "이 관계에서 손절을 고민하는 이유를 설명해줄래",
    example_inputs: [
      "이 관계가 내게 계속 상처만 주는 것 같은데, 손절해야 할지 계속 해야 할지 모르겠어.",
      "다른 선택지도 없고, 이 사람과의 관계를 끝내기가 너무 무서워.",
    ],
    questions: [
      {
        index: 1,
        text: "손절을 생각하게 한 \n 주된 이유는?",
        type: "single",
        options: [
          { label: "계속된 상처와 실망", value: "hurt" },
          { label: "에너지만 소비되는 느낌", value: "draining" },
          { label: "관계가 진전이 없음", value: "stagnant" },
          { label: "상대가 변할 가능성이 없어 보임", value: "hopeless" },
        ],
      },
      {
        index: 2,
        text: "지금까지 이 관계에서 \n 좋았던 부분이 있어?",
        type: "multiple",
        options: [
          { label: "함께 있을 때 위로가 됨", value: "comfort" },
          { label: "공통의 추억과 시간", value: "memories" },
          { label: "상대를 이해하려는 나", value: "my_effort" },
          { label: "상대의 좋은 부분", value: "their_good_side" },
          { label: "좋은 부분이 없어 보임", value: "nothing" },
        ],
      },
      {
        index: 3,
        text: "손절을 망설이는 이유는?",
        type: "multiple",
        options: [
          { label: "상대가 혼자 남을까봐", value: "guilt" },
          { label: "내가 잘못한 게 아닐까 불안함", value: "self_doubt" },
          { label: "다시 잘될까봐", value: "hope_rekindled" },
          { label: "혼자가 싫어서", value: "loneliness" },
          { label: "시간이 아깝다는 생각", value: "sunk_cost" },
        ],
      },
      {
        index: 4,
        text: "이 관계가 \n 현재 나에게 미치는 영향은?",
        type: "single",
        options: [
          { label: "긍정적임", value: "positive" },
          { label: "중립적임", value: "neutral" },
          { label: "약간 부정적", value: "somewhat_negative" },
          { label: "매우 부정적", value: "very_negative" },
        ],
      },
      {
        index: 5,
        text: "이 문제가 시간으로 \n 해결될 가능성은?",
        type: "single",
        options: [
          { label: "충분히 있음", value: "possible" },
          { label: "어느 정도 있음", value: "somewhat" },
          { label: "거의 없음", value: "unlikely" },
          { label: "없음", value: "impossible" },
        ],
      },
    ],
  },

  "rel-4": {
    placeholder: "착하다는 말이 왜 불편해졌는지 설명해줄래",
    example_inputs: [
      "예전에는 착하다는 말이 자랑스러웠는데, 요즘은 '왜 나만 계속 양보하지?' 하는 생각이 들어.",
      "상대가 내 친절을 당연하게 받아들이는 것 같아. 그게 자꾸 화나.",
    ],
    questions: [
      {
        index: 1,
        text: "착한 행동을 할 때 \n 지금 느끼는 감정은?",
        type: "multiple",
        options: [
          { label: "나는 이뤄야 한다는 의무감", value: "obligation" },
          { label: "상대가 고마워할 거라는 기대", value: "expectation" },
          { label: "화풀이나 모욕감", value: "resentment" },
          { label: "자신감이나 보람", value: "pride" },
          { label: "지침과 피로", value: "exhaustion" },
        ],
      },
      {
        index: 2,
        text: "상대가 너의 친절을 \n 어떻게 반응해?",
        type: "single",
        options: [
          { label: "고마워하고 존경함", value: "grateful" },
          { label: "당연한 것으로 받아들임", value: "expected" },
          { label: "고마움 없이 활용만 함", value: "taken_for_granted" },
          { label: "오히려 무시하거나 깎아내림", value: "dismissive" },
        ],
      },
      {
        index: 3,
        text: "너의 경계를 무시하는 \n 일이 자주 있어?",
        type: "single",
        options: [
          { label: "거의 없음", value: "rarely" },
          { label: "가끔 있음", value: "sometimes" },
          { label: "자주 있음", value: "often" },
          { label: "항상 있음", value: "always" },
        ],
      },
      {
        index: 4,
        text: "착함이 아니라 약함처럼 \n 느껴진 적 있어?",
        type: "single",
        options: [
          { label: "없음", value: "never" },
          { label: "가끔 느낌", value: "sometimes" },
          { label: "자주 느낌", value: "often" },
          { label: "항상 느낌", value: "always" },
        ],
      },
      {
        index: 5,
        text: "이 관계에서 \n 나를 우선하고 싶어?",
        type: "single",
        options: [
          { label: "그렇게 하고 싶음", value: "want_to" },
          { label: "하고 싶은데 못 하고 있음", value: "want_but_cant" },
          { label: "상대 때문에 못 함", value: "prevented" },
          { label: "무엇부터 해야 할지 모름", value: "unsure" },
        ],
      },
    ],
  },

  "rel-5": {
    placeholder: "좋은 사람인데 불편한 그 모순을 이야기해줄래",
    example_inputs: [
      "상대는 나쁜 사람은 아닌데, 왜 함께 있으면 불편할까?",
      "이 사람이 나를 속상하게 하는 부분은 없는데, 뭔가 자꾸 거리감을 느껴.",
    ],
    questions: [
      {
        index: 1,
        text: "상대의 좋은 부분은?",
        type: "multiple",
        options: [
          { label: "성실하고 책임감 있음", value: "responsible" },
          { label: "내게 충실하고 헌신함", value: "devoted" },
          { label: "성격이 좋고 긍정적임", value: "positive" },
          { label: "능력있고 자기관리 잘함", value: "capable" },
          { label: "내 입장을 이해하려고 노력함", value: "understanding" },
        ],
      },
      {
        index: 2,
        text: "그래도 불편한 이유는?",
        type: "multiple",
        options: [
          {
            label: "성향이 내 성향과 맞지 않음",
            value: "personality_mismatch",
          },
          { label: "삶의 속도나 방향이 다름", value: "different_pace" },
          { label: "관계의 깊이가 물리적일 뿐", value: "shallow" },
          { label: "나를 이해는 하지만 공감하지 못함", value: "no_empathy" },
          { label: "이유를 모르겠음", value: "unknown" },
        ],
      },
      {
        index: 3,
        text: "함께 있을 때 \n 자연스러움을 느껴?",
        type: "single",
        options: [
          { label: "매우 자연스러움", value: "very" },
          { label: "어느 정도 자연스러움", value: "somewhat" },
          { label: "어색함", value: "awkward" },
          { label: "굉장히 어색함", value: "very_awkward" },
        ],
      },
      {
        index: 4,
        text: "이 불편함을 \n 상대에게 얘기했을 때는?",
        type: "single",
        options: [
          { label: "상대가 이해함", value: "understood" },
          { label: "상대가 노력함", value: "tried" },
          { label: "상대가 상처받거나 화냄", value: "offended" },
          { label: "얘기한 적 없음", value: "not_discussed" },
        ],
      },
      {
        index: 5,
        text: "너는 이 사람을 \n 사랑하는 것 같아?",
        type: "single",
        options: [
          { label: "분명히 사랑함", value: "yes" },
          { label: "어느 정도 사랑하는 것 같음", value: "somewhat" },
          { label: "확실하지 않음", value: "unsure" },
          { label: "사랑하지 않는 것 같음", value: "no" },
        ],
      },
    ],
  },

  "rel-6": {
    placeholder: "사람이 다 귀찮아진 그 마음을 설명해줄래",
    example_inputs: [
      "예전엔 관계를 소중히 생각했는데, 이제는 모든 사람이 귀찮아 보여.",
      "상대는 나쁘지 않은데, 그냥 사람 자체가 다 피곤해.",
    ],
    questions: [
      {
        index: 1,
        text: "이 피로감은 \n 언제부터였어?",
        type: "single",
        options: [
          { label: "최근 몇 주", value: "recent_weeks" },
          { label: "몇 개월", value: "few_months" },
          { label: "반년 이상", value: "half_year" },
          { label: "예전부터 있던 것", value: "always" },
        ],
      },
      {
        index: 2,
        text: "구체적으로 \n 어떤 것들이 귀찮아?",
        type: "multiple",
        options: [
          { label: "상대의 기대나 요구", value: "expectations" },
          { label: "감정 교감이나 대화 자체", value: "emotional_labor" },
          { label: "약속이나 시간 조정", value: "logistics" },
          {
            label: "상대의 감정을 돌봐야 한다는 책임감",
            value: "responsibility",
          },
          { label: "모든 상호작용 전반", value: "everything" },
        ],
      },
      {
        index: 3,
        text: "혼자 있는 시간에는 \n 이 피로감이?",
        type: "single",
        options: [
          { label: "거의 없음", value: "relief" },
          { label: "약간 남음", value: "some" },
          { label: "비슷한 수준", value: "same" },
          { label: "더 심함", value: "worse" },
        ],
      },
      {
        index: 4,
        text: "현재 관계들이 \n 나에게 에너지를 주는지 빼는지?",
        type: "single",
        options: [
          { label: "충전해줌", value: "energizing" },
          { label: "중립적", value: "neutral" },
          { label: "약간 빼감", value: "somewhat_draining" },
          { label: "매우 빼감", value: "very_draining" },
        ],
      },
      {
        index: 5,
        text: "관계를 끊거나 \n 거리를 두고 싶어?",
        type: "single",
        options: [
          { label: "아니오", value: "no" },
          { label: "모르겠음", value: "unsure" },
          { label: "어느 정도는 그럼", value: "somewhat" },
          { label: "모두와의 거리를 두고 싶음", value: "distance_all" },
        ],
      },
    ],
  },

  "emotion-1": {
    placeholder: "공허함을 느끼는 상황을 설명해줘",
    example_inputs: [
      "뭔가 부족한 기분이 항상 있어. 좋은 일이 있어도 그 기분이 오래가지 않아.",
      "할 일도 있고, 함께할 사람도 있는데 왜인지 공허해. 이 감정을 뭐라고 표현해야 할지 모르겠어.",
    ],
    questions: [
      {
        index: 1,
        text: "이 공허함이 언제부터 시작됐어?",
        type: "single",
        options: [
          { label: "최근 몇 주", value: "recent" },
          { label: "몇 개월", value: "months" },
          { label: "1년 정도", value: "year" },
          { label: "예전부터 계속", value: "always" },
        ],
      },
      {
        index: 2,
        text: "공허함을 느낄 때는 어떤 상황이야?",
        type: "multiple",
        options: [
          { label: "혼자 있을 때", value: "alone" },
          { label: "사람들 사이에 있을 때", value: "crowd" },
          { label: "일하고 있을 때", value: "work" },
          { label: "여유 시간이 있을 때", value: "free_time" },
          { label: "시간이나 상황 상관없이", value: "always" },
        ],
      },
      {
        index: 3,
        text: "그 공허함을 채우기 위해 주로 뭘 하는 편이야?",
        type: "multiple",
        options: [
          { label: "휴대폰, SNS", value: "phone" },
          { label: "취미 활동", value: "hobby" },
          { label: "음식이나 쇼핑", value: "food" },
          { label: "사람 만나기", value: "people" },
          { label: "잠을 자거나 누워있기", value: "sleep" },
        ],
      },
      {
        index: 4,
        text: "공허함 외에 다른 감정도 함께 있어?",
        type: "multiple",
        options: [
          { label: "슬픔", value: "sad" },
          { label: "불안감", value: "anxious" },
          { label: "피로감", value: "tired" },
          { label: "무기력함", value: "unmotivated" },
          { label: "짜증이나 화", value: "angry" },
        ],
      },
      {
        index: 5,
        text: "이 공허함이 너에게 미치는 영향은?",
        type: "multiple",
        options: [
          { label: "일상적인 의욕이 떨어짐", value: "daily" },
          { label: "수면에 영향을 미침", value: "sleep" },
          { label: "관계에 영향을 미침", value: "relationship" },
          { label: "신체 건강에 영향을 미침", value: "health" },
          { label: "부정적인 대처 행동이 증가", value: "coping" },
        ],
      },
    ],
  },

  "emotion-2": {
    placeholder: "자신과 남을 비교하는 감정에 대해 설명해줄래",
    example_inputs: [
      "SNS를 보면 자꾸 남과 비교하게 돼. 나는 항상 부족한 것 같아.",
      "주변 사람들은 다 잘 살고 있는데, 왜 나만 제자리인 것 같지?",
    ],
    questions: [
      {
        index: 1,
        text: "주로 누구와 비교해?",
        type: "multiple",
        options: [
          { label: "친한 친구나 지인", value: "close" },
          { label: "직장 동료나 경쟁자", value: "work" },
          { label: "SNS에서 본 남들", value: "sns" },
          { label: "형제자매나 가족", value: "family" },
          { label: "유명인이나 인플루언서", value: "celebrity" },
        ],
      },
      {
        index: 2,
        text: "주로 뭘 기준으로 비교해?",
        type: "multiple",
        options: [
          { label: "경제적 성공이나 수입", value: "wealth" },
          { label: "외모나 스타일", value: "appearance" },
          { label: "커리어나 성취", value: "career" },
          { label: "관계나 인간관계", value: "relationships" },
          { label: "전반적인 행복도", value: "happiness" },
        ],
      },
      {
        index: 3,
        text: "비교할 때 드는 감정은?",
        type: "multiple",
        options: [
          { label: "내가 뒤떨어진 것 같은 느낌", value: "inadequate" },
          { label: "우울함이나 절망감", value: "despair" },
          { label: "질투나 분노", value: "resentment" },
          { label: "동기부여", value: "motivation" },
          { label: "무기력함", value: "unmotivated" },
        ],
      },
      {
        index: 4,
        text: "이 비교가 \n 언제부터 심해졌어?",
        type: "single",
        options: [
          { label: "항상 있었음", value: "always" },
          { label: "몇 년 전부터", value: "years" },
          { label: "최근 1년", value: "year" },
          { label: "최근 몇 개월", value: "months" },
        ],
      },
      {
        index: 5,
        text: "비교를 멈추려고 한 \n 노력이 있어?",
        type: "single",
        options: [
          { label: "노력하고 있음", value: "trying" },
          { label: "가끔 노력함", value: "sometimes" },
          { label: "별로 하지 않음", value: "little" },
          { label: "하지 않음", value: "none" },
        ],
      },
    ],
  },

  "emotion-3": {
    placeholder: "감정을 억누르고 있는 자신을 설명해줄래",
    example_inputs: [
      "화나는 일이 많은데, 계속 안으로만 꾸미고 있는 것 같아.",
      "내 감정을 드러내면 안 될 것 같아서 자꾸 숨겨. 그게 계속 쌓이고 있어.",
    ],
    questions: [
      {
        index: 1,
        text: "주로 어떤 감정을 \n 억누르는 편이야?",
        type: "multiple",
        options: [
          { label: "화나 분노", value: "anger" },
          { label: "슬픔이나 눈물", value: "sadness" },
          { label: "두려움이나 불안", value: "fear" },
          { label: "외로움이나 공허함", value: "loneliness" },
          { label: "모든 감정", value: "all" },
        ],
      },
      {
        index: 2,
        text: "감정을 억누르는 이유는?",
        type: "multiple",
        options: [
          { label: "타인을 상처 주고 싶지 않아서", value: "protect_others" },
          { label: "나의 약함을 드러내기 싫어서", value: "protect_image" },
          { label: "상황이 더 악화될까봐", value: "fear_escalation" },
          { label: "상대가 받아주지 않을 것 같아서", value: "not_accepted" },
          { label: "습관처럼 되어버렸음", value: "habit" },
        ],
      },
      {
        index: 3,
        text: "억누른 감정이 \n 신체에 나타나는 방식은?",
        type: "multiple",
        options: [
          { label: "두통이나 복통", value: "pain" },
          { label: "피로감이나 무기력", value: "fatigue" },
          { label: "수면 문제", value: "sleep" },
          { label: "근육 경직이나 긴장", value: "tension" },
          { label: "특별히 나타나는 게 없음", value: "none" },
        ],
      },
      {
        index: 4,
        text: "억누른 감정이 \n 갑자기 폭발한 적이 있어?",
        type: "single",
        options: [
          { label: "자주 있음", value: "often" },
          { label: "가끔 있음", value: "sometimes" },
          { label: "드물게 있음", value: "rarely" },
          { label: "없음", value: "never" },
        ],
      },
      {
        index: 5,
        text: "감정을 표현하는 것에 \n 대해 어떻게 생각해?",
        type: "single",
        options: [
          { label: "필요하고 건강하다고 생각함", value: "necessary" },
          { label: "어느 정도는 괜찮다고 생각함", value: "okay" },
          { label: "위험하거나 민폐라고 생각함", value: "risky" },
          { label: "모르겠음", value: "unsure" },
        ],
      },
    ],
  },

  "emotion-4": {
    placeholder: "예민함이 뭔가 신호를 주고 있는 것 같은데, 설명해줄래",
    example_inputs: [
      "작은 일에도 자꾸 반응하는데, 이게 뭔가 바꿔야 한다는 신호일 수도 있어.",
      "평소보다 예민해진 게 이상하다. 뭔가 내 마음이 아파하는 건 아닐까?",
    ],
    questions: [
      {
        index: 1,
        text: "예민함이 \n 언제부터 시작됐어?",
        type: "single",
        options: [
          { label: "갑자기 시작됨", value: "sudden" },
          { label: "몇 주 전부터", value: "weeks" },
          { label: "몇 개월 전부터", value: "months" },
          { label: "원래 그런 성향인 것 같음", value: "always" },
        ],
      },
      {
        index: 2,
        text: "예민한 반응의 패턴은?",
        type: "multiple",
        options: [
          { label: "작은 비판에 크게 상처받음", value: "criticism" },
          { label: "무시당한다고 느낌", value: "dismissal" },
          { label: "거절에 과민하게 반응", value: "rejection" },
          { label: "타인의 감정에 예민해짐", value: "others_emotions" },
          { label: "특정 주제나 상황에서만", value: "specific" },
        ],
      },
      {
        index: 3,
        text: "최근 변한 일들이 있어?",
        type: "multiple",
        options: [
          { label: "스트레스 많은 일 발생", value: "stress" },
          { label: "중요한 관계 변화", value: "relationship_change" },
          { label: "신체 건강의 변화", value: "health" },
          { label: "커리어나 일의 변화", value: "work" },
          { label: "특별한 변화는 없음", value: "none" },
        ],
      },
      {
        index: 4,
        text: "예민함을 느낄 때 \n 주로 뭘 하는 편이야?",
        type: "multiple",
        options: [
          { label: "혼자 고민함", value: "alone" },
          { label: "상대에게 감정을 드러냄", value: "express" },
          { label: "상황을 피함", value: "avoid" },
          { label: "다른 일로 눙쳐놓음", value: "distract" },
          { label: "신체적 활동으로 풀음", value: "physical" },
        ],
      },
      {
        index: 5,
        text: "이 예민함이 뭔가 \n 바뀌어야 한다는 신호일 것 같아?",
        type: "single",
        options: [
          { label: "그렇다고 느낌", value: "yes" },
          { label: "어느 정도는 그런 것 같음", value: "somewhat" },
          { label: "확실하지 않음", value: "unsure" },
          { label: "아니라고 생각함", value: "no" },
        ],
      },
    ],
  },

  "emotion-5": {
    placeholder: "지금 느끼는 무기력함의 성질을 설명해줄래",
    example_inputs: [
      "뭔가 하고 싶은 게 없어. 이게 우울증인가 싶기도 해.",
      "할 일이 있는데 손을 못 쓰겠어. 에너지가 없는 것 같아.",
    ],
    questions: [
      {
        index: 1,
        text: "무기력함이 \n 어디부터 시작된 것 같아?",
        type: "single",
        options: [
          { label: "갑자기", value: "sudden" },
          { label: "천천히 쌓여서", value: "gradual" },
          { label: "특정 사건 이후", value: "event" },
          { label: "원래부터 있었던 것", value: "chronic" },
        ],
      },
      {
        index: 2,
        text: "무기력할 때 \n 주로 다음과 같은 상태야?",
        type: "multiple",
        options: [
          { label: "신체가 무거우고 움직이기 어려움", value: "physical" },
          { label: "흥미나 즐거움을 느끼지 못함", value: "anhedonia" },
          { label: "결정을 내리기 어려움", value: "decision" },
          { label: "앞날에 대한 희망이 없음", value: "hopeless" },
          { label: "모든 것이 의미 없어 보임", value: "meaningless" },
        ],
      },
      {
        index: 3,
        text: "무기력함을 느낄 때 \n 영향받는 영역은?",
        type: "multiple",
        options: [
          { label: "일이나 공부", value: "work_study" },
          { label: "관계나 사회활동", value: "social" },
          { label: "자기관리 (위생, 식사 등)", value: "self_care" },
          { label: "신체 건강 (운동, 수면)", value: "health" },
          { label: "모든 영역", value: "all" },
        ],
      },
      {
        index: 4,
        text: "현재 상황이나 환경이 \n 이 무기력함을 심하게 만들고 있다고 생각해?",
        type: "single",
        options: [
          { label: "매우 그렇다", value: "yes_very" },
          { label: "어느 정도는 그렇다", value: "yes_somewhat" },
          { label: "관계없을 것 같다", value: "no" },
          { label: "모르겠다", value: "unsure" },
        ],
      },
      {
        index: 5,
        text: "무기력감이 \n 얼마나 강하고 오래 지속돼?",
        type: "single",
        options: [
          { label: "가끔 느껴짐", value: "occasional" },
          { label: "자주 느껴짐", value: "frequent" },
          { label: "거의 항상 있음", value: "constant" },
          { label: "점점 심해지고 있음", value: "worsening" },
        ],
      },
    ],
  },
};

// ── 기본 템플릿 (설정되지 않은 콘텐츠용) ────────────────────────────
const DEFAULT_INPUT_CONFIG: InputConfig = {
  placeholder: "지금 상황을 편하게 적어줘",
  example_inputs: [
    "상황을 구체적으로 설명해줄수록, AI가 더 정확하게 이해할 수 있어.",
    "감정뿐만 아니라 행동, 시간, 배경 등도 함께 적으면 좋아.",
  ],
  questions: [
    {
      index: 1,
      text: "이 상황이 얼마나 자주 일어나?",
      type: "single",
      options: [
        { label: "거의 매일", value: "daily" },
        { label: "자주", value: "frequent" },
        { label: "가끔", value: "sometimes" },
        { label: "드물게", value: "rarely" },
      ],
    },
    {
      index: 2,
      text: "이 상황이 얼마나 오래됐어?",
      type: "single",
      options: [
        { label: "최근 몇 주", value: "recent" },
        { label: "몇 개월", value: "months" },
        { label: "1년 이상", value: "year" },
        { label: "예전부터", value: "longterm" },
      ],
    },
    {
      index: 3,
      text: "이것이 너에게 미치는 영향 정도는?",
      type: "single",
      options: [
        { label: "거의 영향 없음", value: "minimal" },
        { label: "어느 정도 영향", value: "some" },
        { label: "상당한 영향", value: "significant" },
        { label: "매우 큰 영향", value: "severe" },
      ],
    },
    {
      index: 4,
      text: "이 상황에 대해 누군가와 대화한 적이 있어?",
      type: "single",
      options: [
        { label: "없음", value: "no" },
        { label: "누군가와 얘기함", value: "someone" },
        { label: "전문가와 얘기함", value: "professional" },
        { label: "여러 명과 얘기함", value: "multiple" },
      ],
    },
    {
      index: 5,
      text: "이 상황을 해결하기 위해 뭔가 시도해본 적이 있어?",
      type: "single",
      options: [
        { label: "시도한 적 없음", value: "no" },
        { label: "시도해봤음", value: "tried" },
        { label: "계속 시도 중", value: "ongoing" },
        { label: "시도했지만 포기했음", value: "gave_up" },
      ],
    },
  ],
};

// TODO: [백엔드 연동] content_id로 GET /api/contents/[id]를 호출해 input_config 반환
export function getInputConfig(content_id: string): InputConfig {
  return DUMMY_INPUT_CONFIGS[content_id] ?? DEFAULT_INPUT_CONFIG;
}
