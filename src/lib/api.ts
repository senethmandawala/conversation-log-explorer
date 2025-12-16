const API_BASE_URL = 'http://48.217.90.9:3009';
const AUTH_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IkdJOXhxdXZtc29nOXdXbUVULXR4TV9wYURTUSJ9.eyJpc3MiOiJodHRwczovL3ZvZGFjb21jYW0uY29tcG9zZWFwaS5pbyIsInN1YiI6InN1cGVyX2FkbWluQGdsb2JhbHdhdmVuZXQuY29tIiwiYXVkIjoiaHR0cDovL2dsb2JhbHdhdmVuZXQuY29tL3dhdmVuZXRfcmVzdF9hcGkvIiwiY2lkIjoiaW50ZXJuYWwiLCJleHAiOjE3NjU1NTk5NDMsImF1dGhfdGltZSI6MTc2NTU1Mjc0MywiaWF0IjoxNzY1NTUyNzQzLCJqdGkiOiJZSUpPU1dVc19XMGVfZWlrT09ZeUpyazUxZ28yRjN0WGZoWURINHp0OURZIiwic2NwIjpbXX0.VHGaPAXpAcDi5RrWc9tv5BTfmAOJzIGyX9-zOIW2zEWmyfdHisj0rXttU5L1p4SBV8vF8kFJAe2MgsQCDL_Q801bC-MZuU1_ccRWlGCdptUweYAjX4nUJ0c_NZgglDQ6mGBbeGwd5vZSkarxiZRtoNcN-NYefC9R8fdfl7APPEDCt34fvtOhstacwdo0EnDDV8AkTjwAyUZ9NsU2e8Hymd-NmikMMmz_uNx53DnXyMOTwEPcsr0uHPgOByA0V1kIjrng0OG7Tqzt28PkoVHAwnOrH3MZg5yyrCkQznWeXoychRV8VhTWmtQnfeq4d_ugnMDwE5-fwICSUjF8fyqQBA';

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
