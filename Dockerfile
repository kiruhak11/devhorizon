ARG NODE_VERSION=18.18.2

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /app

# Установка OpenSSL 1.1.x
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl=1.1.* \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Build
FROM base as build

COPY package*.json ./

RUN npm install --production=false

COPY . .

COPY prisma ./prisma
RUN npx prisma generate

RUN npm run build
RUN npm prune --production

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /app /app

CMD [ "node", ".output/server/index.mjs" ]
