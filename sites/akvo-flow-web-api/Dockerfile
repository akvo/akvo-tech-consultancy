FROM amancevice/pandas:1.0.0-slim

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN set -e; \
    pip install --no-cache-dir -r requirements.txt && \
    pip check

COPY . .

CMD ["sh", "./run.sh"]
