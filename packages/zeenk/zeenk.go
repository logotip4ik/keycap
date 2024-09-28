package main

import (
	"fmt"
	"log"
	"net/http"

	"keycapthenotes.com/zeenk/utils"
	"keycapthenotes.com/zeenk/zeenk"
)

var (
  GOENV = utils.GetEnv("GOENV", "PROD")

  keycapUrl = utils.GetEnv("KEYCAP_URL", "localhost:3000")

  port = utils.GetEnv("PORT", "8123")
)

func main() {
  hub := zeenk.NewHub()

  go hub.Run()

  var keycapLink string;
  if GOENV == "PROD" {
    keycapLink = "https://" + keycapUrl
  } else {
    keycapLink = "http://" + keycapUrl
  }

  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    if _, ok := r.Header["Sec-Websocket-Version"]; ok {
      zeenk.ServeWs(hub, w, r)
    } else {
      http.Redirect(w, r, keycapLink, http.StatusPermanentRedirect);
    }
  })

  var addr string;

  if GOENV == "PROD" {
     addr = "0.0.0.0:" + port
  } else {
     addr = "127.0.0.1:" + port
  }

  fmt.Println("Listing on", addr)

  err := http.ListenAndServe(addr, nil)
  if err != nil {
    log.Fatal(err)
  }
}

