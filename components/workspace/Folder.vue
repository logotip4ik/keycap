<script setup lang="ts">
import { withLeadingSlash, withoutTrailingSlash } from 'ufo';

import type { Note } from '@prisma/client';
import type { FolderOrNote, FolderWithContents } from '~/composables/store';

const props = defineProps<{ folder: FolderWithContents }>();

const router = useRouter();
const route = useRoute();
const user = useUser();
const rootFolderContents = useRootFolderContents();

const shouldShowContents = ref(props.folder.root);

const pathsToFolder = computed(() => {
  if (!user.value) return [];

  const folders: string[] = Array.isArray(route.params.folders) ? route.params.folders : [];
  const paths: string[] = [];

  for (let i = 0; i < folders.length; i += 1) {
    const basePath = paths[i - 1] || withLeadingSlash(user.value.username);
    const path = `${basePath}${withLeadingSlash(folders[i])}`;

    paths.push(withoutTrailingSlash(path));
  }

  return paths;
});

const mergedContents = computed(() => {
  if (!rootFolderContents.value) return [];

  let targetFolder: FolderWithContents | undefined = rootFolderContents.value;

  for (const path of pathsToFolder.value) {
    targetFolder = targetFolder.subfolders.find((folder) => folder.path === path);

    if (!targetFolder)
      return [];
  }

  return [...targetFolder.notes, ...targetFolder.subfolders] as FolderOrNote[];
});

function showFolderContents(folder: FolderWithContents) {
  router.push({ name: '@user-folders-note', params: { folders: [...route.params.folders, folder.name], note: '' } });
}

function isFolder(object: FolderWithContents | Note) {
  return 'notes' in object;
}
</script>

<template>
  <button v-if="!folder.root" @click="showFolderContents(folder)">
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="currentColor" d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h6l2 2h8q.825 0 1.413.588Q22 7.175 22 8v10q0 .825-.587 1.413Q20.825 20 20 20ZM4 6v12h16V8h-8.825l-2-2H4Zm0 0v12Z" />
    </svg>

    {{ folder.name }}
  </button>

  <ul v-if="shouldShowContents">
    <template v-for="item in mergedContents" :key="item.id.toString()">
      <li>
        <template v-if="isFolder(item)">
          <WorkspaceFolder :folder="item" />
        </template>
        <template v-else>
          <WorkspaceNote :note="item" :parent="folder" />
        </template>
      </li>
    </template>
  </ul>
</template>
