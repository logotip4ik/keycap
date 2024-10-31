FROM golang:latest AS build

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o /go/bin/zeenk-server

FROM gcr.io/distroless/static-debian12:latest

USER nonroot

COPY --from=build /go/bin/zeenk-server /

CMD ["/zeenk-server"]
