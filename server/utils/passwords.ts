import bcrypt from '@node-rs/bcrypt';
import argon2 from '@node-rs/argon2';

function getArgon2Options(): argon2.Options {
  // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#introduction
  return {
    timeCost: 2,
    memoryCost: 32768, // 32mb
  };
}

export async function hashPassword(pass: string): Promise<string> {
  return await argon2.hash(pass, getArgon2Options());
}

export async function verifyPassword(hashedPass: string, pass: string): Promise<boolean> {
  if (hashedPass.startsWith('$argon2'))
    return await argon2.verify(hashedPass, pass, getArgon2Options());

  return await bcrypt.compare(pass, hashedPass);
}
