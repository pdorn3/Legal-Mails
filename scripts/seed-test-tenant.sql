-- Seed script for test tenant (CallSlayer)
-- Run this manually in Railway's PostgreSQL console or via psql

-- Insert test tenant (CallSlayer)
INSERT INTO tenants (id, name, api_key, status)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'CallSlayer',
  'cs_test_key_12345678901234567890',
  'active'
)
ON CONFLICT (id) DO NOTHING;

-- Insert test user for CallSlayer tenant
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

-- Display the created tenant info
SELECT 
  'Tenant created successfully!' as message,
  id,
  name,
  api_key,
  status
FROM tenants
WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- Display the created user info
SELECT 
  'User created successfully!' as message,
  id,
  email,
  name,
  role
FROM users
WHERE id = 'b0000000-0000-0000-0000-000000000001';
