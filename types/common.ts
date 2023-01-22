// export enum SearchAction {
//   New,
//   Refresh,
//   RefreshFolder,
// }

export const SearchAction = {
  New: 1,
  Refresh: 2,
  RefreshFolder: 3,
} as const;

export type SearchActionKeys = keyof typeof SearchAction;
export type SearchActionValues = typeof SearchAction[SearchActionKeys];
