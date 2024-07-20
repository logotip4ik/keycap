FROM oven/bun:latest AS builder

WORKDIR /source

RUN apt update -y
RUN apt install git -y

COPY . .

RUN yarn

ENV NITRO_PRESET=bun
ENV NODE_ENV=production

RUN yarn build

# release includes bare minimum required to run the app, copied from builder
FROM oven/bun:latest

RUN apt update -y

WORKDIR /app

COPY --from=builder /source/.output ./

RUN cd ./server

CMD ["./index.mjs"]
