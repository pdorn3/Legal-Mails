# Database Scripts

## Seed Test Tenant

To create a test tenant for CallSlayer integration:

### Option 1: Railway PostgreSQL Console

1. Go to your Railway project
2. Click on the **PostgreSQL** service
3. Click **"Data"** tab
4. Click **"Query"** 
5. Copy and paste the contents of `seed-test-tenant.sql`
6. Click **"Run"**

### Option 2: Using psql (if you have local access)

```bash
# Get DATABASE_URL from Railway
# Then run:
psql $DATABASE_URL -f scripts/seed-test-tenant.sql
```

## Test Credentials

After running the seed script, you'll have:

**Tenant:**
- Name: `CallSlayer`
- API Key: `cs_test_key_12345678901234567890`
- ID: `a0000000-0000-0000-0000-000000000001`

**User:**
- Email: `test@callslayer.com`
- Name: `Test User`
- ID: `b0000000-0000-0000-0000-000000000001`

## Testing the API

### Create a submission:

```bash
curl -X POST https://web-production-b1d85.up.railway.app/api/v1/submissions \
  -H "X-API-Key: cs_test_key_12345678901234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "b0000000-0000-0000-0000-000000000001",
    "case_number": "CV-2025-001",
    "case_title": "Test Case",
    "court_name": "Superior Court",
    "filing_type": "Complaint"
  }'
```

### Get submission status:

```bash
curl https://web-production-b1d85.up.railway.app/api/v1/submissions/{submission_id}/status \
  -H "X-API-Key: cs_test_key_12345678901234567890"
```
