# Базовый образ
FROM node:18.18.2-slim

# Рабочая директория
WORKDIR /app

# Копирование зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование всех файлов
COPY . .

# Установка Prisma CLI
RUN npm install prisma --save-dev

# Генерация Prisma
RUN npx prisma generate

# Сборка проекта
RUN npm run build

# Запуск приложения
CMD ["npm", "start"]
