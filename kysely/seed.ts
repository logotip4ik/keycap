import { fakerEN as faker } from '@faker-js/faker';
import postgres from 'postgres';
import { read } from 'rc9';

import type { NewFolder, NewNote, NewUser } from './db/types';
import { hashPassword } from '../server/utils/passwords';

const url: string = read('.env').DATABASE_URL;

if (!url) {
  throw new Error('DATABASE_URL must be defined');
}

const sql = postgres(url);

async function createUser() {
  const defaultUser: NewUser = {
    username: 'bogdankostyuk',
    email: 'contact@bogdankostyuk.xyz',
    password: await hashPassword('something'),
    updatedAt: new Date(),
  };

  const [{ id }] = await sql`insert into ${sql('User')} ${sql(defaultUser)} returning ${sql(['id'])}`;

  return {
    ...defaultUser,
    id,
  };
}

async function createRootFolder(user: { id: string, username: string }) {
  const rootFolder: NewFolder = {
    name: `${user.username}'s workspace`,
    path: `/${user.username}`,
    root: true,
    ownerId: user.id,
    updatedAt: new Date(),
  };

  const [{ id }] = await sql`insert into ${sql('Folder')} ${sql(rootFolder)} returning ${sql(['id'])}`;

  return {
    ...rootFolder,
    id
  };
}

async function createNotes(user: { id: string }, folder: { id: string, path: string }) {
  const notesNames = ['main', 'test', 'updates', 'chore'];

  const notes = notesNames.map((name): NewNote => ({
    name,
    content: `<p>${faker.lorem.sentences(15)}</p>`,
    path: `${folder.path}/${name}`,
    ownerId: user.id,
    parentId: folder.id,
    updatedAt: new Date(),
  }));

  await sql`insert into ${sql('Note')} ${sql(notes)}`;
}

async function createRandomUser() {
  const user: NewUser = {
    username: faker.internet.username() + Math.random(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    updatedAt: new Date(),
  };

  const [{ id }] = await sql`insert into ${sql('User')} ${sql(user)} returning ${sql(['id'])}`;

  return {
    ...user,
    id,
  };
}

async function main() {
  const tables = ['User', 'OAuth', 'Folder', 'Note', 'Share'];
  await sql`truncate ${sql(tables)}`;

  const promises: Array<Promise<void>> = [];
  for (let i = 0; i < 1000; i++) {
    promises.push((async () => {
      const user = await createRandomUser();
      const rootFolder = await createRootFolder(user);
      await createNotes(user, rootFolder);
      // console.log('inserted: ', i);
    })());
  }

  await Promise.all(promises);

  const user = await createUser();
  const rootFolder = await createRootFolder(user);
  await createNotes(user, rootFolder);
}

main().then(() => process.exit());
