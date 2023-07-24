export interface NoteDefault {
  id: string
  name: string
  content?: string
  path: string
}

export interface NoteShare {
  link: string
  updatedAt: string
  createdAt: String
}

export interface NoteDetails {
  updatedAt: Date
  createdAt: Date
  share?: NoteShare
}
