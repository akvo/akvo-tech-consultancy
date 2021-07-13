FROM python:3.8.0-slim-buster

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN set -e; \
    pip install --no-cache-dir -r requirements.txt && \
    pip check

COPY . .

CMD ["python", "app.py"]
