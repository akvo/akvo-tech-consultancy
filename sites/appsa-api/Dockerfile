FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN webpack

FROM amancevice/pandas:0.24.2-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["sh", "./run.sh"]
