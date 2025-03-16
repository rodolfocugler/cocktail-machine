FROM node:23-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_OPTIONS --openssl-legacy-provider

RUN npm run build

FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /www/data
