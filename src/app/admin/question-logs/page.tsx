"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Copy, Trash2, Flag } from "lucide-react";
import { DUMMY_QUESTION_LOGS } from "@/lib/dummy-admin";
import type { QuestionLog } from "@/types/admin";

// Note: 클라이언트 컴포넌트에서는 metadata를 내보낼 수 없으므로
// 부모 layout에서 처리되어야 함

const getStatusLabel = (status: string) => {
  const labels: Record<string, { label: string; color: string }> = {
    active: { label: "활성", color: "#00D084" },
    duplicate: { label: "중복", color: "#FFA500" },
    flagged: { label: "검토 필요", color: "#FFD700" },
    blacklisted: { label: "차단됨", color: "#FF6B6B" },
  };
  return labels[status] || labels.active;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle2 size={16} />;
    case "duplicate":
    case "flagged":
      return <Flag size={16} />;
    case "blacklisted":
      return <AlertCircle size={16} />;
    default:
      return null;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 질문 생성 로그 페이지 (8-10).
 * AI가 생성한 질문 로그 조회, 필터링, 블랙리스트 처리.
 *
 * TODO: [백엔드 연동] /api/admin/question-logs 실제 호출로 교체
 */
const QuestionLogsPage = () => {
  const [logs, setLogs] = useState<QuestionLog[]>(DUMMY_QUESTION_LOGS);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 상태 필터링
  const filteredLogs =
    filterStatus === "all"
      ? logs
      : logs.filter((log) => log.status === filterStatus);

  // 블랙리스트 처리 (더미 구현)
  const handleBlacklist = (id: string) => {
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, status: "blacklisted" as const } : log
      )
    );
    setSelectedId(null);
    // TODO: [백엔드 연동] PATCH /api/admin/question-logs/[id] 호출
  };

  // 중복 표시 (더미 구현)
  const handleMarkDuplicate = (id: string) => {
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, status: "duplicate" as const } : log
      )
    );
    setSelectedId(null);
    // TODO: [백엔드 연동] PATCH /api/admin/question-logs/[id] 호출
  };

  // 복사 (더미 구현)
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F0E6FA" }}>
          질문 생성 로그
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#B8A8D8" }}>
          AI가 생성한 질문을 검토하고 필요시 필터링합니다.
        </p>
      </div>

      {/* 필터 바 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "all" ? "" : ""
          }`}
          style={{
            background:
              filterStatus === "all"
                ? "rgba(100, 149, 237, 0.3)"
                : "rgba(100, 149, 237, 0.1)",
            color: "#F0E6FA",
            border:
              filterStatus === "all"
                ? "1px solid rgba(100, 149, 237, 0.5)"
                : "1px solid rgba(100, 149, 237, 0.2)",
          }}
        >
          전체 ({logs.length})
        </button>

        {["active", "duplicate", "flagged", "blacklisted"].map((status) => {
          const count = logs.filter((log) => log.status === status).length;
          const statusInfo = getStatusLabel(status);
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background:
                  filterStatus === status
                    ? `${statusInfo.color}20`
                    : "rgba(100, 149, 237, 0.1)",
                color: filterStatus === status ? statusInfo.color : "#B8A8D8",
                border:
                  filterStatus === status
                    ? `1px solid ${statusInfo.color}80`
                    : "1px solid rgba(100, 149, 237, 0.2)",
              }}
            >
              {statusInfo.label} ({count})
            </button>
          );
        })}
      </div>

      {/* 로그 테이블 */}
      <div
        className="rounded-2xl shadow-sm overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
          border: "1px solid rgba(230, 230, 250, 0.15)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(230, 230, 250, 0.2)",
                }}
              >
                <th className="px-4 py-4 text-left font-semibold" style={{ color: "#B8A8D8" }}>
                  상태
                </th>
                <th className="px-4 py-4 text-left font-semibold" style={{ color: "#B8A8D8" }}>
                  생성 질문
                </th>
                <th className="px-4 py-4 text-center font-semibold" style={{ color: "#B8A8D8" }}>
                  세션 ID
                </th>
                <th className="px-4 py-4 text-left font-semibold" style={{ color: "#B8A8D8" }}>
                  사유
                </th>
                <th className="px-4 py-4 text-right font-semibold" style={{ color: "#B8A8D8" }}>
                  작성일
                </th>
                <th className="px-4 py-4 text-right font-semibold" style={{ color: "#B8A8D8" }}>
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const statusInfo = getStatusLabel(log.status);
                const isSelected = selectedId === log.id;

                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedId(isSelected ? null : log.id)}
                    className="cursor-pointer hover:bg-opacity-30 transition-colors"
                    style={{
                      borderBottom: "1px solid rgba(230, 230, 250, 0.1)",
                      background: isSelected
                        ? "rgba(100, 149, 237, 0.15)"
                        : "transparent",
                    }}
                  >
                    {/* 상태 */}
                    <td className="px-4 py-4">
                      <div
                        className="flex items-center gap-2 w-fit px-3 py-1 rounded-full"
                        style={{
                          background: `${statusInfo.color}20`,
                          color: statusInfo.color,
                        }}
                      >
                        {getStatusIcon(log.status)}
                        <span className="text-xs font-medium">
                          {statusInfo.label}
                        </span>
                      </div>
                    </td>

                    {/* 질문 텍스트 */}
                    <td className="px-4 py-4 max-w-xs" style={{ color: "#D8C9E8" }}>
                      <p className="line-clamp-2">{log.questionText}</p>
                    </td>

                    {/* 세션 ID */}
                    <td className="px-4 py-4 text-center" style={{ color: "#B8A8D8" }}>
                      <code className="text-xs font-mono">
                        {log.sessionId.substring(0, 8)}...
                      </code>
                    </td>

                    {/* 사유 */}
                    <td className="px-4 py-4" style={{ color: "#B8A8D8" }}>
                      <p className="text-xs">
                        {log.flagReason && (
                          <span style={{ color: "#FFD700" }}>
                            {log.flagReason}
                          </span>
                        )}
                      </p>
                    </td>

                    {/* 작성일 */}
                    <td className="px-4 py-4 text-right text-xs" style={{ color: "#B8A8D8" }}>
                      {formatDate(log.createdAt)}
                    </td>

                    {/* 작업 */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(log.questionText);
                          }}
                          className="p-1 hover:bg-opacity-50 rounded transition-colors"
                          style={{
                            color: "#6495ED",
                          }}
                          title="복사"
                        >
                          <Copy size={16} />
                        </button>
                        {log.status !== "blacklisted" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBlacklist(log.id);
                            }}
                            className="p-1 hover:bg-opacity-50 rounded transition-colors"
                            style={{
                              color: "#FF6B6B",
                            }}
                            title="차단"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 선택된 로그 상세 */}
      {selectedId && (
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          {(() => {
            const log = logs.find((l) => l.id === selectedId)!;
            const statusInfo = getStatusLabel(log.status);

            return (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: "#F0E6FA" }}>
                      {log.questionText}
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: "#B8A8D8" }}>
                      세션: <code className="text-xs font-mono">{log.sessionId}</code>
                    </p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${statusInfo.color}20`,
                      color: statusInfo.color,
                    }}
                  >
                    {statusInfo.label}
                  </div>
                </div>

                {log.flagReason && (
                  <div
                    className="rounded-lg p-3 text-sm"
                    style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "1px solid rgba(255, 215, 0, 0.2)",
                      color: "#FFD700",
                    }}
                  >
                    <strong>플래그 사유:</strong> {log.flagReason}
                  </div>
                )}

                {log.adminNote && (
                  <div
                    className="rounded-lg p-3 text-sm"
                    style={{
                      background: "rgba(100, 149, 237, 0.1)",
                      border: "1px solid rgba(100, 149, 237, 0.2)",
                      color: "#D8C9E8",
                    }}
                  >
                    <strong>관리자 메모:</strong> {log.adminNote}
                  </div>
                )}

                <div className="text-xs text-right" style={{ color: "#B8A8D8" }}>
                  생성: {formatDate(log.createdAt)} | 수정:{" "}
                  {formatDate(log.updatedAt)}
                </div>

                {log.status !== "blacklisted" && (
                  <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "rgba(230, 230, 250, 0.1)" }}>
                    <button
                      onClick={() => handleMarkDuplicate(selectedId)}
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        background: "rgba(255, 165, 0, 0.2)",
                        color: "#FFA500",
                        border: "1px solid rgba(255, 165, 0, 0.3)",
                      }}
                    >
                      중복 표시
                    </button>
                    <button
                      onClick={() => handleBlacklist(selectedId)}
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        background: "rgba(255, 107, 107, 0.2)",
                        color: "#FF6B6B",
                        border: "1px solid rgba(255, 107, 107, 0.3)",
                      }}
                    >
                      차단하기
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default QuestionLogsPage;
