declare module '*.svg' {
  const url: string;
  export default url;
}

declare module '*.ttf' {
  const url: string;
  export default url;
}

declare module '*.html' {
  const url: string;
  export default url;
}

declare module 'virtual:smaller-emoji-mart' {
  import type { Emoji } from '@emoji-mart/data';

  export const emojies: Array<Emoji>;
}
