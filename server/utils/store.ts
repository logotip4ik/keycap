export async function removeFunctionCache(entry: string) {
  const store = useStorage('nitro:functions:_');

  return await store.removeItem(`${entry}.json`);
}
