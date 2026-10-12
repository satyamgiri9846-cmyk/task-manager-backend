import bcrypt from 'bcrypt';

// Higher number = more secure but slower. 10-12 is the standard sweet spot.
const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password before saving to the database.
 * Call this during signup, BEFORE creating the User record.
 */
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compares a plain text password (from login form) against
 * the hashed password stored in the database.
 * Returns true/false.
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
