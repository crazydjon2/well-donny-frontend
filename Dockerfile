FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Копируем .env
COPY .env .env

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
