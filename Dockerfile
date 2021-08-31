FROM node:16-alpine

WORKDIR /app-server

RUN npm i express lodash config

COPY . .

ENTRYPOINT ["node", "server.js"]


