FROM python:3.6.6-jessie
WORKDIR /usr/src/app

RUN apt-get update && \
      apt-get -y install sudo
RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo<Paste>
USER docker
RUN sudo apt-get install -y postgresql-client

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["./migrate.sh"]
