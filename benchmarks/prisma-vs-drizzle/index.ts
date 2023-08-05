import { Bench } from 'tinybench';

import { and, eq, like } from 'drizzle-orm';

import { getPrisma } from '../../prisma';
import { getDrizzle } from '../../drizzle';
import { folders } from '../../drizzle/schema/folders';
import { notes } from '../../drizzle/schema/notes';

const bench = new Bench({ iterations: 1000 });

const folderPath = '/bogdankostyuk';
const notePath = '/bogdankostyuk/main';
const ownerId = BigInt('878746963009863681');

async function main() {
  bench
    .add('prisma find note and folder for search', async () => {
      const prisma = getPrisma();

      const skip = 0;
      const select = 50;

      const a = await Promise.all([
        prisma.note.findMany({
          skip,
          where: { path: { startsWith: folderPath } },
          take: Math.floor(select / 2),
          select: { name: true, path: true },
        }),
        prisma.folder.findMany({
          skip,
          where: { path: { startsWith: folderPath } },
          take: Math.floor(select / 2),
          select: { name: true, path: true, root: true },
        }),
      ]);
    })
    .add('prisma find note', async () => {
      const prisma = getPrisma();

      const n = await prisma.note.findFirst({
        where: { path: notePath, ownerId },
        select: { id: true, name: true, content: true, path: true },
      });
    })
    .add('prisma find folder with notes', async () => {
      const prisma = getPrisma();

      const f = await prisma.folder.findFirst({
        where: { path: folderPath, ownerId },
        select: {
          id: true,
          name: true,
          path: true,
          root: true,
          notes: {
            select: { id: true, name: true, path: true },
          },
        },
      });
    }, {
      afterAll: async () => {
        const prisma = getPrisma();

        await prisma.$disconnect();
      },
    })
    .add('drizzle find note and folder for search', async () => {
      const drizzle = getDrizzle();

      const skip = 0;
      const select = 50;

      const a = await Promise.all([
        drizzle
          .select({ name: notes.name, path: notes.path })
          .from(notes)
          .where(like(notes.path, `${folderPath}%`))
          .offset(skip)
          .limit(Math.floor(select / 2))
          .execute(),

        drizzle
          .select({ name: folders.name, path: folders.path, root: folders.root })
          .from(folders)
          .where(like(folders.path, `${folderPath}%`))
          .offset(skip)
          .limit(Math.floor(select / 2))
          .execute(),
      ]);
    })
    .add('drizzle orm find note', async () => {
      const drizzle = getDrizzle();

      const n = await drizzle
        .select({ id: notes.id, name: notes.name, content: notes.content, path: notes.path })
        .from(notes)
        .where(and(eq(notes.ownerId, ownerId), eq(notes.path, notePath)))
        .execute();
    })
    .add('drizzle orm find folder with notes', async () => {
      const drizzle = getDrizzle();

      const foldersAndNotes = await drizzle
        .select({
          id: folders.id,
          name: folders.name,
          path: folders.path,
          root: folders.root,

          note: {
            id: notes.id,
            name: notes.name,
            path: notes.path,
          },
        })
        .from(folders)
        .where(and(
          eq(folders.path, folderPath),
          eq(folders.ownerId, ownerId),
        ))
        .innerJoin(notes, eq(notes.parentId, folders.id))
        .execute();

      const folder: any = {};

      for (let i = 0; i < foldersAndNotes.length; i++) {
        const entry = foldersAndNotes[i];

        if (i === 0) {
          folder.id = entry.id;
          folder.name = entry.name;
          folder.path = entry.path;
          folder.root = entry.root;

          folder.notes = [];
        }

        folder.notes.push(entry.note);
      }
    });

  await bench.run();

  // eslint-disable-next-line no-console
  console.table(bench.table());
}

main()
  .catch((e) => console.log(e))
  .finally(() => process.exit(1));
