// Aggregates all feature routers and defines main API routes.
import { Router } from 'express';
import express from 'express';
import { postRouter } from './post.routes'; // Import the post router


export const mainRouter = Router();

// Add feature routers here as they are created
mainRouter.use('/posts', postRouter); // Mount the post router

