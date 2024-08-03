export const SearchAction = {
  New: 1,
  Refresh: 2,
  RefreshNote: 3,
  RefreshFolder: 4,
  SaveNote: 5,
  Details: 6,
} as const;

export type SearchActionKeys = keyof typeof SearchAction;
export type SearchActionValues = typeof SearchAction[SearchActionKeys];

export const ItemState = {
  Creating: 1,
  Editing: 2,
} as const;

export type ItemStateKeys = keyof typeof ItemState;
export type ItemStateValues = typeof ItemState[ItemStateKeys];
