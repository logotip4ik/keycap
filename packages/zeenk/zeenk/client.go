package zeenk

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"keycapthenotes.com/zeenk/utils"
)

const (
  writeWait = 10 * time.Second

  pongWait = 60 * time.Second

  pingPeriod = (pongWait * 9) / 10

  maxMessageSize = 2048
)

var (
  newline = []byte{'\n'}

  upgrader = websocket.Upgrader{
    ReadBufferSize: maxMessageSize,
    WriteBufferSize: maxMessageSize,
    CheckOrigin: checkOrigin,
    EnableCompression: true,
  }

  prodHost = "https://" + utils.GetEnv("KEYCAP_URL", "")
)

type User struct {
  id string
}

type Client struct {
  hub *Hub

  user *User

  conn *websocket.Conn

  send chan []byte
}

type Event struct {
  Type string `json:"type"`
  Payload json.RawMessage `json:"payload,omitempty"`
}

func (c *Client) readPump() {
  defer func() {
    c.hub.unregister <- c
    c.conn.Close()
  }()

  c.conn.SetReadLimit(maxMessageSize)
  c.conn.SetReadDeadline(time.Now().Add(pongWait))
  c.conn.SetPongHandler(func(string) error {
    c.conn.SetReadDeadline(time.Now().Add(pongWait))
    return nil
  })

  var event Event
  for {
    err := c.conn.ReadJSON(&event)
    if err != nil {
      if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
        log.Println("Unexpected error while reading error", err)
      }

      break
    }

    switch event.Type {
    default:
      data, err := json.Marshal(event)

      if err != nil {
        fmt.Println("error while stringifing json", event)

        break
      }

      clients := c.getRoom()

      for _, client := range clients {
        if client != c {
          client.send <- data
        }
      }
    }
  }
}

func (c *Client) getRoom() []*Client {
  return c.hub.rooms[c.user.id]
}

func (c *Client) writePump() {
  ticker := time.NewTicker(pingPeriod)
  defer func() {
    ticker.Stop()
    c.conn.Close()
  }()

  for {
    select {
    case message, ok := <- c.send:
      c.conn.SetWriteDeadline(time.Now().Add(writeWait))

      if !ok {
        c.conn.WriteMessage(websocket.CloseMessage, []byte{})
        return
      }

      w, err := c.conn.NextWriter(websocket.TextMessage)

      if err != nil {
        return
      }

      w.Write(message)

      n := len(c.send)
      for range n {
        w.Write(newline)
        w.Write(<-c.send)
      }

      if err := w.Close(); err != nil {
        return
      }

    case <- ticker.C:
      c.conn.SetWriteDeadline(time.Now().Add(writeWait))
      if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
        return
      }
    }
  }
}

func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
  cookie, err := getAuthCookie(r)

  if err != nil {
    fmt.Println("Error while reading cookie: ", err)
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  token, err := verifyJwt(cookie.Value)

  if err != nil {
    fmt.Println("Error while validating jwt: ", err)
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  userId, err := token.Claims.GetSubject()

  if err != nil || strings.TrimSpace(userId) == "" {
    w.WriteHeader(http.StatusUnauthorized)
    fmt.Println("Error while getting user id", err)
    return
  }

  conn, err := upgrader.Upgrade(w, r, nil)
  if err != nil {
    log.Println(err)
    return
  }

  client := &Client{
    hub: hub,
    conn: conn,
    send: make(chan []byte, maxMessageSize),
    user: &User{
      id: strings.TrimSpace(userId),
    },
  }

  hub.register <- client

  go client.readPump()
  go client.writePump()
}

func checkOrigin(r *http.Request) bool {
  // Grab the request origin
  origin := r.Header.Get("Origin")

  switch origin {
  case prodHost:
          return true
  case "http://localhost:3000":
          return true
  default:
          return false
  }
}
