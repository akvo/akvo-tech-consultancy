FROM mhart/alpine-node:11 AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "8080", "-s", "."]
