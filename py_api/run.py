from app import create_app, celery_init_app

flask_app = create_app()
celery_init_app(flask_app)
celery_app = flask_app.extensions["celery"]


if __name__ == "__main__":
    flask_app.run(debug=True, host="0.0.0.0", port=8000)
