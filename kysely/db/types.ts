import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const SocialAuth = {
    Google: "Google",
    GitHub: "GitHub"
} as const;
export type SocialAuth = (typeof SocialAuth)[keyof typeof SocialAuth];
export type FolderTable = {
    id: Generated<string>;
    name: string;
    path: string;
    root: Generated<boolean>;
    parentId: string | null;
    ownerId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Folder = Selectable<FolderTable>;
export type NewFolder = Insertable<FolderTable>;
export type FolderUpdate = Updateable<FolderTable>;
export type NoteTable = {
    id: Generated<string>;
    name: string;
    content: string | null;
    path: string;
    ownerId: string;
    parentId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Note = Selectable<NoteTable>;
export type NewNote = Insertable<NoteTable>;
export type NoteUpdate = Updateable<NoteTable>;
export type OAuthTable = {
    id: string;
    type: SocialAuth;
    userId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type OAuth = Selectable<OAuthTable>;
export type NewOAuth = Insertable<OAuthTable>;
export type OAuthUpdate = Updateable<OAuthTable>;
export type ShareTable = {
    id: Generated<string>;
    link: string;
    noteId: string;
    ownerId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Share = Selectable<ShareTable>;
export type NewShare = Insertable<ShareTable>;
export type ShareUpdate = Updateable<ShareTable>;
export type UserTable = {
    id: Generated<string>;
    username: string;
    email: string;
    password: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
export type DB = {
    Folder: FolderTable;
    Note: NoteTable;
    OAuth: OAuthTable;
    Share: ShareTable;
    User: UserTable;
};
