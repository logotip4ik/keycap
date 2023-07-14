import { Bench } from 'tinybench';

import { getKysely } from '~/kysely/main';
import { getPrisma } from '~/prisma/index';

const paths = Array(40).fill(0).map((_, i) => `/bogdankostyuk/${i + 1}`);
const folderPaths = [
  '/bogdankostyuk',
  '/bogdankostyuk/new%20folder',
  '/bogdankostyuk/another%20new%20folder',
];
const ownerId = BigInt('878746963009863681');

const bench = new Bench({ iterations: 1000 });

// =======================================
//
// Don't forget to add DATABASE_URL to env
//
// =======================================

async function main() {
  bench.add('kysely note', async () => {
    const kysely = getKysely();
    const path = paths[Math.floor(Math.random() * (paths.length - 1))];

    const note = await kysely
      .selectFrom('Note')
      .select(['id', 'name', 'path', 'content'])
      .where(({ and, eb }) => and([
        eb('path', '=', path),
        eb('ownerId', '=', ownerId.toString()),
      ]))
      .executeTakeFirst();
  });

  bench.add('prisma note', async () => {
    const prisma = getPrisma();
    const path = paths[Math.floor(Math.random() * paths.length)];

    const note = await prisma.note.findFirst({
      where: { path, ownerId },
      select: { id: true, name: true, path: true, content: true },
    });
  });

  bench.add('kysely folder', async () => {
    const kysely = getKysely();

    const folderWithNoteAndChildren = await kysely
      .selectFrom('Folder')
      .where(({ and, eb }) => and([
        eb('Folder.path', '=', folderPaths[0]),
        eb('Folder.ownerId', '=', ownerId.toString()),
      ]))
      .leftJoin('Note as n', 'Folder.id', 'n.parentId')
      .leftJoin('Folder as c', 'Folder.id', 'c.parentId')
      .select([
        'Folder.id', 'Folder.name', 'Folder.path', 'Folder.root',
      ])
      .select([
        'n.id as note_id', 'n.name as note_name', 'n.path as note_path',
      ])
      .select([
        'c.id as child_id', 'c.name as child_name', 'c.path as child_path', 'c.root as child_root',
      ])
      .execute();

    const folder: any = {};
    const alreadyAdded: Record<string, true | never> = {};

    for (let i = 0; i < folderWithNoteAndChildren.length; i++) {
      const entry = folderWithNoteAndChildren[i];

      if (i === 0) {
        folder.id = entry.id;
        folder.name = entry.name;
        folder.path = entry.path;
        folder.root = entry.root;

        folder.notes = [];
        folder.folders = [];
      }

      if (entry.note_path && !alreadyAdded[entry.note_path]) {
        alreadyAdded[entry.note_path] = true;

        folder.notes.push(
          { id: entry.note_id, name: entry.note_name, path: entry.note_path },
        );
      }

      if (entry.child_path && !alreadyAdded[entry.child_path]) {
        alreadyAdded[entry.child_path] = true;

        folder.folders.push(
          { id: entry.child_id, name: entry.child_name, path: entry.child_path, root: entry.child_root },
        );
      }
    }
  });

  bench.add('prisma folder', async () => {
    const prisma = getPrisma();

    const folder = await prisma.folder.findFirst({
      where: { path: folderPaths[0], ownerId },
      select: {
        id: true,
        name: true,
        path: true,
        root: true,

        notes: {
          select: { id: true, name: true, path: true },
          // orderBy: { name: 'asc' },
        },

        subfolders: {
          select: {
            id: true,
            name: true,
            path: true,
            root: true,
          },
          // orderBy: { name: 'asc' },
        },
      },
    });
  });

  await bench.run();

  console.table(bench.table());
}

main()
  .catch((e) => console.log(e))
  .finally(() => process.exit(0));
