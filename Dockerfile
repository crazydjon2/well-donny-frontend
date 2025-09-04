FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]