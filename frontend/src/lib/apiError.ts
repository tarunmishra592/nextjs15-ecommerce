// types/api.ts or lib/apiError.ts
export interface ApiErrorResponse {
    message?: string;
    error?: string;
    [key: string]: any; // Allows for additional error properties
  }
  
  export class ApiError extends Error {
    status: number;
    data: ApiErrorResponse;
    url: string;
  
    constructor(
      message: string,
      status: number,
      url: string,
      data: ApiErrorResponse = {}
    ) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.url = url;
      this.data = data;
  
      // Maintains proper stack trace for where our error was thrown
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ApiError);
      }
    }
  
    toString() {
      return `${this.name}: ${this.message} (Status: ${this.status}, URL: ${this.url})`;
    }
  
    // Optional: Add a method to serialize the error for API responses
    toJSON() {
      return {
        error: this.name,
        message: this.message,
        status: this.status,
        url: this.url,
        ...this.data
      };
    }
}