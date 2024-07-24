FROM oven/bun:latest-alpine AS builder

WORKDIR /source

COPY . .

RUN bun install

ENV NITRO_PRESET=bun
ENV NODE_ENV=production

RUN bun build

# release includes bare minimum required to run the app, copied from builder
FROM oven/bun:latest-alpine

WORKDIR /app

COPY --from=builder /source/.output ./

CMD ["./server/index.mjs"]
