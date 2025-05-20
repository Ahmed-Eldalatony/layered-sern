// Repository for handling Post data access using Prisma.
import { Post } from '@prisma/client';
import { CreatePostDto } from '@/dtos/post/create-post.dto';

// Define the interface for the repository methods
export interface IPostRepository {
  create(postData: CreatePostDto): Promise<Post>;
  findAll(): Promise<Post[]>;
  findById(id: number): Promise<Post | null>;
}

export class PostRepository implements IPostRepository {
  private prisma: any;

  constructor(prisma: any) {
    this.prisma = prisma;
  }

  async create(postData: CreatePostDto): Promise<Post> {
    console.log('createPost repository received:', postData);
    try {
      const newPost = await this.prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          authorId: postData.authorId,
          // Prisma handles createdAt automatically if schema uses DateTime @default(now())
          // Since schema uses String, we'll add a timestamp string for now
          createdAt: new Date().toISOString(),
        },
      });
      console.log('createPost repository returning:', newPost);
      return newPost;
    } catch (error) {
      console.error('Error in createPost repository:', error);
      throw error; // Re-throw the error to be caught by the service
    }
  }

  async findAll(): Promise<Post[]> {
    console.log('findAll repository called');
    try {
      const posts = await this.prisma.post.findMany();
      console.log('findAll repository returning:', posts);
      return posts;
    } catch (error) {
      console.error('Error in findAll repository:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Post | null> {
    console.log('findById repository called with id:', id);
    try {
      // Prisma findUnique requires a number for Int IDs
      const post = await this.prisma.post.findUnique({
        where: {
          id: id,
        },
      });
      console.log('findById repository returning:', post);
      return post;
    } catch (error) {
      console.error('Error in findById repository:', error);
      throw error;
    }
  }
}
