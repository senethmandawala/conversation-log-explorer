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
    // TODO: Uncomment this when you have proper authentication flow
    // return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    
    // FOR NOW: Use hardcoded token
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkdJOXhxdXZtc29nOXdXbUVULXR4TV9wYURTUSJ9.eyJpc3MiOiJodHRwczovL3ZvZGFjb21jYW0uY29tcG9zZWFwaS5pbyIsInN1YiI6InN1cGVyX2FkbWluQGdsb2JhbHdhdmVuZXQuY29tIiwiYXVkIjoiaHR0cDovL2dsb2JhbHdhdmVuZXQuY29tL3dhdmVuZXRfcmVzdF9hcGkvIiwiY2lkIjoiaW50ZXJuYWwiLCJleHAiOjE3NjgzMjM1ODMsImF1dGhfdGltZSI6MTc2ODMxNjM4MywiaWF0IjoxNzY4MzE2MzgzLCJqdGkiOiI2Q2ZfMXBxSVR0QjdYN1V5Y3BCUVRfbWV2OGNPQk5nYk40VlVYNzVLUVdvIiwic2NwIjpbXX0.GQPoExzILpuD5bm3xd-kW0db0Oty4Nw_q_2qJ4jgOL_DS_5gV6d8-76zepfe4_n0jsuQvdFvAqASdm5mI933b7QLBiKSJx_xWaBSLMvBl8oWzjSrR6w5AQP_xDNNTn4dB2WDMz-x7ApAnE8N3dwGyquSXmBcz2t_tw46cc6N_a_bfCQFP35dtueqVEH6mGNTPGOm9fdE-UeG1cpbxG62oB2MshVCb9GrqCRxRuzd_Yu7Yt5SXstX29oZXBysk9BgUmqdxIv9Bb-2X0tSL-srbV_6Sy-_0QBCnv8hUa5r0ObNE8SCFpxJQJqW1UStUa4fIdX4hFk7jG-hGotirIFUgA'
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
        .map(([key, value]) => `${key}=${value}`)
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
        .map(([key, value]) => `${key}=${value}`)
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
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      
      queryParams = params ? `?${params}` : '';
    }

    const endpoint = `/call_statistics${queryParams}`;
    return this.get<any>(endpoint);
  }
}

// Create a singleton instance for use throughout the app
export const callRoutingApiService = new CallRoutingApiService();
