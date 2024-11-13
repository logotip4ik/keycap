export const SearchAction = {
  New: 1,
  Refresh: 2,
  RefreshNote: 3,
  RefreshFolder: 4,
  SaveNote: 5,
  Details: 6,
  Shortcuts: 7,
  Workspace: 8,
} as const;

export const ItemState = {
  Creating: 1,
  Editing: 2,
} as const;
