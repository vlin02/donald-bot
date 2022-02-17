FROM node:17.0.0

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN  yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]