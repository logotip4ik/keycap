FROM golang:latest AS build

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o /go/bin/zeenk-server

FROM debian:bookworm

RUN groupadd --gid 1000 nonroot \
  && useradd --uid 1000 --gid nonroot --shell /bin/bash --create-home nonroot

USER nonroot

COPY --from=build /go/bin/zeenk-server /

CMD ["/zeenk-server"]
