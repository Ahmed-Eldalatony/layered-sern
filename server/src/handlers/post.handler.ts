// Request handler (Controller) for Post-related endpoints.
import { Request, Response, NextFunction } from 'express';
import { IPostService } from '@/services/post.service'; // Import the service interface
import { CreatePostDto } from '@/dtos/post/create-post.dto'; // Import the DTO
import { ApiResponse } from '@/utils/api-response'; // Import the response utility

export class PostHandler {
  private postService: IPostService;

  constructor(postService: IPostService) {
    this.postService = postService;
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    // In a real app, validation middleware would handle DTO validation
    const postData: CreatePostDto = req.body;
    console.log('createPost handler received:', postData);

    // Basic check (replace with validation middleware later)
    if (!postData.title || !postData.content || !postData.authorId) {
      console.warn('Missing required fields in createPost');
      return res.status(400).json(ApiResponse.error('Missing required fields', 400));
    }

    try {
      const newPost = await this.postService.createPost(postData);
      console.log('createPost handler sending response:', newPost);
      res.status(201).json(ApiResponse.success(newPost, 'Post created successfully', 201));
    } catch (error) {
      console.error('Error in createPost handler:', error);
      next(error); // Pass the error to the error handling middleware
    }
  }

  async getAllPosts(req: Request, res: Response, next: NextFunction) {
    console.log('getAllPosts handler called');
    try {
      const posts = await this.postService.getAllPosts();
      console.log('getAllPosts handler sending response:', posts);
      res.status(200).json(ApiResponse.success(posts, 'Posts retrieved successfully'));
    } catch (error) {
      console.error('Error in getAllPosts handler:', error);
      next(error);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    const postId = parseInt(req.params.id, 10); // Parse ID to number for Prisma
    console.log('getPostById handler called with id:', postId);

    if (isNaN(postId)) {
      console.warn('Invalid post ID in getPostById');
      return res.status(400).json(ApiResponse.error('Invalid post ID', 400));
    }

    try {
      const post = await this.postService.getPostById(postId);

      if (!post) {
        console.warn(`Post with id ${postId} not found`);
        return res.status(404).json(ApiResponse.error(`Post with id ${postId} not found`, 404));
      }

      console.log('getPostById handler sending response:', post);
      res.status(200).json(ApiResponse.success(post, 'Post retrieved successfully'));
    } catch (error) {
      console.error('Error in getPostById handler:', error);
      next(error);
    }
  }
}
