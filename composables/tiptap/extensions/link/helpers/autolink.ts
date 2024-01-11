import {
  combineTransactionSteps,
  findChildrenInRange,
  getChangedRanges,
  getMarksBetween,
} from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

import type { NodeWithPos } from '@tiptap/core';
import type { MarkType } from '@tiptap/pm/model';

import { find } from './linker';

interface AutolinkOptions {
  type: MarkType
};

export function autolink(options: AutolinkOptions): Plugin {
  return new Plugin({
    key: new PluginKey('autolink'),
    appendTransaction: (transactions, oldState, newState) => {
      const docChanges = transactions.some((transaction) => transaction.docChanged) && !oldState.doc.eq(newState.doc);
      const preventAutolink = transactions.some((transaction) => transaction.getMeta('preventAutolink'));

      if (!docChanges || preventAutolink)
        return;

      const { tr } = newState;
      const transform = combineTransactionSteps(oldState.doc, [...transactions]);
      const changes = getChangedRanges(transform);

      for (const { newRange } of changes) {
        // Now let’s see if we can add new links.
        const nodesInChangedRanges = findChildrenInRange(
          newState.doc,
          newRange,
          (node) => node.isTextblock,
        );

        let textBlock: NodeWithPos | undefined;
        let textBeforeWhitespace: string | undefined;

        if (nodesInChangedRanges.length > 1) {
          // Grab the first node within the changed ranges (ex. the first of two paragraphs when hitting enter).
          textBlock = nodesInChangedRanges[0];
          textBeforeWhitespace = newState.doc.textBetween(
            textBlock.pos,
            textBlock.pos + textBlock.node.nodeSize,
            undefined,
            ' ',
          );
        }
        else if (
          nodesInChangedRanges.length > 0
          // We want to make sure to include the block seperator argument to treat hard breaks like spaces.
          && newState.doc.textBetween(newRange.from, newRange.to, ' ', ' ').endsWith(' ')
        ) {
          textBlock = nodesInChangedRanges[0];
          textBeforeWhitespace = newState.doc.textBetween(
            textBlock.pos,
            newRange.to,
            undefined,
            ' ',
          );
        }

        if (!textBlock || !textBeforeWhitespace)
          continue;

        const wordsBeforeWhitespace = textBeforeWhitespace.split(' ').filter((s) => s !== '');

        if (wordsBeforeWhitespace.length <= 0)
          continue;

        const lastWordBeforeSpace = wordsBeforeWhitespace[wordsBeforeWhitespace.length - 1];
        const lastWordAndBlockOffset = textBlock.pos + textBeforeWhitespace.lastIndexOf(lastWordBeforeSpace);

        if (!lastWordBeforeSpace)
          continue;

        const links = find(lastWordBeforeSpace);
        for (const link of links) {
          const from = lastWordAndBlockOffset + link.start + 1;
          const to = lastWordAndBlockOffset + link.end + 1;

          if (
            (
              newState.schema.marks.code
              && newState.doc.rangeHasMark(from, to, newState.schema.marks.code)
            )
            || getMarksBetween(from, to, newState.doc).some((item) => item.mark.type === options.type)
          )
            continue;

          tr.addMark(
            from,
            to,
            options.type.create({
              href: link.href,
            }),
          );
        }
      }

      if (tr.steps.length === 0)
        return;

      return tr;
    },
  });
}
