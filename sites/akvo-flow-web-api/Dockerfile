FROM amancevice/pandas:0.24.2-slim

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN set -e; \
    pip install --no-cache-dir -r requirements.txt && \
    pip check

COPY . .

CMD ["sh", "./run.sh"]
