"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export default function ReportSection({ title, content, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  if (!content) return null;

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3.5 md:px-5 md:py-4 text-left active:bg-[var(--bg-card)] md:hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
      >
        <span className="font-medium text-sm md:text-base">{title}</span>
        <svg
          className={`w-5 h-5 md:w-6 md:h-6 text-[var(--text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-[var(--border-light)] px-4 py-4 md:px-5 md:py-5">
          <div className="prose prose-sm md:prose-base">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
