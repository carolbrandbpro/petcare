FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY .env ./
ENV NODE_ENV=production
EXPOSE 4001
CMD ["node","src/index.js"]