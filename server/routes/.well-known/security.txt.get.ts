export default defineCachedEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain');

  const nextYear = new Date(Date.now() + parseDuration('1 year')!);

  return `# 01110011 01100101 01100011 01110101 01110010 01101001 01110100 01111001 
Contact: mailto:contact@bogdankostyuk.xyz
Contact: https://t.me/bogdankostyuk
Expires: ${nextYear.toISOString()}
Preferred-Languages: en, ua`;
}, {
  swr: true,
  maxAge: parseDuration('1 week', 'second')!,
  staleMaxAge: parseDuration('6 months', 'second')!,
});
