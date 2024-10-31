FROM golang:latest AS build

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o /go/bin/zeenk-server

FROM debian:bookworm-slim

RUN apt-get update; apt-get install -y --no-install-recommends wget curl; rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1000 nonroot \
  && useradd --uid 1000 --gid nonroot --shell /bin/bash --create-home nonroot

USER nonroot

COPY --from=build /go/bin/zeenk-server /

CMD ["/zeenk-server"]
