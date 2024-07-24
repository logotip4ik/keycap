FROM node:20-slim AS builder

WORKDIR /source

COPY . .

RUN yarn

ENV NITRO_PRESET=bun
ENV NODE_ENV=production

RUN yarn build

# release includes bare minimum required to run the app, copied from builder
FROM oven/bun:alpine

WORKDIR /app

COPY --from=builder /source/.output ./

CMD ["bun", "run", "./server/index.mjs"]
