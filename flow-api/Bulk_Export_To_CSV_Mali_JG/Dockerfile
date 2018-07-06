FROM amancevice/pandas:0.23.0-python3-slim

RUN pip install requests

COPY run.sh /app/
COPY FlowApi.py /app/

WORKDIR /app

CMD ./run.sh