import { NextResponse } from "next/server";
import staticData from "@/data/static-analyses.json";

type StaticAnalysis = (typeof staticData)[number];

// GET /api/analysis - List all analyses
export async function GET() {
  const summaries = staticData.map((job: StaticAnalysis) => ({
    id: job.id,
    status: job.status,
    ticker: job.ticker,
    date: job.date,
    analysts: job.analysts,
    llm_provider: job.llm_provider,
    signal: job.result?.signal ?? null,
    created_at: job.created_at,
    completed_at: job.completed_at,
    error: job.error,
  }));
  return NextResponse.json(summaries);
}

// POST /api/analysis - Not supported in static mode
export async function POST() {
  return NextResponse.json(
    { error: "靜態模式不支援新增分析，請在本地啟動 backend" },
    { status: 503 }
  );
}
