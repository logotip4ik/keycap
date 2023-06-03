import { Bench } from 'tinybench';

import { and, eq } from 'drizzle-orm';

import { getPrisma } from '../prisma';
import { getDrizzle } from '../drizzle';
import { folders } from '../drizzle/schema/folders';
import { notes } from '../drizzle/schema/notes';

const bench = new Bench({ iterations: 1000 });

const folderPath = '/bogdankostyuk';
const ownerId = BigInt('852967721740042241');

async function main() {
  bench
    .add('prisma find all notes', async () => {
      const prisma = getPrisma();

      await prisma.note.findMany({ where: { ownerId } });
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
    .add('drizzle orm find all notes', async () => {
      const drizzle = getDrizzle();

      await drizzle
        .select({ notes })
        .from(notes)
        .where(eq(notes.ownerId, ownerId))
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
