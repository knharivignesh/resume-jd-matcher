from flask import Flask
from celery import Celery, Task
from flask import Flask
from app.config import Config
from .routes import base_api
from logging.config import dictConfig


def create_app() -> Flask:
    """create_app
    Create flask instance of swap application.

    Keyword arguments:
    argument -- config_class
    Return: app instance of swap
    """

    dictConfig(
        {
            "version": 1,
            "formatters": {
                "default": {"format": "%(asctime)s %(levelname)s: %(message)s"}
            },
            "handlers": {
                "wsgi": {"class": "logging.StreamHandler", "formatter": "default"}
            },
            "root": {"level": "INFO", "handlers": ["wsgi"]},
        }
    )

    app = Flask(__name__)
    app.logger.info("SWAP API create app and config completed!")

    app.config.from_mapping(
        CELERY=dict(
            broker_url=Config.CELERY_BROKER_URL,
            result_backend=Config.CELERY_RESULT_BACKEND,
            task_ignore_result=False,
        ),
    )
    app.config.from_prefixed_env()
    app.logger.info("Celery app init completed!")

    # from swapapi.cm.routes import cm
    app.logger.info("SWAP API blueprint import completed!")

    app.register_blueprint(base_api)
    app.logger.info("SWAP API blueprint register completed!")

    app.config.from_object("app.config.Config")

    return app


def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object("app.config.Config")
    celery_app.set_default()
    app.extensions["celery"] = celery_app

    return celery_app
