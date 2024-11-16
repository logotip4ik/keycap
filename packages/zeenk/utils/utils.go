package utils

import (
	"net/http"
	"os"
)

func GetEnv(key, fallback string) string {
  if value, ok := os.LookupEnv(key); ok {
    return value;
  }

  return fallback
}

func SetCors(r http.ResponseWriter, allowOrigin string) {
  headers := r.Header()

  headers.Add("Access-Control-Allow-Origin", allowOrigin)
  headers.Add("Access-Control-Allow-Headers", "Content-Type, Accept")
  headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
  headers.Add("Access-Control-Allow-Credentials", "true")

  headers.Add("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers")
}
