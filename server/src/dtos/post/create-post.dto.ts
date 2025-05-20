// Data Transfer Object for creating a new post.
// Add class-validator decorators here if validation middleware is used.

export class CreatePostDto {
  title: string;
  content: string;
  authorId: string; // Assuming a simple author ID
}
