export interface FolderDefault {
  id: string
  name: string
  path: string
  root: boolean

  notes: Array<{ id: string; name: string; path: string }>
  subfolders: Array<{ id: string; name: string; path: string; root: boolean }>
}
