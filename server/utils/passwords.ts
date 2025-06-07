import argon2 from '@node-rs/argon2';
import bcrypt from '@node-rs/bcrypt';

const argon2Options: argon2.Options = {
  timeCost: 2,
  memoryCost: 32768, // 32mb
};

export function hashPassword(pass: string): Promise<string> {
  return argon2.hash(pass, argon2Options);
}

export function verifyPassword(hashedPass: string, pass: string): Promise<boolean> {
  if (hashedPass.startsWith('$argon2')) {
    return argon2.verify(hashedPass, pass, argon2Options);
  }

  return bcrypt.compare(pass, hashedPass);
}
