FROM python:3.13.2-slim

WORKDIR /py_api

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

USER appuser

COPY . .

CMD ["gunicorn","-w 2", "-t 6000", "-b 0.0.0.0:8000", "run:flask_app"]