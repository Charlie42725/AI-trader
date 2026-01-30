import { AnalysisJob, AnalysisRequest, JobSummary } from "./types";
import { mockApi, USE_MOCK } from "./mock";

const BASE = "/api/analysis";

export async function startAnalysis(req: AnalysisRequest): Promise<{ id: string }> {
  if (USE_MOCK) {
    return mockApi.startAnalysis(req);
  }
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`啟動失敗: ${res.status}`);
  return res.json();
}

export async function listAnalyses(): Promise<JobSummary[]> {
  if (USE_MOCK) {
    return mockApi.listAnalyses();
  }
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`載入失敗: ${res.status}`);
  return res.json();
}

export async function getAnalysis(id: string): Promise<AnalysisJob> {
  if (USE_MOCK) {
    return mockApi.getAnalysis(id);
  }
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error(`取得失敗: ${res.status}`);
  return res.json();
}
