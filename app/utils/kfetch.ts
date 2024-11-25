import type { $Fetch } from 'nitropack';

export const kfetch = $fetch.create({
  headers: protectionHeaders,
}) as $Fetch;
