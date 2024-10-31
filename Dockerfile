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
FROM node:22-bookworm-slim as release

RUN apt-get update; apt-get install -y --no-install-recommends wget curl; rm -rf /var/lib/apt/lists/*

USER node

WORKDIR /app

COPY --link --from=builder /source/.output ./

CMD ["node", "./server/index.mjs"]
