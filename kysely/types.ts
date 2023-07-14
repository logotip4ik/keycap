import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { SocialAuth } from "./enums";

export type Folder = {
    id: Generated<string>;
    name: string;
    path: string;
    root: Generated<boolean>;
    parentId: string | null;
    ownerId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Note = {
    id: Generated<string>;
    name: string;
    content: string | null;
    path: string;
    ownerId: string;
    parentId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type OAuth = {
    id: string;
    type: SocialAuth;
    userId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Share = {
    id: Generated<string>;
    link: string;
    noteId: string;
    ownerId: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type User = {
    id: Generated<string>;
    username: string;
    email: string;
    password: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    Folder: Folder;
    Note: Note;
    OAuth: OAuth;
    Share: Share;
    User: User;
};
