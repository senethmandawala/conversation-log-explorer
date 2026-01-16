import { getBaseUrl } from '../utils/envConfig';
import { responseInterceptor } from './common/authenticator/responseInterceptor';

// Common Response Types
export interface CommonResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Filters Interface
export interface Filters {
  [key: string]: any;
}

// Login Response (if needed)
export interface LoginResponse {
  token: string;
  user: any;
  expiresIn: number;
}

// Base API Service Class
export class BaseApiService {
  protected baseUrl: string;
  protected authToken: string = '';

  constructor() {
    this.baseUrl = getBaseUrl();
    // You can set auth token here or get it from storage
    this.authToken = this.getAuthToken();
  }

  private getAuthToken(): string {

    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkdJOXhxdXZtc29nOXdXbUVULXR4TV9wYURTUSJ9.eyJpc3MiOiJodHRwczovL3ZvZGFjb21jYW0uY29tcG9zZWFwaS5pbyIsInN1YiI6InN1cGVyX2FkbWluQGdsb2JhbHdhdmVuZXQuY29tIiwiYXVkIjoiaHR0cDovL2dsb2JhbHdhdmVuZXQuY29tL3dhdmVuZXRfcmVzdF9hcGkvIiwiY2lkIjoiaW50ZXJuYWwiLCJleHAiOjE3NjgzOTMyNDgsImF1dGhfdGltZSI6MTc2ODM4NjA0OCwiaWF0IjoxNzY4Mzg2MDQ4LCJqdGkiOiI3cndlMlB6OEx6NVVjQ20yYnoxVVR4OHRkUW50SXBBUFVFa3p4dVE0VFVRIiwic2NwIjpbXX0.qV7Fg48cCKPpcX_woBlblwIhJqSPK-5v8Vj76HQuD6XYDiBzqxt9-Htyt9ZVGgHm1yN2zbG1hWpcuDi0FtUYB-zLUy5Fl2lLNt9xZQYptzs3vqDJL-9CXumdLys84jHFW4oY51imRNBq2pwgOKn3D-3yeihgJx4UYwj1VwqRQ4f9CTtuY_qko86QmCYvLG6C9aAilNm6xqcT4bAZTbJ9kv8b59f1RubUQUUrdGhOjn2Qw5mzNt9vf4Nhq3afhalcrQyxxN254OIjdje2UwV_QLx9_i3r0SQLX6TO06oHLsLQAfG_e-x7RKZeSpVwlMgEuMnJNCMuBa27bFt6WuST_w'

  }

  protected setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<CommonResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.authToken) {
      defaultHeaders['Authorization'] = `Bearer ${this.authToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Create error object with response for interceptor to parse
        const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
        (error as any).response = response;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Use response interceptor to handle auth errors
      const interceptor = responseInterceptor();
      return interceptor.onError!(error);
    }
  }

  protected async get<T>(endpoint: string): Promise<CommonResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  protected async post<T>(
    endpoint: string,
    data?: any
  ): Promise<CommonResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async put<T>(
    endpoint: string,
    data?: any
  ): Promise<CommonResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected async delete<T>(endpoint: string): Promise<CommonResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Call Routing API Service
export class CallRoutingApiService extends BaseApiService {
  
  constructor() {
    super();
  }

  /**
   * Get call insights with pagination
   */
  async getCallInsightsPagination(
    page: number,
    size: number,
    sort: string,
    sortOrder: string,
    filters: Filters
  ): Promise<CommonResponse<PageResponse<any>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: sort,
      sortOrder: sortOrder,
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `/call_logs?${params.toString()}`;
    return this.get<PageResponse<any>>(endpoint);
  }

  /**
   * Get call category percentages
   */
  async getCallCategoryPercentages(
    filters: Filters
  ): Promise<CommonResponse<any>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const endpoint = `/category_percentage?${params.toString()}`;
    return this.get<any>(endpoint);
  }

    async overallPerformanceTrend(
    filters: Filters
  ): Promise<CommonResponse<any>> {
    let queryParams = '';

    if (filters) {
      const params = Object.entries(filters)
        .filter(([key, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
          // Only encode string values that might contain special characters
          if (typeof value === 'string' && (key.includes('name') || key.includes('category') || key.includes('type'))) {
            return `${key}=${encodeURIComponent(value)}`;
          }
          return `${key}=${value}`;
        })
        .join('&');
      
      queryParams = params ? `?${params}` : '';
    }

    const endpoint = `/reports/overall_performance_trends${queryParams}`;
    return this.get<any>(endpoint);
  }


  
    async redAlertMMetric(
    filters: Filters
  ): Promise<CommonResponse<any>> {
    let queryParams = '';

    if (filters) {
      const params = Object.entries(filters)
        .filter(([key, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
          // Only encode string values that might contain special characters
          if (typeof value === 'string' && (key.includes('name') || key.includes('category') || key.includes('type'))) {
            return `${key}=${encodeURIComponent(value)}`;
          }
          return `${key}=${value}`;
        })
        .join('&');
      
      queryParams = params ? `?${params}` : '';
    }

    const endpoint = `/redalert_db${queryParams}`;
    return this.get<any>(endpoint);
  }


    async callStatistics(
    filters: Filters
  ): Promise<CommonResponse<any>> {
    let queryParams = '';

    if (filters) {
      const params = Object.entries(filters)
        .filter(([key, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
          // Only encode string values that might contain special characters
          if (typeof value === 'string' && (key.includes('name') || key.includes('category') || key.includes('type'))) {
            return `${key}=${encodeURIComponent(value)}`;
          }
          return `${key}=${value}`;
        })
        .join('&');
      
      queryParams = params ? `?${params}` : '';
    }

    const endpoint = `/call_statistics${queryParams}`;
    return this.get<any>(endpoint);
  }


  
    async redAlertReasons(
    filters: Filters
  ): Promise<CommonResponse<any>> {
    let queryParams = '';

    if (filters) {
      const params = Object.entries(filters)
        .filter(([key, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
          // Only encode string values that might contain special characters
          if (typeof value === 'string' && (key.includes('name') || key.includes('category') || key.includes('type'))) {
            return `${key}=${encodeURIComponent(value)}`;
          }
          return `${key}=${value}`;
        })
        .join('&');
      
      queryParams = params ? `?${params}` : '';
    }

    const endpoint = `/redalert_reasons${queryParams}`;
    return this.get<any>(endpoint);
  }

    
    async redalertCallLogs(
    filters: Filters
  ): Promise<CommonResponse<any>> {
    let queryParams = '';

    if (filters) {
      const params = Object.entries(filters)
        .filter(([key, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
          // Only encode string values that might contain special characters
          if (typeof value === 'string' && (key.includes('name') || key.includes('category') || key.includes('type'))) {
            return `${key}=${encodeURIComponent(value)}`;
          }
          return `${key}=${value}`;
        })
        .join('&');
      
      queryParams = params ? `?${params}` : '';
    }

    const endpoint = `/redalert_call_logs${queryParams}`;
    return this.get<any>(endpoint);
  }



    async CaseClassification(
    filters: Filters
  ): Promise<CommonResponse<any>> {
    let queryParams = '';

    if (filters) {
      const params = Object.entries(filters)
        .filter(([key, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
          return `${key}=${value}`;
        })
        .join('&');
      
      queryParams = params ? `?${params}` : '';
    }

    const endpoint = `/category_percentage${queryParams}`;
    return this.get<any>(endpoint);
  }

    async CaseClassificationTopSubCategory(
    filters: Filters
  ): Promise<CommonResponse<any>> {
    let params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, value.toString());
        }
      });
    }
    
    return this.get<CommonResponse<any>>(
      `/top_sub_category_by_category?${params}`
    );
  }


    async CaseClassificationSubCategoryList(
    filters: Filters
  ): Promise<CommonResponse<any>> {
    let params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, value.toString());
        }
      });
    }
    
    return this.get<CommonResponse<any>>(
      `/dynamic_top_sub_category_by_category_subcategory?${params}`
    );
  }



}

export const callRoutingApiService = new CallRoutingApiService();
