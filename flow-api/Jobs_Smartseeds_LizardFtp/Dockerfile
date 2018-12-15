FROM python:3.6.6-jessie
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get install p7zip-full

COPY . .

CMD ["sh", "./run.sh"]
