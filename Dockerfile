FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./ ./

EXPOSE 3002
CMD npm run prod --loglevel=verbose
