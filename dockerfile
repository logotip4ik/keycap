FROM node:20-slim AS builder

WORKDIR /app/source

RUN apt update -y
RUN apt install git -y

COPY . .

RUN yarn

ENV NODE_ENV=production

RUN yarn build

# release includes bare minimum required to run the app, copied from builder
FROM node:20-slim AS release

WORKDIR /app

COPY --from=builder /app/source/.output ./

# dont forget to set env's

ENV NODE_ENV=production

CMD ["node", "./server/index.mjs"]
