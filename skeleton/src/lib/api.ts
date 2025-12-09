import { logger } from './grafana-faro';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message ?? `Request failed with status ${response.status}`,
        response.status,
        errorData.code
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      logger.error('API error', {
        endpoint,
        status: error.status,
        message: error.message,
      });
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      logger.error('Request timeout', { endpoint, timeout });
      throw new ApiError('Request timed out', 408);
    }

    logger.error('Network error', {
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new ApiError('Network error', 0);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

export { ApiError };
export type { ApiResponse };
