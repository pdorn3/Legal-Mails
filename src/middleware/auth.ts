import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

// Extend Express Request to include tenant
declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        name: string;
      };
    }
  }
}

export const authenticateTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'API key is required',
      });
      return;
    }

    // Verify API key and get tenant
    const result = await pool.query(
      'SELECT id, name, status FROM tenants WHERE api_key = $1',
      [apiKey]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key',
      });
      return;
    }

    const tenant = result.rows[0];

    if (tenant.status !== 'active') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Tenant account is not active',
      });
      return;
    }

    // Attach tenant to request
    req.tenant = {
      id: tenant.id,
      name: tenant.name,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};
