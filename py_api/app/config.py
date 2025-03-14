import os


class Config:
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
    CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0")
    OPEN_AI_KEY = os.getenv(
        "OPEN_AI_KEY",
        "key",
    )
    UPLOAD_PATH = "__DATA__"
    RESUME_JOB_CONFIG = "config.json"
    INITIAL_RESUME_FILE = "initial_resume.pdf"
    PROCESSED_RESUME_FILE = "final_resume.pdf"
    OUTPUT_RESUME_HTML = "output_resume.html"
    TEMPLATE_PATH = "templates"
