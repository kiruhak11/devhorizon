ARG NODE_VERSION=18.14.2

FROM node:${NODE_VERSION}-slim as base

ENV NODE_ENV=production

WORKDIR /app

# Build stage
FROM base as build

COPY package*.json ./
RUN npm install --production=false

COPY . .

COPY prisma ./prisma
RUN npx prisma generate

RUN npm run build
RUN npm prune --production

# Run stage
FROM base

WORKDIR /app
COPY --from=build /app /app

ENV DATABASE_URL="sqlite:/data/dev.db"
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
