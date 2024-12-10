# Dockerfile для бота

FROM node:20

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем только файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы в контейнер
COPY . ./

# Открываем порт 3000 для приложения
EXPOSE 3000

# Запускаем сервер
CMD ["node", "server.js"]
