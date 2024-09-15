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
)

func getAuthCookie(r *http.Request) (*http.Cookie, error) {
  cookieName := "keycap-user"
  if strings.ToUpper(GOENV) == "PROD" {
    cookieName = "__Host-" + cookieName
  }

  return r.Cookie(cookieName)
}

func verifyJwt(cookie string) (*jwt.Token, error) {
  token, err := jwt.Parse(
    cookie,
    func(token *jwt.Token) (interface{}, error) {return []byte(JWT_SECRET), nil},
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

func getUsernameFromJwt(token *jwt.Token) (string, error) {
  claims := token.Claims.(jwt.MapClaims)
  if username, ok := claims["username"].(string); ok {
    return username, nil
  }

  return "", fmt.Errorf("username not found in jwt claims: %v", claims)
}
