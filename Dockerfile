FROM node:20 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN corepack enable
RUN yarn set version 3.6.4
RUN yarn install
COPY . .

RUN npx prisma migrate deploy
RUN yarn prisma generate

CMD ["yarn", "dev"]
