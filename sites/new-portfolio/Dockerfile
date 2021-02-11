FROM node:12.18.2-slim AS devel
WORKDIR /app
COPY ./package*.json ./
RUN npm install

FROM node:12.18.2-slim AS build
WORKDIR /app
COPY . .
COPY --from=devel /app/node_modules ./node_modules
RUN npm run build

FROM node:12.18.2-slim
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build .
CMD ["serve", "-p", "8080", "-s", "."]
