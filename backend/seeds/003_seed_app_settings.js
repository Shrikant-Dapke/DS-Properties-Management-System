'use strict';

/**
 * DS Properties — Seed: Default App Settings
 *
 * Reference: DATABASE_REVIEW.md — Part 4, Seed Data
 */

const SETTINGS = [
  { key: 'opening_balance', value: '0', description: 'Opening cash balance when system went live' },
  { key: 'company_name', value: 'DS Properties', description: 'Business name for reports' },
  { key: 'currency_symbol', value: '₹', description: 'Currency symbol for display' },
  { key: 'financial_year_start_month', value: '4', description: 'April = Indian FY start (1-12)' },
];

async function seedAppSettings(client) {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding app settings...');

  for (const setting of SETTINGS) {
    const { rows } = await client.query(
      'SELECT id FROM app_settings WHERE key = $1',
      [setting.key],
    );

    if (rows.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`   ⏭️  "${setting.key}" already exists`);
      continue;
    }

    await client.query(
      `INSERT INTO app_settings (key, value, description)
       VALUES ($1, $2, $3)`,
      [setting.key, setting.value, setting.description],
    );
    // eslint-disable-next-line no-console
    console.log(`   ✅ "${setting.key}" = "${setting.value}" seeded`);
  }
}

module.exports = seedAppSettings;
