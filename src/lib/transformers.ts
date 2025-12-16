import { ApiConversationRecord } from './api';
import { ConversationRecord } from '@/types/conversation';

export function transformApiToConversationRecord(apiRecord: ApiConversationRecord): ConversationRecord {
  const dateTime = new Date(apiRecord.date_time);
  const date = dateTime.toISOString().split('T')[0];
  const time = dateTime.toTimeString().split(' ')[0];
  
  const durationMinutes = Math.floor(apiRecord.duration / 60);
  const durationSeconds = apiRecord.duration % 60;
  const duration = `${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;

  return {
    id: apiRecord.id.toString(),
    date,
    time,
    msisdn: apiRecord.msisdn,
    category: apiRecord.category,
    subCategory: apiRecord.subcategory || null,
    resolution: apiRecord.call_resolution,
    callDisReason: apiRecord.call_resolution,
    uniqueID: apiRecord.id.toString(),
    summary: apiRecord.status,
    channel: apiRecord.channel,
    department: apiRecord.department === 'N/A' ? null : apiRecord.department,
    city: apiRecord.city === 'N/A' ? null : apiRecord.city,
    vdn: apiRecord.vdn === 'N/A' ? null : apiRecord.vdn,
    vdnSource: apiRecord.vdn_source === 'N/A' ? null : apiRecord.vdn_source,
    duration,
    agentId: apiRecord.agent_id,
    agentName: apiRecord.agent_name,
    status: apiRecord.status,
  };
}
