FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm install -g bun
RUN bun build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./

COPY --from=build /app/dist ./dist
EXPOSE 3000
RUN bun start:dev