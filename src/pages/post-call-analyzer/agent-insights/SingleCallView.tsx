import { CallLogDetails } from "@/pages/post-call-analyzer/call-insight/CallLogDetails";

interface CallLog {
  id: string;
  date: string;
  time: string;
  msisdn: string;
  category: string;
  subCategory: string;
  callerSentiment: "positive" | "negative" | "neutral";
  score: number;
  status: string;
  statusColor: string;
  isPlaying?: boolean;
}

interface SingleCallViewProps {
  selectedCallLog: CallLog | null;
  agentName: string;
  onClose: () => void;
}

export default function SingleCallView({ selectedCallLog, agentName, onClose }: SingleCallViewProps) {
  return (
    <CallLogDetails
      callLog={selectedCallLog ? {
        id: selectedCallLog.id,
        date: selectedCallLog.date,
        time: selectedCallLog.time,
        msisdn: selectedCallLog.msisdn,
        agent: agentName,
        callDuration: "5:23",
        category: selectedCallLog.category,
        subCategory: selectedCallLog.subCategory,
        userSentiment: selectedCallLog.callerSentiment,
        agentSentiment: "positive",
        summary: "Customer called regarding billing inquiry. Agent successfully resolved the issue by explaining the charges and offering a promotional discount. Customer expressed satisfaction with the resolution.",
        transcription: [
          { speaker: "Agent", text: "Thank you for calling. How may I assist you today?", timestamp: "00:00" },
          { speaker: "Customer", text: "Hi, I have a question about my recent bill.", timestamp: "00:05" },
          { speaker: "Agent", text: "I'd be happy to help you with that. Can you please provide your account number?", timestamp: "00:10" },
          { speaker: "Customer", text: "Sure, it's 12345678.", timestamp: "00:18" },
          { speaker: "Agent", text: "Thank you. I can see your account. What specific charge would you like me to explain?", timestamp: "00:25" },
        ],
      } : null}
      open={!!selectedCallLog}
      onClose={onClose}
    />
  );
}
