FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

# Генерация Prisma-клиента
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "server.js"]
