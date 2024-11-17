package main

import (
	"fmt"
	"net/http"

	"keycapthenotes.com/zeenk/utils"
	"keycapthenotes.com/zeenk/zeenk"
)

func main() {
  GOENV := utils.GetEnv("GOENV", "PROD");
  PORT := ":" + utils.GetEnv("PORT", "8123")

  hub := zeenk.NewHub()

  go hub.Run()

  var keycapLink string;
  if GOENV == "PROD" {
    keycapLink = "https://" + utils.GetEnv("KEYCAP_URL", "localhost:3000")
  } else {
    keycapLink = "http://" + utils.GetEnv("KEYCAP_URL", "localhost:3000")
  }

  router := http.NewServeMux()

  router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    utils.SetCors(w, keycapLink)

    if r.Method == "OPTIONS" {
      w.WriteHeader(http.StatusOK)
      return
    }

    if _, ok := r.Header["Sec-Websocket-Version"]; ok {
      zeenk.ServeWs(hub, w, r)
    } else {
      http.Redirect(w, r, keycapLink, http.StatusTemporaryRedirect);
    }
  })

  srv := http.Server{
    Addr: PORT,
    Handler: router,
  }

  fmt.Println("Listening on:", PORT)
  srv.ListenAndServe()
}

