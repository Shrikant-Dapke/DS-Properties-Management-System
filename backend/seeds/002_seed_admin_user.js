'use strict';

/**
 * DS Properties — Seed: Default Admin User
 *
 * Creates the initial admin user with bcrypt-hashed password.
 * Default credentials: admin / admin123 (MUST change in production)
 */

const bcrypt = require('bcrypt');

const ADMIN_USER = {
  name: 'DS Properties Admin',
  username: 'admin',
  password: 'admin123',
  role: 'admin',
};

async function seedAdminUser(client) {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding admin user...');

  const { rows } = await client.query(
    'SELECT id FROM users WHERE username = $1',
    [ADMIN_USER.username],
  );

  if (rows.length > 0) {
    // eslint-disable-next-line no-console
    console.log('   ⏭️  Admin user already exists');
    return;
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(ADMIN_USER.password, saltRounds);

  await client.query(
    `INSERT INTO users (name, username, password_hash, role)
     VALUES ($1, $2, $3, $4)`,
    [ADMIN_USER.name, ADMIN_USER.username, passwordHash, ADMIN_USER.role],
  );

  // eslint-disable-next-line no-console
  console.log('   ✅ Admin user created (username: admin, password: admin123)');
  // eslint-disable-next-line no-console
  console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!');
}

module.exports = seedAdminUser;
