FROM node:lts-alpine

WORKDIR /app

# Копируем package.json первым (для кэширования слоев)
COPY package*.json ./
RUN npm install

# Копируем ВСЕ файлы включая .env
COPY . .

# Проверяем, что .env скопировался
RUN ls -la | grep .env || echo ".env not found"

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]