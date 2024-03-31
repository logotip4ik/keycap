import { createContext, runInContext } from 'node:vm';
import { pathToFileURL } from 'node:url';

import type { SimpleCallExpression } from 'estree';

import MagicString from 'magic-string';
import parseDuration from 'parse-duration';
import { createUnplugin } from 'unplugin';
import { walk } from 'estree-walker';
import { parseQuery, parseURL } from 'ufo';

export const parseDurationFunctionName = 'parseDuration';
const parseDurationFunctionCall = /parseDuration\(/;

export const ParseDurationTransformPlugin = createUnplugin(() => ({
  name: 'ParseDurationTransformPlugin',

  transformInclude: isVueOrJs,

  enforce: 'post',

  transform(code, id) {
    if (!parseDurationFunctionCall.test(code)) {
      return;
    }

    const context = createContext({
      parseDuration,
    });

    const s = new MagicString(code);

    walk(this.parse(code) as any, {
      enter(_node) {
        if (_node.type !== 'CallExpression') {
          return;
        }

        const node = _node as SimpleCallExpression;

        if ((node.callee as any).name !== parseDurationFunctionName) {
          return;
        }

        const { start, end } = node as any as { start: number, end: number };

        try {
          const value = runInContext(code.slice(start, end), context);

          s.overwrite(start, end, value.toString());
        }
        catch {}
      },
    });

    if (s.hasChanged()) {
      return {
        code: s.toString(),
        map: s.generateMap({
          source: id,
          hires: true,
          includeContent: true,
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
