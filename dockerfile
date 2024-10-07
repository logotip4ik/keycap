FROM node:22 AS builder

WORKDIR /source

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .yarn/ .yarn/
COPY .yarnrc.yml .yarnrc.yml

RUN yarn --immutable

ENV NODE_ENV=production

COPY . .

RUN yarn build

# release includes bare minimum required to run the app, copied from builder
FROM node:22 AS release

USER node

WORKDIR /app

COPY --link --from=builder /source/.output ./

EXPOSE 3000

HEALTHCHECK  --retries=10 --start-period=5s \
  CMD wget --no-verbose --spider http://0.0.0.0:3000/ || exit 1

CMD ["node", "./server/index.mjs"]
