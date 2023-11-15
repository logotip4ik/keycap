const letters: Record<string, string> = {
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

export function transliterateToEnglish(chars: string) {
  let newString = '';

  for (const char of chars)
    newString = newString.concat(letters[char] || char);

  return newString;
}
