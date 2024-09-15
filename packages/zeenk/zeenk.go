package main

import (
	"log"
	"net/http"

	"keycapthenotes.com/zeenk/zeenk"
	"keycapthenotes.com/zeenk/utils"
)

func main() {
  hub := zeenk.NewHub()

  go hub.Run()

  http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
    zeenk.ServeWs(hub, w, r)
  })

  addr := ":" + utils.GetEnv("PORT", "8123")
  err := http.ListenAndServe(addr, nil)
  if err != nil {
    log.Fatal(err)
  }
}

