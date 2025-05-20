import { test, expect } from '@playwright/test';
import { config } from '@/config';

const baseURL = `http://localhost:${config.port}/api`;

test.describe('Posts API Endpoints', () => {
  test('should create a post', async ({ request }) => {
    const newPost = {
      title: 'Test Post',
      content: 'This is a test post content',
      authorId: 'test-author',
    };

    const response = await request.post(`${baseURL}/posts`, {
      data: newPost,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toMatchObject(newPost);
  });

  test('should get all posts', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(Array.isArray(responseBody.data)).toBe(true);
  });

  test('should get a post by ID', async ({ request }) => {
    // First, create a post to ensure there's a post to retrieve
    const newPost = {
      title: 'Test Post',
      content: 'This is a test post content',
      authorId: 'test-author',
    };

    const createResponse = await request.post(`${baseURL}/posts`, {
      data: newPost,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(createResponse.status()).toBe(201);
    const createResponseBody = await createResponse.json();
    const postId = createResponseBody.data.id;

    const response = await request.get(`${baseURL}/posts/${postId}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.id).toBe(postId);
    expect(responseBody.data.title).toBe('Test Post');
  });

  test('should return 404 if post is not found', async ({ request }) => {
    const nonExistentPostId = 9999;
    const response = await request.get(`${baseURL}/posts/${nonExistentPostId}`);
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.success).toBe(false);
    expect(responseBody.message).toContain('Post with id');
  });
});


