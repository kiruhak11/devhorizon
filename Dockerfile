# Base image with specified Node.js version
ARG NODE_VERSION=18.14.2
FROM node:${NODE_VERSION}-slim as base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and generate Prisma client
COPY . .
RUN npx prisma generate

# Build project
RUN npm run build

# Final image for production
FROM node:${NODE_VERSION}-slim

WORKDIR /app

COPY --from=base /app ./

ENV PORT=3000
CMD ["node", ".output/server/index.mjs"]
