FROM node:16 AS base

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

COPY packages/server/package.json ./packages/server/
COPY packages/bot/package.json ./packages/bot/
COPY packages/scraper/package.json ./packages/scraper/

RUN yarn install

COPY . .

RUN yarn build

FROM base AS client

WORKDIR /usr/src/app/packages/bot/
CMD yarn start

FROM base AS server

WORKDIR /usr/src/app/packages/server/
CMD yarn start