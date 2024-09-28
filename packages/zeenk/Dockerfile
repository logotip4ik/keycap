FROM golang:latest AS base

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o zeenk-server

CMD ["/build/zeenk-server"]
