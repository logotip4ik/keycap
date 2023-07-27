export async function removeFunctionCache(entry: string) {
  const storage = useStorage('nitro:functions:_');

  return await storage.removeItem(`${entry}.json`);
}
