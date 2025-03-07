from flask import Blueprint, request, current_app
import os
from app.config import Config
from app.resume_job import ResumeJob
from app.tasks import start_resume_parsing

base_api = Blueprint("base_api", __name__)

os.makedirs(Config.UPLOAD_PATH, exist_ok=True)


@base_api.route("/resume-job", methods=["POST"])
def process_resume() -> dict[str, object]:
    try:
        job_description = request.form.get("job_description")
        doc = request.files["pdf_file"]
    except Exception as e:
        current_app.logger.error(f"Error in processing resume: {e}")
        return {"error": "Error in processing resume"}

    resume_job = ResumeJob()
    resume_job.create_job(doc, job_description)

    start_resume_parsing.delay({"job_id": resume_job.id})

    return {"job_id": resume_job.id}


@base_api.route("/resume-job/<job_id>", methods=["GET"])
def get_resume_details(job_id: str) -> dict[str, object]:
    resume_job = ResumeJob(job_id)
    return resume_job.read_config()
