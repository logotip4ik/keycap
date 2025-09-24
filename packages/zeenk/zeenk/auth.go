package zeenk

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"keycapthenotes.com/zeenk/utils"
)

var (
  GOENV = utils.GetEnv("GOENV", "PROD")
  JWT_SECRET = utils.GetEnv("JWT_SECRET", "")
  JWT_ISSUER = utils.GetEnv("JWT_ISSUER", "test:local")
  PROD_COOKIE_PREFIX = "__Host-Http-"
)

func getAuthCookie(r *http.Request) (*http.Cookie, error) {
  cookieName := "keycap-user"
  if strings.ToUpper(GOENV) == "PROD" {
    cookieName = PROD_COOKIE_PREFIX + cookieName
  }

  return r.Cookie(cookieName)
}

func verifyJwt(cookie string) (*jwt.Token, error) {
  token, err := jwt.Parse(
    cookie,
    func(token *jwt.Token) (any, error) {return []byte(JWT_SECRET), nil},
    jwt.WithIssuer(JWT_ISSUER),
    jwt.WithExpirationRequired(),
  )

  if err != nil {
    return nil, err
  }

  if !token.Valid {
    return nil, fmt.Errorf("invalid token")
  }

  return token, nil
}
