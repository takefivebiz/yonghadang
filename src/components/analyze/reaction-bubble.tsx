"use client";

import { useEffect, useState } from "react";

interface ReactionBubbleProps {
  messages: string[];
  onComplete: () => void;
  completedSteps?: number;
}

const ReactionBubble = ({
  messages,
  onComplete,
  completedSteps = 0,
}: ReactionBubbleProps) => {
  const [visibleMessages, setVisibleMessages] = useState<boolean[]>(
    Array(messages.length).fill(false),
  );

  useEffect(() => {
    const delays = [100, 800, 1800];
    const timers = delays.map((delay, idx) =>
      setTimeout(() => {
        setVisibleMessages((prev) => {
          const newState = [...prev];
          newState[idx] = true;
          return newState;
        });
      }, delay),
    );

    const fadeOutTimer = setTimeout(() => {
      setVisibleMessages(Array(messages.length).fill(false));
    }, 3000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6 sm:px-6 relative">
      {/* Progress indicator */}
      <div className="mb-12 flex items-center gap-3 justify-center">
        <div className="flex items-center gap-1">
          {Array.from({ length: 7 }).map((_, idx) => {
            const isCompleted = idx < completedSteps;

            return (
              <div key={idx} className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isCompleted
                      ? "rgba(209, 109, 172, 0.5)"
                      : "rgba(255, 255, 255, 0.08)",
                  }}
                />
                {idx < 6 && (
                  <div
                    className="h-px"
                    style={{
                      width: "20px",
                      backgroundColor: isCompleted
                        ? "rgba(209, 109, 172, 0.2)"
                        : "rgba(255, 255, 255, 0.04)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reaction bubbles */}
      <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col items-start gap-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              opacity: visibleMessages[idx] ? 1 : 0,
              transform: visibleMessages[idx]
                ? "translateY(0)"
                : "translateY(12px)",
              transition: "opacity 900ms ease-out, transform 900ms ease-out",
              marginLeft: "1rem",
              marginTop: idx === 0 ? "3rem" : "0",
            }}
          >
            <div
              className="rounded-2xl px-5 py-4 sm:px-6 sm:py-5"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                maxWidth: "320px",
              }}
            >
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{
                  color: "rgba(249, 249, 229, 0.75)",
                }}
              >
                {msg}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionBubble;
