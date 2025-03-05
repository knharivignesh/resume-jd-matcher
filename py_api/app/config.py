import os


class Config:
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
    CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0")
    OPEN_AI_KEY = os.getenv(
        "OPEN_AI_KEY",
        "key",
    )
    UPLOAD_PATH = "__DATA__"
