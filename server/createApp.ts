// Function to create and configure the Express application instance.
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '@/config'; // Import the config object
import { errorHandler, loggingMiddleware } from '@/middlewares'; // Import loggingMiddleware
import { mainRouter } from '@/routes';

export function createApp(): Application {
  const app = express();
  const port = config.port; // Use config.port

  // Logging Middleware (Apply early)
  app.use(loggingMiddleware);

  // Security Middleware
  app.use(helmet());
  app.use(cors());

  // Body Parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.get('/', (req, res) => {
    res.status(200).json({ status: 'UP', port });
  });
  app.use('/api', mainRouter); // Mount the main router under /api

  // Error Handling Middleware (Must be last)
  app.use(errorHandler);

  // Error Handling Middleware (Must be last)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  // Note: The app.listen call should ideally be outside of createApp
  // in the main index.ts file to allow for easier testing.
  // For now, keeping it here as per existing structure.
  app.listen(port, () => {
    console.log(`Server is   running on port ${port}`);
  });

  return app;
}
