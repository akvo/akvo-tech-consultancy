FROM mhart/alpine-node:12
WORKDIR /app
COPY . .
RUN yarn build
RUN yarn install 
RUN yarn global add serve
CMD ["serve", "-p", "8080", "-s", "build"]
