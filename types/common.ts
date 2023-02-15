export const SearchAction = {
  New: 1,
  Refresh: 2,
  RefreshNote: 3,
  RefreshFolder: 4,
  SaveNote: 5,
} as const;

export type SearchActionKeys = keyof typeof SearchAction;
export type SearchActionValues = typeof SearchAction[SearchActionKeys];
