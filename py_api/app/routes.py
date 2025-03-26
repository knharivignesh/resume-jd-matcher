from flask import Blueprint, request, current_app, send_file
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
    try:
        resume_job = ResumeJob(job_id)
        return resume_job.read_config()
    except Exception as e:
        current_app.logger.error(f"Error in getting resume config: {e}")
        return {"error": f"Error in getting resume data: {e}"}


@base_api.route("/generate-resume/<job_id>/template/<template_id>", methods=["POST"])
def write_pdf(job_id: str, template_id: str):
    resume_job = ResumeJob(job_id)
    resume_data = request.form.get("resume_data")

    resume_job.generate_final_pdf(template_id, resume_data)
    path = os.path.join(
        "..",
        Config.UPLOAD_PATH,
        job_id,
        f"{template_id}_{Config.PROCESSED_RESUME_FILE}",
    )
    return send_file(path, as_attachment=True)
