# Legal-Mails Backend

Production-grade EFSP (Electronic Filing Service Provider) backend system.

**Status:** Phase 0 Complete - Server deployed on Railway with PostgreSQL

## Architecture

Legal-Mails is a neutral infrastructure platform that integrates with Tyler Technologies EFM and other court systems.

### 3-Layer Architecture

1. **Client Layer** (e.g., CallSlayer)
   - Calls Legal-Mails API
   - Submits cases via clean JSON API
   - Polls status updates

2. **Legal-Mails Core API Layer**
   - Multi-tenant architecture
   - API key authentication
   - Business logic & validations
   - PostgreSQL persistence
   - Document storage (S3/R2)

3. **Connector Layer**
   - Tyler EFM connector
   - Stub connector (for testing)
   - Status event generation

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# (Update DB credentials, etc.)

# Run development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Submissions (Coming in Phase 2)
- `POST /api/v1/submissions` - Create new submission
- `GET /api/v1/submissions/:id/status` - Get submission status

## Development Phases

- ✅ **Phase 0**: Repo & Server Setup
- ⏳ **Phase 1**: Data Model (tenants, users, submissions, etc.)
- ⏳ **Phase 2**: API Endpoints
- ⏳ **Phase 3**: Stub Connector
- ⏳ **Phase 4**: CallSlayer Integration
- ⏳ **Phase 5**: Real Tyler Integration

## License

PROPRIETARY - All rights reserved