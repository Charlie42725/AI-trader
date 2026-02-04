import { NextResponse } from "next/server";
import staticData from "@/data/static-analyses.json";

type StaticAnalysis = (typeof staticData)[number];

// GET /api/analysis/[id] - Get single analysis
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = staticData.find((j: StaticAnalysis) => j.id === id);

  if (!job) {
    return NextResponse.json({ detail: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}
