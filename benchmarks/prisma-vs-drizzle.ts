import { Bench } from 'tinybench';

import { and, eq, like } from 'drizzle-orm';

import { getPrisma } from '../prisma';
import { getDrizzle } from '../drizzle';
import { folders } from '../drizzle/schema/folders';
import { notes } from '../drizzle/schema/notes';

const bench = new Bench({ time: 1000 });

const folderPath = '/bogdankostyuk';
const notePath = '/bogdankostuyk/main';
const ownerId = BigInt('852967721740042241');

async function main() {
  bench
    .add('prisma find note and folder for search', async () => {
      const prisma = getPrisma();

      const skip = 0;
      const select = 50;

      await Promise.all([
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

      await prisma.note.findMany({
        where: { path: notePath, ownerId },
        select: { id: true, name: true, content: true, path: true },
      });
    })
    .add('prisma find folder with notes', async () => {
      const prisma = getPrisma();

      await prisma.folder.findFirst({
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

      await Promise.all([
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

      await drizzle
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

          notes: {
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

      foldersAndNotes.reduce<{ notes?: any }>((acc, item) => ({
        ...item,
        notes: Array.isArray(acc.notes) ? [...acc.notes, item.notes] : [item.notes],
      }), {});
    });

  await bench.warmup();
  await bench.run();

  // eslint-disable-next-line no-console
  console.table(bench.table());
}

main()
  .then(() => process.exit(1));
