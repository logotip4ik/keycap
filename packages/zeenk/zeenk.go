package main

import (
	"fmt"
	"log"
	"net/http"

	"keycapthenotes.com/zeenk/utils"
	"keycapthenotes.com/zeenk/zeenk"
)

var (
  keycapUrl = utils.GetEnv("KEYCAP_URL", "http://localhost:3000")
)

func main() {
  hub := zeenk.NewHub()

  go hub.Run()

  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    if _, ok := r.Header["Sec-Websocket-Version"]; ok {
      zeenk.ServeWs(hub, w, r)
    } else {
      http.Redirect(w, r, keycapUrl, http.StatusPermanentRedirect);
    }
  })

  addr := "127.0.0.1:" + utils.GetEnv("PORT", "8123")

  fmt.Println("Listing on", addr)

  err := http.ListenAndServe(addr, nil)
  if err != nil {
    log.Fatal(err)
  }
}

