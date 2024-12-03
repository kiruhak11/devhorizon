ARG NODE_VERSION=18.18.2

FROM node:${NODE_VERSION}-slim as base

# Устанавливаем OpenSSL 1.1 для поддержки старых библиотек (если требуется)
RUN apt-get update && apt-get install -y \
  openssl=1.1.1n-0+deb10u8 \
  libssl1.1=1.1.1n-0+deb10u8

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /app

# Build
FROM base as build

COPY package*.json ./

RUN npm install --production=false

COPY . .

COPY prisma ./prisma
RUN npx prisma generate

RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /app /app

CMD [ "node", ".output/server/index.mjs" ]
