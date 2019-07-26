FROM mhart/alpine-node:12
WORKDIR /app
COPY --from=0 /app .
COPY . .
RUN yarn build
RUN yarn install 
RUN yarn global add serve
CMD ["serve", "-p", "8080", "-s", "."]
