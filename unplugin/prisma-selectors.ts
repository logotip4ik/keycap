import { pathToFileURL } from 'node:url';

import type { ObjectExpression, SimpleCallExpression } from 'estree';
import type { RollupAstNode } from 'rollup';

import MagicString from 'magic-string';
import { createUnplugin } from 'unplugin';
import { walk } from 'estree-walker';
import { parseURL } from 'ufo';

export const selectorFunctionName = 'definePrismaSelectors';
const selectorFunctionCall = /definePrismaSelectors\(/;

export const PrismaSeletorTransformPlugin = createUnplugin(() => ({
  name: 'PrismaSeletorTransformPlugin',

  transformInclude: isJs,

  enforce: 'post',

  transform(code, id) {
    if (!selectorFunctionCall.test(code))
      return;
    console.log('transforming', id);

    const s = new MagicString(code);

    walk(this.parse(code) as any, {
      enter(_node) {
        if (_node.type !== 'CallExpression')
          return;

        const node = _node as RollupAstNode<SimpleCallExpression>;

        if ((node.callee as any).name !== selectorFunctionName)
          return;

        const [_arg] = node.arguments;

        if (_arg.type !== 'ObjectExpression')
          return;

        const arg = _arg as RollupAstNode<ObjectExpression>;
        const selector = code.slice(arg.start, arg.end);

        s.update(node.start, node.end, selector);
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
function isJs(id: string) {
  const { pathname } = parseURL(decodeURIComponent(pathToFileURL(id).href));

  if (pathname.includes('node_modules'))
    return false;

  return jsExtRE.test(pathname);
}
