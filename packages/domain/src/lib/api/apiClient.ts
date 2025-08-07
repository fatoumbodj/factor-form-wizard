export interface ApiClient {
  get<T>(url: string, params?: string): Promise<T>;
  post<T>(url: string, data: unknown): Promise<T>;
  patch<T>(url: string, data?: unknown): Promise<T>;
}
