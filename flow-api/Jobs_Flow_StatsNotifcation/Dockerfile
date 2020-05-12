FROM python:3.6.6-jessie
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib

COPY . .

CMD ["./run.sh"]
