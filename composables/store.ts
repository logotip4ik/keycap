import type { Folder, Note } from '@prisma/client';

export interface FolderWithContents extends Folder {
  notes: Note[]
  subfolders: FolderWithContents[]
}

export type FolderOrNote = FolderWithContents & Note;

export const useRootFolderContents = () => useState<FolderWithContents | null>(() => null);
