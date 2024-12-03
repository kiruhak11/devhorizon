# Устанавливаем базовый образ Node.js
FROM node:18.18.2-slim as base

WORKDIR /app

# Устанавливаем переменные окружения
ARG PORT=3000
ENV PORT=$PORT
ENV NODE_ENV=production

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install --production

# Копируем исходный код
COPY . .
RUN npx prisma generate

# Собираем проект
RUN npm run build

# Финальный образ для запуска
CMD ["node", ".output/server/index.mjs"]
