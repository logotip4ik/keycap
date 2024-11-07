const ukToEnLetters: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  д: 'd',
  з: 'z',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  ь: '',
  г: 'h',
  ґ: 'g',
  е: 'e',
  и: 'y',
  і: 'i',
};

const enToUkLetters = Object.fromEntries(
  Object.entries(ukToEnLetters).map(([k, v]) => [v, k]),
);

export function transliterate(str: string, map: Record<string, string>) {
  let newString = '';

  for (const char of str) {
    newString += map[char] || char;
  }

  return newString;
}

export const transliterateToEnglish = (str: string) => transliterate(str, ukToEnLetters);
export const transliterateFromEnglish = (str: string) => transliterate(str, enToUkLetters);
