import 'dotenv/config';
import { sequelize } from './db.js';
import { User } from '../models/User.js';

const email = process.argv[2];

if (!email) {
  console.error('Usage: node src/utils/make-admin.js <email>');
  process.exit(1);
}

await sequelize.authenticate();

const user = await User.findOne({ where: { email } });

if (!user) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

user.role = 'ADMIN';
await user.save();

console.log(`✅ ${email} is now an ADMIN. Log in again to get a token with the new role.`);
process.exit(0);
