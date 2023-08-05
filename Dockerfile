FROM php:8.1.8-fpm-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --update npm=7.17.0-r0 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.14/main
RUN npm install

COPY . .

CMD [ "npm", "start" ]



