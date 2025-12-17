const API_BASE_URL = 'http://48.217.90.9:3009';
const AUTH_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkdJOXhxdXZtc29nOXdXbUVULXR4TV9wYURTUSJ9.eyJpc3MiOiJodHRwczovL3ZvZGFjb21jYW0uY29tcG9zZWFwaS5pbyIsInN1YiI6InN1cGVyX2FkbWluQGdsb2JhbHdhdmVuZXQuY29tIiwiYXVkIjoiaHR0cDovL2dsb2JhbHdhdmVuZXQuY29tL3dhdmVuZXRfcmVzdF9hcGkvIiwiY2lkIjoiaW50ZXJuYWwiLCJleHAiOjE3NjU5NzMyNjUsImF1dGhfdGltZSI6MTc2NTk2NjA2NSwiaWF0IjoxNzY1OTY2MDY1LCJqdGkiOiJhb0Z3NDdNT18yYzJ3MGdiRjhPOGlGdWo2cEVJUE1fWkZRRng5akdXQkxjIiwic2NwIjpbXX0.kSXOZCaIpE-ob4l2RUy2Lmvm5SYJSbK85BFz8ID-EJRuc2JhYN_1FD3XL5mEgoYF9Xg8PrnUcYUrg87iy0cEm59wl2NYxp7MHGnpw4VU8qQ-ivBeJbj-1NFhBS7x57qekT4m6poijKJ5PQ_fIWg-ThRQb9z9uEEOiQSLwjxaFdVAm5lsD8zHrk-QiR9BXG7NrLZtbDC_pFxi5uRx_rZjLsPaeQT8fRGDgTaNh6-3mdmxpPooSl2spUKbH9u6nc-vNi-hDLiojS0frnwr7ihTtOsOmbCPPYY4NCh_Pjg6HrPeCJvztR-b45Cz65G7fNRTvUDiauL4pktqQDpBfwuEtg';

export interface ApiConversationRecord {
  id: number;
  date_time: string;
  agent_id: string;
  agent_name: string;
  channel: string;
  duration: number;
  call_resolution: string;
  status: string;
  category: string;
  subcategory: string;
  city: string;
  department: string;
  vdn: string;
  vdn_source: string;
  msisdn: string;
}

export interface ConversationHistoryResponse {
  status: string;
  message: string;
  data: {
    ConversationHistoryList: ApiConversationRecord[];
    total: number;
  };
}

export interface ConversationHistoryParams {
  page: number;
  size: number;
  sort?: string;
  sortOrder?: 'ASC' | 'DESC';
  fromTime?: string;
  toTime?: string;
  projectId: string;
}

// Post Call Analyzer Stats Types
export interface StatValue {
  value: number | string;
  changePercentage: number;
  unit?: string;
}

export interface PostCallStats {
  stats: {
    totalCalls: StatValue;
    fcrRate: StatValue;
    avgHandlingTime: StatValue;
    openCases: StatValue;
    avgWaitingTime: StatValue;
    avgSilenceTime: StatValue;
  };
}

// Overall Performance Types
export interface PerformanceDataPoint {
  x: string;
  y: number;
}

export interface PerformanceSeries {
  name: string;
  data: PerformanceDataPoint[];
}

export interface OverallPerformanceResponse {
  overallPerformance: {
    range: {
      from: string;
      to: string;
    };
    xAxis: {
      type: string;
      format: string;
    };
    series: PerformanceSeries[];
  };
}

// Fetch Post Call Stats
export async function fetchPostCallStats(): Promise<PostCallStats> {
  const response = await fetch('https://mocki.io/v1/79b22436-498d-4064-a644-e7d4f3c9098d');
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch Overall Performance Data
export async function fetchOverallPerformance(): Promise<OverallPerformanceResponse> {
  const response = await fetch('https://mocki.io/v1/033abba7-c7d4-49da-8383-068c0f539e5a');
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Red Alert Metrics Types
export interface RedAlertMetricsResponse {
  redAlertMetrics: {
    xAxis: { type: string };
    yAxis: { type: string };
    data: { category: string; count: number }[];
  };
}

// Fetch Red Alert Metrics
export async function fetchRedAlertMetrics(): Promise<RedAlertMetricsResponse> {
  const response = await fetch('https://mocki.io/v1/2d270b97-3f13-4f00-ba33-352706dd9c26');
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Case Classification Types
export interface CaseClassificationResponse {
  caseClassification: {
    type: string;
    data: { category: string; count: number }[];
  };
}

// Fetch Case Classification
export async function fetchCaseClassification(): Promise<CaseClassificationResponse> {
  const response = await fetch('https://mocki.io/v1/6f532917-434a-48ae-a95f-1b97236599c7');
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Sentiment Analysis Types
export interface SentimentAnalysisResponse {
  sentimentAnalysis: {
    unit: string;
    data: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
}

// Fetch Sentiment Analysis
export async function fetchSentimentAnalysis(): Promise<SentimentAnalysisResponse> {
  const response = await fetch('https://mocki.io/v1/dfa70a9f-06e1-4e3c-84dc-f20186031976');
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Agent Performance Types
export interface AgentPerformanceResponse {
  agentPerformance: {
    xAxis: { type: string };
    yAxis: { type: string };
    data: { agent: string; value: number }[];
  };
}

// Fetch Agent Performance
export async function fetchAgentPerformance(): Promise<AgentPerformanceResponse> {
  const response = await fetch('https://mocki.io/v1/fb4bcfd9-4527-4468-9818-4e9a4e1909cc');
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchConversationHistory(
  params: ConversationHistoryParams
): Promise<ConversationHistoryResponse> {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
    sort: params.sort || 'call_start_time',
    sortOrder: params.sortOrder || 'DESC',
    projectId: params.projectId,
  });

  if (params.fromTime) {
    queryParams.append('fromTime', params.fromTime);
  }
  if (params.toTime) {
    queryParams.append('toTime', params.toTime);
  }

  const response = await fetch(
    `${API_BASE_URL}/autopilot/conversation_history_list?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Access-Control-Allow-Headers': '*',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
