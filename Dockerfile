FROM node:9.0.0-slim

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD npm start
