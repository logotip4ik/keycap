// https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=3586164#gistcomment-3586164
function hashString(s: string) {
  let h = 0;
  let i = s.length;

  while (i > 0)
    h = (h << 5) - h + s.charCodeAt(--i) | 0;

  return h;
}

// https://github.com/shuding/stable-hash
const table = new WeakMap();
let counter = 0;
function stableHash(arg: any) {
  const type = typeof arg;
  const constructor = arg && arg.constructor;
  const isDate = constructor === Date;

  if (Object(arg) === arg && !isDate && constructor !== RegExp) {
    let result = table.get(arg);
    if (result)
      return result;
    result = `${++counter}~`;
    table.set(arg, result);
    let index;

    if (constructor === Array) {
      // Array.
      result = '@';
      for (index = 0; index < arg.length; index++)
        result += `${stableHash(arg[index])},`;

      table.set(arg, result);
    }
    else if (constructor === Object) {
      // Object, sort keys.
      result = '#';
      const keys = Object.keys(arg).sort();
      // eslint-disable-next-line no-cond-assign
      while ((index = keys.pop()) !== undefined) {
        if (arg[index] !== undefined)
          result += `${index}:${stableHash(arg[index])},`;
      }
      table.set(arg, result);
    }
    return result;
  }
  if (isDate)
    return arg.toJSON();
  if (type === 'symbol')
    return arg.toString();
  return type === 'string' ? JSON.stringify(arg) : `${arg}`;
}

export function hash(arg: any) {
  return hashString(stableHash(arg));
}
