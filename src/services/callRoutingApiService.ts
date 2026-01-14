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
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkdJOXhxdXZtc29nOXdXbUVULXR4TV9wYURTUSJ9.eyJpc3MiOiJodHRwczovL3ZvZGFjb21jYW0uY29tcG9zZWFwaS5pbyIsInN1YiI6InN1cGVyX2FkbWluQGdsb2JhbHdhdmVuZXQuY29tIiwiYXVkIjoiaHR0cDovL2dsb2JhbHdhdmVuZXQuY29tL3dhdmVuZXRfcmVzdF9hcGkvIiwiY2lkIjoiaW50ZXJuYWwiLCJleHAiOjE3Njc5ODA5ODUsImF1dGhfdGltZSI6MTc2Nzk3Mzc4NSwiaWF0IjoxNzY3OTczNzg1LCJqdGkiOiJNTzExMml5NXpEN2U4WmxUZzBxdHQtdEZpcnowVEFHX2pLRHdvb08xaUZZIiwic2NwIjpbXX0.Muc5h17nrNRUfeBsMkbNSethnTW25K7nGfWP2S97iIWI9a4nvTV5tIYDnqyylGcoZFy-AYTfL8Svz9wnbWP9tvPXhIauxNQsXcS1KgbHy_sML8HgPQldKVFxbpvT_NdacnKj-2HxbAV8A1x9JWBCwdDpwItHY0zS9eiwD-2KLkkthKwatBS48TPxUg-zzHm_zlC51ijFl6eHR4uzp1EIIfLTRRAfAcaXImWiGuvncB--VwlA5JFgETyWVicgl_YyMCFU749XsjwGw-W9cmCm1O4XCI_jYOR0U_cdVJWW0zWNznbAbpU2MmMJwv95S71DJAffUzFtU0Slsbn72D8dvA'
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


  
    async redAlertReasons(
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
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      
      queryParams = params ? `?${params}` : '';
    }

    const endpoint = `/redalert_call_logs${queryParams}`;
    return this.get<any>(endpoint);
  }
}

// Create a singleton instance for use throughout the app
export const callRoutingApiService = new CallRoutingApiService();
