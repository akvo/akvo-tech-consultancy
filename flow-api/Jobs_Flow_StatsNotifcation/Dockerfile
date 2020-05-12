FROM python:3.6.6-jessie
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
RUN sh -c 'echo $TOKEN_PICKLE | base64 -d > ./token.pickle'

COPY . .

CMD ["sh", "./run.sh"]
