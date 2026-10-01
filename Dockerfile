FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm install -g bun
RUN bun install
EXPOSE 3000

CMD ["bun", "start:dev"]

