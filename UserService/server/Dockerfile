FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh && npx prisma generate

EXPOSE 5001