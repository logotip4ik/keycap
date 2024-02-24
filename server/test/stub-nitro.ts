import { vitest } from 'vitest';

vitest.stubGlobal('defineEventHandler', (func: any) => func);
vitest.stubGlobal('defineNitroPlugin', (e: any) => e);
vitest.mock('#resolved-paths', () => ({ publicPath: '' }));
