'use strict';

/**
 * DS Properties — Seed: Default Expense Categories
 *
 * Reference: DATABASE_REVIEW.md — Part 4, Seed Data
 * 7 default categories for construction expenses.
 */

const CATEGORIES = [
  { name: 'Road Construction', slug: 'road-construction', color_hex: '#EF4444', description: 'Internal roads, leveling, surfacing', display_order: 1 },
  { name: 'Gutter & Drainage', slug: 'gutter-drainage', color_hex: '#F97316', description: 'Gutter laying, drainage pipes, stormwater', display_order: 2 },
  { name: 'Boundary Wall', slug: 'boundary-wall', color_hex: '#EAB308', description: 'Compound wall, fencing, gate construction', display_order: 3 },
  { name: 'Labor Charges', slug: 'labor-charges', color_hex: '#8B5CF6', description: 'Daily wages, contractor payments', display_order: 4 },
  { name: 'Materials', slug: 'materials', color_hex: '#06B6D4', description: 'Cement, sand, bricks, steel, hardware', display_order: 5 },
  { name: 'Admin & Legal', slug: 'admin-legal', color_hex: '#64748B', description: 'Registration, documentation, office expenses', display_order: 6 },
  { name: 'Other', slug: 'other', color_hex: '#9CA3AF', description: 'Miscellaneous expenses', display_order: 7 },
];

async function seedCategories(client) {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding expense categories...');

  for (const cat of CATEGORIES) {
    const { rows } = await client.query(
      'SELECT id FROM expense_categories WHERE slug = $1',
      [cat.slug],
    );

    if (rows.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`   ⏭️  "${cat.name}" already exists`);
      continue;
    }

    await client.query(
      `INSERT INTO expense_categories (name, slug, color_hex, description, display_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [cat.name, cat.slug, cat.color_hex, cat.description, cat.display_order],
    );
    // eslint-disable-next-line no-console
    console.log(`   ✅ "${cat.name}" seeded`);
  }
}

module.exports = seedCategories;
