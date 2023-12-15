import { createContext, runInContext } from 'node:vm';
import { pathToFileURL } from 'node:url';

import type { Context } from 'node:vm';
import type { SimpleCallExpression } from 'estree';

import MagicString from 'magic-string';
import parseDuration from 'parse-duration';
import { createUnplugin } from 'unplugin';
import { walk } from 'estree-walker';
import { parseQuery, parseURL } from 'ufo';
import { findStaticImports, parseStaticImport } from 'mlly';

const parseDurationSpecifier = 'parse-duration';

export const ParseDurationTransformPlugin = createUnplugin(() => ({
  name: 'ParseDurationTransformPlugin',
  transformInclude: isVueOrJs,
  transform(code, id) {
    if (!code.includes(parseDurationSpecifier))
      return;

    const statements = findStaticImports(code)
      .filter((i) => i.specifier === parseDurationSpecifier);

    if (statements.length === 0) return;

    const contextMap: Context = {};
    const functionNames: Array<string> = [];

    for (const i of statements.flatMap((i) => parseStaticImport(i))) {
      if (i.defaultImport) {
        functionNames.push(i.defaultImport);

        contextMap[i.defaultImport] = parseDuration;
      }
    }

    const context = createContext(contextMap);

    const s = new MagicString(code);

    walk(this.parse(code) as any, {
      enter(_node) {
        if (_node.type !== 'CallExpression') return;

        const node = _node as SimpleCallExpression;

        if (!functionNames.includes((node.callee as any).name))
          return;

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
  if (pathname.endsWith('.vue') && (type === 'script' || !search))
    return true;

  // js files
  return jsExtRE.test(pathname);
}
