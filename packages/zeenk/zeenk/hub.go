package zeenk

import (
	"slices"
)

type Hub struct {
  rooms map[string][]*Client

  brodcast chan []byte

  register chan *Client

  unregister chan *Client
}

func NewHub() *Hub {
  return &Hub{
    rooms: make(map[string][]*Client),
    brodcast: make(chan []byte),
    register: make(chan *Client),
    unregister: make(chan *Client),
  }
}

func (h *Hub) Run() {
  for {
    select {
    case client := <- h.register:
      h.rooms[client.user.id] = append(h.rooms[client.user.id], client)

    case client := <- h.unregister:
      if clients, ok := h.rooms[client.user.id]; ok {
        clientIdx := slices.Index(clients, client)

        if clientIdx != -1 {
          clients[clientIdx] = clients[len(clients) - 1]
          clients[len(clients) - 1] = nil
          h.rooms[client.user.id] = clients[:len(clients) - 1]

          close(client.send)
        }
      }
    }
  }
}
