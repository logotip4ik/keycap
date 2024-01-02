/* eslint-disable no-console */
import fsp from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { faker } from '@faker-js/faker';

import type { Prisma } from '@prisma/client';

import { getPrisma } from '.';
import { hashPassword } from '~/server/utils/passwords';
import { generateFolderPath, generateNotePath, generateRootFolderPath } from '~/server/utils';

const prisma = getPrisma();

async function main() {
  const numberOfUsers = 75;
  const users: Array<Prisma.UserCreateInput> = [];

  const usersFilename = 'users-result';
  const resultsPath = `./prisma/${usersFilename}.csv`;

  await prisma.user.deleteMany({
    where: { username: { not: 'bogdankostyuk' } },
  });

  for (let i = 0; i < numberOfUsers; i++) {
    const username = faker.internet.userName();

    const user: Prisma.UserCreateInput = {
      username,
      email: faker.internet.email(),
      password: faker.internet.password(),
      folders: {
        create: {
          name: `${username}'s workspace`,
          root: true,
          path: generateRootFolderPath(username),
        },
      },
    };

    users.push(user);
  }

  if (numberOfUsers > 500)
    console.log(`hashing ${numberOfUsers} passwords may take a while...`);

  if (existsSync(resultsPath))
    await fsp.writeFile(resultsPath, '');

  const hashedPasswords = await Promise.all(users.map((user) => hashPassword(user.password!)));

  const dbUsers = await Promise.all(users.map((user, i) => prisma.user.create({
    data: { ...user, password: hashedPasswords[i] },
    select: { id: true, username: true, email: true, password: true },
  })),
  );

  await fsp.appendFile(resultsPath, [
    'username,email,password',
    users.map((user) => `${user.username},${user.email},${user.password}`).join('\n'),
  ].join('\n'));

  const totalNumberOfNotes = 1000;
  const userFolders: Record<string, Array<{ name: string, path: string }>> = {};
  const notesPromises: Array<Promise<any>> = [];

  for (let i = 0; i < totalNumberOfNotes; i++) {
    const ownerIdx = faker.number.int({ min: 0, max: dbUsers.length - 1 });
    const owner = dbUsers.at(ownerIdx);

    if (!owner)
      continue;

    // creating folder
    if (Math.random() > 0.88) {
      const name = faker.lorem.words({ min: 1, max: 5 });

      const folder: Prisma.FolderCreateInput = {
        name,
        path: generateFolderPath(owner.username, encodeURIComponent(name)),
        owner: { connect: { username: owner.username } },
        parent: { connect: { path: generateRootFolderPath(owner.username) } },
      };

      userFolders[owner.username] ||= [];
      userFolders[owner.username].push(
        await prisma.folder.create({
          data: folder,
          select: { name: true, path: true },
        }),
      );
    }
    // creating note
    else {
      const name = faker.lorem.words({ min: 1, max: 10 });

      let parentPath: string;

      if (userFolders[owner.username] && Math.random() > 0.5) {
        const randomFolderIdx = faker.number.int({ min: 0, max: userFolders[owner.username].length - 1 });
        const folder = userFolders[owner.username][randomFolderIdx];

        parentPath = folder.path;
      }
      else {
        parentPath = generateRootFolderPath(owner.username);
      }

      const note: Prisma.NoteCreateInput = {
        name,
        path: generateNotePath(parentPath, encodeURIComponent(name)),
        owner: { connect: { username: owner.username } },
        parent: { connect: { path: parentPath } },
        content: Math.random() > 0.22 ? faker.lorem.paragraphs({ min: 0, max: 25 }) : null,
      };

      notesPromises.push(
        prisma.note.create({
          data: note,
        }),
      );
    }
  }

  await Promise.all(notesPromises);
}

main()
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
