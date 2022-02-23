FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

COPY packages/server/package.json ./packages/server/
COPY packages/bot/package.json ./packages/bot/
COPY packages/scraper/package.json ./packages/scraper/

RUN yarn install

COPY . .

RUN yarn build

CMD yarn start