import argon2 from '@node-rs/argon2';
import bcrypt from '@node-rs/bcrypt';

function getArgon2Options(): argon2.Options {
  // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#introduction
  return {
    timeCost: 2,
    memoryCost: 32768, // 32mb
  };
}

export function hashPassword(pass: string): Promise<string> {
  return argon2.hash(pass, getArgon2Options());
}

export function verifyPassword(hashedPass: string, pass: string): Promise<boolean> {
  if (hashedPass.startsWith('$argon2')) {
    return argon2.verify(hashedPass, pass, getArgon2Options());
  }

  return bcrypt.compare(pass, hashedPass);
}
