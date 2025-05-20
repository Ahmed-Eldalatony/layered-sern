// Utility class for consistent API response structure.
export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data: T | null,
    public statusCode: number
  ) {}

  static success<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> {
    return new ApiResponse(true, message, data, statusCode);
  }

  static error(message = 'Error', statusCode = 500, data: any = null): ApiResponse<any> {
    return new ApiResponse(false, message, data, statusCode);
  }
}
