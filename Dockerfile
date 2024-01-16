FROM node:20 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install
COPY . .
RUN yarn run dev

# CMD ["node", "./.output/server/index.mjs"]