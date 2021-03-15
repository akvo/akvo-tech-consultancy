FROM amancevice/pandas:0.24.2-slim
WORKDIR /repo
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY webform-dump.py .
ENTRYPOINT ["python","webform-dump.py"]
