FROM amancevice/pandas:0.23.0-python3-slim

RUN set -ex; apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests \
    wget && \
    rm -rf /var/lib/apt/lists/*

RUN pip install requests

COPY run.sh /app/
COPY FlowApi.py /app/

WORKDIR /app

CMD ./run.sh