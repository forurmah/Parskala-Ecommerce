// Password hashing with Node's built-in scrypt (no extra dependency).
// Stored format: scrypt$<N>$<r>$<p>$<salt>$<hash>, salt and hash in base64.
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

const KEY_LENGTH = 64;
const OPTIONS = { N: 16384, r: 8, p: 1 };

function deriveKey(password: string, salt: Buffer, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, options, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt, OPTIONS);
  const { N, r, p } = OPTIONS;
  return ["scrypt", N, r, p, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [algorithm, N, r, p, salt, hash] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64");
  const actual = await deriveKey(password, Buffer.from(salt, "base64"), {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  // Constant-time comparison, so timing doesn't leak how much matched.
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
