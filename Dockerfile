FROM node:16-alpine

WORKDIR /app-server

RUN npm install express lodash

COPY . .

ENTRYPOINT ["node", "server.js"]


