import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    const dbResult = await pool.query('SELECT NOW()');
    const dbStatus = dbResult.rows.length > 0 ? 'healthy' : 'unhealthy';

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'legal-mails',
      version: '1.0.0',
      database: dbStatus,
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      service: 'legal-mails',
      version: '1.0.0',
      database: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
