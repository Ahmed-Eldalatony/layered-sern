// Defines routes for Post-related endpoints.
import { Router } from 'express';
import { PostHandler } from '@/handlers/post.handler'; // Import the handler
import { PostService } from '@/services/post.service'; // Import the service
import express from 'express';
import { PostRepository } from '@/repositories/post.repository'; // Import the repository

// Manual Dependency Injection
import prisma from '@/config/prisma';

// Manual Dependency Injection
const postRepository = new PostRepository(prisma);
const postService = new PostService(postRepository);
const postHandler = new PostHandler(postService);

export const postRouter = express.Router();

// // Define routes and map them to handler methods
postRouter.post('/', (req, res, next) => {
  postHandler.createPost(req, res, next).catch(next);
});

postRouter.get('/', (req, res, next) => { postHandler.getAllPosts(req, res, next).catch(next) });

postRouter.get('/:id', (req, res, next) => {
  postHandler.getPostById(req, res,
    next).catch(next)
}); 
