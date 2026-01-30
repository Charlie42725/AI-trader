from fastapi import APIRouter, BackgroundTasks, HTTPException

from app.models import AnalysisRequest, AnalysisJob, JobSummary
from app.services.analysis_service import analysis_service

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.post("", status_code=202, response_model=AnalysisJob)
async def start_analysis(req: AnalysisRequest, bg: BackgroundTasks):
    job = analysis_service.create_job(req)
    bg.add_task(analysis_service.run_analysis, job.id)
    return job


@router.get("", response_model=list[JobSummary])
async def list_analyses():
    return analysis_service.list_jobs()


@router.get("/{job_id}", response_model=AnalysisJob)
async def get_analysis(job_id: str):
    job = analysis_service.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
