from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException

from app.models import AnalysisRequest, AnalysisJob, JobSummary
from app.services.analysis_service import analysis_service
from app.middleware.auth import get_current_user_id

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.post("", status_code=202, response_model=AnalysisJob)
async def start_analysis(
    req: AnalysisRequest,
    bg: BackgroundTasks,
    user_id: str = Depends(get_current_user_id),
):
    job = analysis_service.create_job(req, user_id=user_id)
    bg.add_task(analysis_service.run_analysis, job.id)
    return job


@router.get("", response_model=list[JobSummary])
async def list_analyses(user_id: str = Depends(get_current_user_id)):
    return analysis_service.list_jobs(user_id=user_id)


@router.get("/{job_id}", response_model=AnalysisJob)
async def get_analysis(
    job_id: str,
    user_id: str = Depends(get_current_user_id),
):
    job = analysis_service.get_job(job_id, user_id=user_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
