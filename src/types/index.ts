// Core entity types will be defined here in Phase 1
// For now, this file serves as a placeholder for future type definitions

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  service: string;
  version: string;
  database: 'healthy' | 'unhealthy';
  error?: string;
}
