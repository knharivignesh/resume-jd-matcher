from celery import shared_task
from flask import current_app
from app.resume_job import ResumeJob


@shared_task(ignore_result=False)
def start_resume_parsing(resume_data: dict) -> dict:
    """function ap_upgrade_apply_revoke
    celery task apply or revoke policy for the give wm urls.

    Keyword arguments:
    argument -- ap_upgrade: ApTaskArgs
    Return: json success/Fail state and message
    """
    try:
        resume_job = ResumeJob(resume_data.get("job_id"))
        resume_job.generate_ats_score()
        resume_job.parse_resume()
        resume_job.write_config("is_loading", False)
    except Exception as error:
        current_app.logger.error(f"Error in parsing resume: {error}")
