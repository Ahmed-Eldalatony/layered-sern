// Service for handling Post business logic.
import { IPostRepository } from '@/repositories/post.repository'; // Import the repository interface
import { Post } from '@prisma/client'; // Import Prisma Post type

export interface IPostService {
  createPost(postData: { title: string; content: string; authorId: string }): Promise<Post>;
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | null>;
}

export class PostService implements IPostService {
  private postRepository: IPostRepository;

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository;
  }

  async createPost(postData: { title: string; content: string; authorId: string }): Promise<Post> {
    console.log('createPost service received:', postData);
    // Add any business rules here before creating the post
    // e.g., check author existence, content length limits, etc.
    try {
      const newPost = await this.postRepository.create(postData);
      console.log('createPost service returning:', newPost);
      return newPost;
    } catch (error) {
      console.error('Error in createPost service:', error);
      throw error; // Re-throw the error to be caught by the handler
    }
  }

  async getAllPosts(): Promise<Post[]> {
    console.log('getAllPosts service called');
    try {
      const posts = await this.postRepository.findAll();
      console.log('getAllPosts service returning:', posts);
      return posts;
    } catch (error) {
      console.error('Error in getAllPosts service:', error);
      throw error;
    }
  }

  async getPostById(id: number): Promise<Post | null> {
    console.log('getPostById service called with id:', id);
    try {
      const post = await this.postRepository.findById(id);
      // Add error handling if post is not found
      if (!post) {
        console.warn(`Post with id ${id} not found`);
        // In a real app, you'd throw a custom error like NotFoundError
        // throw new NotFoundError(`Post with id ${id} not found`);
        return null; // Or throw an error
      }
      console.log('getPostById service returning:', post);
      return post;
    } catch (error) {
      console.error('Error in getPostById service:', error);
      throw error;
    }
  }
}
