"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ProgressStep } from "@/lib/types";

interface Props {
  steps: ProgressStep[];
}

export default function ProgressTracker({ steps }: Props) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  return (
    <div className="w-full space-y-2">
      {steps.map((step, i) => {
        const hasContent = !!step.content;
        const isExpanded = expandedKey === step.key;

        return (
          <div key={step.key} className="card overflow-hidden">
            {/* Step header */}
            <button
              onClick={() => {
                if (hasContent) setExpandedKey(isExpanded ? null : step.key);
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 md:px-5 md:py-3.5 text-left transition-colors ${
                hasContent
                  ? "active:bg-[var(--bg-card)] md:hover:bg-[var(--bg-card)] cursor-pointer"
                  : "cursor-default"
              }`}
            >
              {/* Status icon */}
              <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                {step.status === "done" && (
                  <div className="w-6 h-6 rounded-full bg-[var(--success)]/20 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-[var(--success)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
                {step.status === "running" && (
                  <div className="w-6 h-6 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
                )}
                {step.status === "pending" && (
                  <div className="w-6 h-6 rounded-full border-2 border-[var(--border)]" />
                )}
              </div>

              {/* Label */}
              <span
                className={`flex-1 text-sm md:text-base ${
                  step.status === "done"
                    ? "text-[var(--text-primary)]"
                    : step.status === "running"
                    ? "text-[var(--primary)] font-medium"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {step.label}
                {step.status === "running" && "..."}
              </span>

              {/* Expand arrow (only if has content) */}
              {hasContent && (
                <svg
                  className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>

            {/* Expandable content */}
            {isExpanded && hasContent && (
              <div className="border-t border-[var(--border-light)] px-4 py-4 md:px-5 md:py-5">
                <div className="prose prose-sm md:prose-base max-h-80 overflow-y-auto">
                  <ReactMarkdown>{step.content!}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
