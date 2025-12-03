/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Insert test tenant (CallSlayer)
  pgm.sql(`
    INSERT INTO tenants (id, name, api_key, status)
    VALUES (
      'a0000000-0000-0000-0000-000000000001',
      'CallSlayer',
      'cs_test_key_12345678901234567890',
      'active'
    )
    ON CONFLICT (id) DO NOTHING;
  `);

  // Insert test user for CallSlayer tenant
  pgm.sql(`
    INSERT INTO users (id, tenant_id, email, name, role, status)
    VALUES (
      'b0000000-0000-0000-0000-000000000001',
      'a0000000-0000-0000-0000-000000000001',
      'test@callslayer.com',
      'Test User',
      'admin',
      'active'
    )
    ON CONFLICT (tenant_id, email) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DELETE FROM users WHERE id = 'b0000000-0000-0000-0000-000000000001';`);
  pgm.sql(`DELETE FROM tenants WHERE id = 'a0000000-0000-0000-0000-000000000001';`);
};
