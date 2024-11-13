import type { SimpleCallExpression } from 'estree';

import { pathToFileURL } from 'node:url';

import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { parseQuery, parseURL } from 'ufo';
import { createUnplugin } from 'unplugin';

const invariant = 'invariant';
const invariantFunctionCall = /invariant\(/;

export const InvariantOptimization = createUnplugin(() => ({
  name: 'InvariantOptimization',

  transformInclude: isVueOrJs,

  enforce: 'post',

  transform(code, id) {
    if (!invariantFunctionCall.test(code)) {
      return;
    }

    const s = new MagicString(code);

    walk(this.parse(code) as any, {
      enter(_node) {
        if (_node.type !== 'CallExpression') {
          return;
        }

        const node = _node as SimpleCallExpression;

        if ((node.callee as any).name !== invariant || node.arguments.length < 2) {
          return;
        }

        const [checkExpression_, ...comments] = node.arguments;

        const checkExpression = checkExpression_ as any as { start: number, end: number };
        const lastComment = comments.at(-1) as any as { start: number, end: number };

        s.overwrite(checkExpression.end, lastComment.end, '');
      },
    });

    if (s.hasChanged()) {
      return {
        code: s.toString(),
        map: s.generateMap({
          source: id,
          hires: true,
        }),
      };
    }
  },
}));

const jsExtRE = /\.(?:(?:c|m)?j|t)sx?$/;
function isVueOrJs(id: string) {
  const { pathname, search } = parseURL(decodeURIComponent(pathToFileURL(id).href));
  const { type } = parseQuery(search);

  // vue files
  if (pathname.endsWith('.vue') && (type === 'script' || !search)) {
    return true;
  }

  // js files
  return jsExtRE.test(pathname);
}
