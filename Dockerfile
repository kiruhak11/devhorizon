# Установка Node.js
FROM node:20-alpine

# Установка рабочей директории
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Убедитесь, что файл dev.db и prisma/schema.prisma добавлены
COPY prisma ./prisma

# Сборка проекта
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запуск Nuxt.js в production-режиме
CMD ["npm", "run", "start"]
