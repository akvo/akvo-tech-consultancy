FROM python:3.6.6-jessie
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --upgrade pip wheel && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

RUN ["./test.sh"]
CMD ["sh","./run.sh"]
