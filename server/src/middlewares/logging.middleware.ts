// Middleware for logging incoming requests and outgoing responses.
import { Request, Response, NextFunction } from 'express';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

  // Log response details when the response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} ${res.statusMessage} - ${duration}ms`);
  });

  next();
};
