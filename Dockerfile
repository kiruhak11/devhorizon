ARG NODE_VERSION=18.18.2

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000
ENV NODE_ENV=production
WORKDIR /app
RUN npm install -g npm@10.9.1
# Установка OpenSSL
RUN apt-get update -y && apt-get install -y openssl

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
