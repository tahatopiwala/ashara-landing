import type { Request, Response, NextFunction } from 'express';

// Placeholder auth middleware — currently passes through.
// When authentication is added, this is the single insertion point.
// All admin routes go through this middleware.
export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  // TODO: Validate JWT/session token from Authorization header
  // const token = req.headers.authorization?.replace('Bearer ', '');
  // if (!token) return res.status(401).json({ error: 'Unauthorized' });
  next();
}
