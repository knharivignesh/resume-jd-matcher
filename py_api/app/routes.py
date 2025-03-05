from flask import Blueprint, request, current_app
from .utils import Utils
import os, sys
from app.config import Config

base_api = Blueprint("base_api", __name__)

os.makedirs(Config.UPLOAD_PATH, exist_ok=True)


@base_api.route("/process-resume", methods=["POST"])
def process_resume() -> dict[str, object]:
    doc = request.files["pdf_file"]
    doc.save(os.path.join(Config.UPLOAD_PATH, "file.pdf"))
    doc_path = os.path.join(Config.UPLOAD_PATH, "file.pdf")
    data = Utils.read_file_from_path(doc_path)

    return Utils.parse_resume(data)
