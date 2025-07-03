declare module '@/lib/api' {
  type ApiResponse<T> = Promise<{
    success: boolean;
    data?: T;
    message?: string;
  }>;

  export const api: {
    request<T>(endpoint: string, method: string, data?: any): ApiResponse<T>;
    get<T>(endpoint: string): ApiResponse<T>;
    post<T>(endpoint: string, data: any): ApiResponse<T>;
    put<T>(endpoint: string, data: any): ApiResponse<T>;
    delete<T>(endpoint: string): ApiResponse<T>;
  };
}
