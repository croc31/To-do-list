FROM node:16-alpine

WORKDIR /app-server

RUN npm init

RUN npm install express

COPY . .

ENTRYPOINT ["node", "server.js"]


