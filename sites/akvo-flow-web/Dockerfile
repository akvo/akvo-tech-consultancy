FROM mhart/alpine-node:12 AS builder
WORKDIR /app
COPY . .
RUN yarn install 
RUN yarn run build

FROM mhart/alpine-node:12
RUN yarn global add serve
WORKDIR /app
CMD ["serve", "-p", "80", "-s", "build"]
