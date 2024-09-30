FROM node:22 AS builder

WORKDIR /source

COPY package.json .
COPY yarn.lock .

RUN yarn

ENV NODE_ENV=production

COPY . .

RUN yarn build

# release includes bare minimum required to run the app, copied from builder
FROM node:22 AS release

USER node

WORKDIR /app

COPY --from=builder /source/.output ./

CMD ["node", "./server/index.mjs"]
