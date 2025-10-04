import type { Emoji, EmojiMartData } from '@emoji-mart/data';

import { createUnplugin } from 'unplugin';

const importId = 'virtual:smaller-emoji-mart';
const resolvedImportId = `\0${importId}`;

const fieldsToExtract = ['id', 'skins'] satisfies Array<keyof Emoji>;
type FieldsToExtract = typeof fieldsToExtract[number];

export const SmallerEmojiMart = createUnplugin(() => ({
  name: 'smaller-emoji-mart',

  resolveId(id) {
    if (id === importId) {
      return resolvedImportId;
    }
  },

  async load(id) {
    if (id !== resolvedImportId) {
      return;
    }

    const { emojis } = (await import('@emoji-mart/data')).default as EmojiMartData;
    const leanedEmojies: Array<Pick<Emoji, FieldsToExtract>> = [];

    for (const key in emojis) {
      const emoji = emojis[key];
      const leanedEmoji = {} as Pick<Emoji, FieldsToExtract>;

      for (const field of fieldsToExtract) {
        leanedEmoji[field] = emoji[field] as any;
      }

      leanedEmojies.push(leanedEmoji);
    }

    return {
      code: `export const emojies = JSON.parse('${JSON.stringify(leanedEmojies)}');`,
    };
  },
}));
