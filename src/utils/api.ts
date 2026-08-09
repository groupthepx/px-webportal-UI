import axios, { AxiosRequestConfig } from 'axios';

/**
 * Request options interface
 * 
 * @property headers - Custom headers to include in the request
 * @property contentType - Content-Type header. Set to 'multipart/form-data' for file uploads.
 *                        If data is FormData, Content-Type will be automatically handled.
 * @property onUploadProgress - Progress callback for upload requests
 * @property onDownloadProgress - Progress callback for download requests
 * 
 * @example
 * // JSON request
 * await apiClient.post('/api/users', { name: 'John' }, { contentType: 'application/json' });
 * 
 * @example
 * // File upload (FormData)
 * const formData = new FormData();
 * formData.append('file', file);
 * await apiClient.post('/api/upload', formData, { 
 *   contentType: 'multipart/form-data',
 *   onUploadProgress: (progress) => console.log(progress)
 * });
 * 
 * @example
 * // File upload (auto-detected from FormData)
 * const formData = new FormData();
 * formData.append('file', file);
 * await apiClient.post('/api/upload', formData); // Content-Type auto-handled
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  contentType?: 'application/json' | 'multipart/form-data' | string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
}

// Shared API utility that can be used by both client and server
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_BASE_API || process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }


  // จัดการ URL เพื่อรองรับทั้งแบบ relative และ absolute
  private buildUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const normalizedBase = this.baseURL.replace(/\/$/, '');
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    return `${normalizedBase}${normalizedPath}`;
  }


  // Helper method to prepare headers based on data type and options
  private prepareHeaders(data?: any, options?: RequestOptions): Record<string, string> {
    const headers = { ...this.defaultHeaders };

    // Check if data is FormData
    const isFormData = data instanceof FormData;

    // Handle Content-Type
    if (options?.contentType) {
      // Explicit content type from options
      if (options.contentType === 'multipart/form-data' && isFormData) {
        // For FormData, don't set Content-Type - let browser set it with boundary
        delete headers['Content-Type'];
      } else {
        headers['Content-Type'] = options.contentType;
      }
    } else if (isFormData) {
      // Auto-detect FormData - remove Content-Type to let browser set boundary
      delete headers['Content-Type'];
    }
    // If not FormData and no explicit contentType, keep default 'application/json'

    // Merge with custom headers (custom headers take precedence)
    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    return headers;
  }

  // Set authorization header
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Clear authorization header
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Helper to normalize options - supports both old (headers) and new (options) API
  private normalizeOptions(headersOrOptions?: Record<string, string> | RequestOptions): RequestOptions {
    // If it's already a RequestOptions object (has contentType, onUploadProgress, etc.), return as is
    if (headersOrOptions && typeof headersOrOptions === 'object') {
      // Check if it's RequestOptions (has non-header properties) or just headers
      if ('contentType' in headersOrOptions || 
          'onUploadProgress' in headersOrOptions || 
          'onDownloadProgress' in headersOrOptions ||
          ('headers' in headersOrOptions && !('contentType' in headersOrOptions) && 
           !('onUploadProgress' in headersOrOptions) && !('onDownloadProgress' in headersOrOptions))) {
        return headersOrOptions as RequestOptions;
      }
      // Otherwise, treat it as headers (backward compatibility)
      return { headers: headersOrOptions as Record<string, string> };
    }
    return {};
  }

  // Generic GET request - supports both old and new API
  async get<T = any>(
    url: string, 
    headersOrOptions?: Record<string, string> | RequestOptions
  ): Promise<T> {
    try {
      const options = this.normalizeOptions(headersOrOptions);
      const config: AxiosRequestConfig = {
        headers: this.prepareHeaders(undefined, options),
      };
      
      if (options.onDownloadProgress) {
        config.onDownloadProgress = options.onDownloadProgress;
      }

      const response = await axios.get(`${this.buildUrl(url)}`, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic POST request - supports both old and new API
   * 
   * @example
   * // JSON request (default)
   * await apiClient.post('/api/users', { name: 'John', email: 'john@example.com' });
   * 
   * @example
   * // JSON request with explicit content type
   * await apiClient.post('/api/users', { name: 'John' }, { contentType: 'application/json' });
   * 
   * @example
   * // File upload with FormData (auto-detected)
   * const formData = new FormData();
   * formData.append('file', file);
   * formData.append('name', 'John');
   * await apiClient.post('/api/upload', formData);
   * 
   * @example
   * // File upload with progress tracking
   * const formData = new FormData();
   * formData.append('file', file);
   * await apiClient.post('/api/upload', formData, {
   *   contentType: 'multipart/form-data',
   *   onUploadProgress: (progressEvent) => {
   *     const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
   *     console.log(`Upload: ${percent}%`);
   *   }
   * });
   * 
   * @example
   * // Backward compatibility - using headers object
   * await apiClient.post('/api/users', data, { Authorization: 'Bearer token' });
   */
  async post<T = any>(
    url: string, 
    data?: any, 
    headersOrOptions?: Record<string, string> | RequestOptions
  ): Promise<T> {
    try {
      const options = this.normalizeOptions(headersOrOptions);
      const config: AxiosRequestConfig = {
        headers: this.prepareHeaders(data, options),
      };
      
      if (options.onUploadProgress) {
        config.onUploadProgress = options.onUploadProgress;
      }
      if (options.onDownloadProgress) {
        config.onDownloadProgress = options.onDownloadProgress;
      }

      const response = await axios.post(`${this.buildUrl(url)}`, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PUT request - supports both old and new API
  async put<T = any>(
    url: string, 
    data?: any, 
    headersOrOptions?: Record<string, string> | RequestOptions
  ): Promise<T> {
    try {
      const options = this.normalizeOptions(headersOrOptions);
      const config: AxiosRequestConfig = {
        headers: this.prepareHeaders(data, options),
      };
      
      if (options.onUploadProgress) {
        config.onUploadProgress = options.onUploadProgress;
      }
      if (options.onDownloadProgress) {
        config.onDownloadProgress = options.onDownloadProgress;
      }

      const response = await axios.put(`${this.buildUrl(url)}`, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PATCH request - supports both old and new API
  async patch<T = any>(
    url: string, 
    data?: any, 
    headersOrOptions?: Record<string, string> | RequestOptions
  ): Promise<T> {
    try {
      const options = this.normalizeOptions(headersOrOptions);
      const config: AxiosRequestConfig = {
        headers: this.prepareHeaders(data, options),
      };
      
      if (options.onUploadProgress) {
        config.onUploadProgress = options.onUploadProgress;
      }
      if (options.onDownloadProgress) {
        config.onDownloadProgress = options.onDownloadProgress;
      }

      const response = await axios.patch(`${this.buildUrl(url)}`, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic DELETE request - supports both old and new API
  async delete<T = any>(
    url: string, 
    headersOrOptions?: Record<string, string> | RequestOptions
  ): Promise<T> {
    try {
      const options = this.normalizeOptions(headersOrOptions);
      const config: AxiosRequestConfig = {
        headers: this.prepareHeaders(undefined, options),
      };
      
      if (options.onDownloadProgress) {
        config.onDownloadProgress = options.onDownloadProgress;
      }

      const response = await axios.delete(`${this.buildUrl(url)}`, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'API request failed';
      return new Error(message);
    }
    return new Error('Unknown error occurred');
  }
}

// Create a default API client instance
export const apiClient = new ApiClient();

// Server-side API client creator (for NextAuth routes)
export const createServerApiClient = (token?: string): ApiClient => {
  const client = new ApiClient();
  if (token) {
    client.setAuthToken(token);
  }
  return client;
};