"use server";

import { AnalyzeAnswers } from "@/lib/types/analyze";
import { CONTENTS } from "@/lib/data/contents";

// 공유 ID로부터 분석 데이터 조회
export async function getShareData(shareId: string) {
  try {
    // TODO: [백엔드 연동] 실제 API에서 share_id로 analyzeData 조회
    // const response = await fetch(`/api/share/${shareId}`);
    // const data = await response.json();

    // 현재는 더미: share_id = session_id로 가정
    // 실제 구현 시 아래 로직 제거 후 API 호출로 대체
    const dummyData: AnalyzeAnswers = {
      session_id: shareId,
      content_id: "love-1", // 첫 번째 콘텐츠 기본값
      free_input: "",
      answers: [],
      created_at: new Date().toISOString(),
    };

    return dummyData;
  } catch {
    return null;
  }
}

interface ShareMetadata {
  title: string;
  description: string;
  imageUrl: string;
}

// 공유 페이지용 OG 메타 데이터 생성 (콘텐츠 정보 기반)
export async function getShareMetadata(shareId: string): Promise<ShareMetadata> {
  try {
    const analyzeData = await getShareData(shareId);

    if (!analyzeData) {
      return {
        title: "Veil",
        description: "당신의 에너지를 분석해보세요.",
        imageUrl: "",
      };
    }

    const content = CONTENTS.find(
      (c) => c.id === analyzeData.content_id,
    );

    if (!content) {
      return {
        title: "Veil",
        description: "당신의 에너지를 분석해보세요.",
        imageUrl: "",
      };
    }

    return {
      title: content.title,
      description: content.subtitle || "당신의 에너지를 분석해보세요.",
      imageUrl: content.thumbnail_url || "",
    };
  } catch {
    return {
      title: "Veil",
      description: "당신의 에너지를 분석해보세요.",
      imageUrl: "",
    };
  }
}
