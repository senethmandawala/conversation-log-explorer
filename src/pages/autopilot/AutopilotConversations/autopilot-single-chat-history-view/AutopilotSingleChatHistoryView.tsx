import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ConversationRecord } from "@/types/conversation";
import { StatusBadge, getResolutionVariant, getVdnSourceVariant } from "@/components/conversation/StatusBadge";
import { Calendar, Clock, Phone, Tag, FileText, Building2, MapPin, Timer, Hash, Radio, PhoneOff, Cpu, Mic, Volume2, Globe, ChevronDown, ChevronUp, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ConversationView } from "./conversation-view/ConversationView";

interface AutopilotSingleChatHistoryViewProps {
  record: ConversationRecord | null;
  open: boolean;
  onClose: () => void;
}

interface APICall {
  api_name: string;
  api_status: 'SUCCESS' | 'FAILED';
  api_url?: string;
  api_body?: string;
  api_response?: string;
}

interface MessageItem {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: string;
  audioUrls?: string[];
  textUrls?: string[];
  isPlaying?: boolean;
}

function DetailRow({ label, value, delay = 0 }: { label: string; value: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="flex justify-between items-center py-2">
      <label className="text-sm font-medium text-muted-foreground w-2/5">{label}</label>
      <p className="text-sm text-end w-3/5">{value || <span className="text-muted-foreground">N/A</span>}</p>
    </motion.div>
  );
}

function APICallDetail({ call, index, isExpanded, onToggle }: { call: APICall; index: number; isExpanded: boolean; onToggle: (index: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div 
          className={`flex-1 p-2 border rounded-lg cursor-pointer transition-colors ${
            call.api_status === 'SUCCESS' ? 'border-green-500' : 'border-red-500'
          }`}
          onClick={() => onToggle(index)}
        >
          <span className="text-sm font-medium">{call.api_name}</span>
        </div>
        <div className="flex justify-center">
          <Badge variant={call.api_status === 'SUCCESS' ? 'default' : 'destructive'}>
            {call.api_status === 'SUCCESS' ? 'Success' : 'Failed'}
          </Badge>
        </div>
      </div>
      
      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2 pl-2"
        >
          {call.api_url && (
            <div className="p-2 border border-primary rounded-lg bg-transparent">
              <div className="font-medium mb-1 text-sm">URL</div>
              <pre className="text-xs break-all whitespace-pre-wrap">{call.api_url}</pre>
            </div>
          )}
          {call.api_body && (
            <div className="p-2 border border-primary rounded-lg bg-transparent">
              <div className="font-medium mb-1 text-sm">Request</div>
              <pre className="text-xs break-all whitespace-pre-wrap">{call.api_body}</pre>
            </div>
          )}
          <div className="p-2 border border-primary rounded-lg bg-transparent">
            <div className="font-medium mb-1 text-sm">Response</div>
            <pre className="text-xs break-all whitespace-pre-wrap">{call.api_response}</pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function AutopilotSingleChatHistoryView({ record, open, onClose }: AutopilotSingleChatHistoryViewProps) {
  const [expandedAPIs, setExpandedAPIs] = useState<number[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize messages with audio data
  useEffect(() => {
    if (!record) {
      setMessages([]);
      return;
    }

    const mockMessages: MessageItem[] = [
      {
        content: "Hello, I'm having issues with my billing statement. Can you help me understand the charges?",
        role: 'user',
        timestamp: record.time,
        audioUrls: [],
        textUrls: [],
        isPlaying: false
      },
      {
        content: "I'd be happy to help you with your billing statement. Let me pull up your account information and review the charges with you.",
        role: 'assistant',
        timestamp: record.time,
        audioUrls: [],
        textUrls: [],
        isPlaying: false
      },
      {
        content: "Thank you. I see there's a charge for $45 that I don't recognize. What is this for?",
        role: 'user',
        timestamp: record.time,
        audioUrls: [],
        textUrls: [],
        isPlaying: false
      },
      {
        content: "That charge appears to be for the premium support service that was added to your account last month. This provides 24/7 priority support and extended service hours.",
        role: 'assistant',
        timestamp: record.time,
        audioUrls: [],
        textUrls: [],
        isPlaying: false
      },
      {
        content: "I see. Can you explain what benefits I get with this premium support?",
        role: 'user',
        timestamp: record.time,
        audioUrls: ['/var/www/html/prompts/audio_recording_001.wav'],
        textUrls: [],
        isPlaying: false
      },
      {
        content: "With premium support, you get: 24/7 access to senior support agents, priority queue jumping, extended service hours until 10 PM EST, and guaranteed 15-minute response times for urgent issues.",
        role: 'assistant',
        timestamp: record.time,
        audioUrls: [],
        textUrls: [],
        isPlaying: false
      }
    ];
    setMessages(mockMessages);
  }, [record]);

  if (!record) return null;

  // Mock API calls data
  const mockAPICalls: APICall[] = [
    {
      api_name: "Customer Authentication",
      api_status: "SUCCESS",
      api_url: "https://api.autopilot.com/auth/verify",
      api_body: JSON.stringify({ customerId: record.msisdn }),
      api_response: JSON.stringify({ status: "verified", token: "abc123" })
    },
    {
      api_name: "Category Classification",
      api_status: "SUCCESS", 
      api_url: "https://api.autopilot.com/ai/classify",
      api_body: JSON.stringify({ transcript: "Sample conversation text..." }),
      api_response: JSON.stringify({ category: record.category, confidence: 0.95 })
    },
    {
      api_name: "Response Generation",
      api_status: "FAILED",
      api_url: "https://api.autopilot.com/ai/generate",
      api_body: JSON.stringify({ context: "Customer inquiry..." }),
      api_response: JSON.stringify({ error: "Service timeout", code: 504 })
    }
  ];

  const toggleAPIExpanded = (index: number) => {
    setExpandedAPIs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const isAPIExpanded = (index: number) => expandedAPIs.includes(index);

  // Audio utility functions
  const formatTimestamp = (timestamp: string): string => {
    if (timestamp && timestamp.length === 14) {
      const hour = timestamp.substring(8, 10);
      const minute = timestamp.substring(10, 12);
      const second = timestamp.substring(12, 14);
      return `${hour}:${minute}:${second}`;
    }
    return timestamp;
  };

  const hasValidAudioUrls = (urls: string[]): boolean => {
    return urls && urls.length > 0 && urls.some(url => url && url.trim() !== '' && url.endsWith('.wav'));
  };

  const getAudioUrls = (urls: string[]): string[] => {
    return urls ? urls.filter(url => url && url.trim() !== '' && url.endsWith('.wav')) : [];
  };

  const getFullAudioUrl = (audioUrl: string): string => {
    if (!audioUrl || audioUrl.trim() === '') return '';
    
    if (audioUrl.startsWith('http')) {
      return audioUrl;
    }
    
    // Mock server IP for development
    const serverIp = '192.168.1.100';
    let processedUrl = audioUrl;
    
    if (audioUrl.includes('/var/www/html/prompts/')) {
      const promptsIndex = audioUrl.indexOf('/prompts/');
      processedUrl = audioUrl.substring(promptsIndex);
    }
    
    return `http://${serverIp}${processedUrl}`;
  };

  const getAudioFileName = (audioUrl: string): string => {
    if (!audioUrl) return '';
    const parts = audioUrl.split('/');
    return parts[parts.length - 1] || audioUrl;
  };

  const playThisAudio = (messageIndex: number, audioUrl: string): void => {
    const message = messages[messageIndex];
    if (!message) return;

    if (message.isPlaying && currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      message.isPlaying = false;
      setMessages([...messages]);
      return;
    }

    // Stop any currently playing audio
    if (currentAudioRef.current && !currentAudioRef.current.paused) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    // Reset all playing states
    const updatedMessages = messages.map(msg => ({ ...msg, isPlaying: false }));
    updatedMessages[messageIndex].isPlaying = true;
    setMessages(updatedMessages);

    // Create new audio element and play
    const fullAudioUrl = getFullAudioUrl(audioUrl);
    currentAudioRef.current = new Audio(fullAudioUrl);

    currentAudioRef.current.onended = () => {
      updatedMessages[messageIndex].isPlaying = false;
      setMessages([...updatedMessages]);
    };

    currentAudioRef.current.onerror = () => {
      updatedMessages[messageIndex].isPlaying = false;
      setMessages([...updatedMessages]);
      console.error('Error playing audio:', audioUrl);
    };

    currentAudioRef.current.play().catch(error => {
      console.error('Error playing audio:', error);
      updatedMessages[messageIndex].isPlaying = false;
      setMessages([...updatedMessages]);
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-6xl overflow-y-auto bg-background/95 backdrop-blur-lg border-l border-border/50">
        <SheetHeader className="pb-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <SheetTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              Conversation Details
            </SheetTitle>
          </motion.div>
        </SheetHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6 pr-6 border-r border-border/30">
            {/* Basic Details Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h5 className="text-lg font-semibold mb-4">Details</h5>
              <div className="space-y-1">
                <DetailRow label="Date" value={record.date} delay={0.15} />
                <DetailRow label="Time" value={record.time} delay={0.2} />
                <DetailRow label="MSISDN" value={record.msisdn} delay={0.25} />
                <DetailRow label="Call Duration" value={`${record.duration} seconds`} delay={0.3} />
                <DetailRow label="Category" value={record.category} delay={0.35} />
                <DetailRow label="Subcategory" value={record.subCategory} delay={0.4} />
                <DetailRow label="Call Disconnect Reason" value={record.callDisReason} delay={0.45} />
                <DetailRow label="Unique ID" value={<code className="text-xs bg-muted px-2 py-1 rounded font-mono">{record.uniqueID}</code>} delay={0.5} />
              </div>
            </motion.div>

            {/* Summary Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="flex items-center gap-2 mb-3">
                <h5 className="text-lg font-semibold mb-0">Summary</h5>
                <StatusBadge label={record.resolution} variant={getResolutionVariant(record.resolution)} />
              </div>
              <p className="text-muted-foreground text-sm">
                {record.summary || "No summary available for this conversation."}
              </p>
            </motion.div>

            {/* AI Services Usage */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <h5 className="text-lg font-semibold mb-4">Usage for AI Services</h5>
              <div className="space-y-1">
                <DetailRow label="Prompt Token" value="1,234" delay={0.75} />
                <DetailRow label="Completion Token" value="567" delay={0.8} />
                <DetailRow label="Reasoning Token" value="89" delay={0.85} />
                <DetailRow label="Cached Token" value="234" delay={0.9} />
              </div>
            </motion.div>

            {/* Speech Services Usage */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
              <h5 className="text-lg font-semibold mb-4">Usage for Speech Services</h5>
              <div className="space-y-1">
                <DetailRow label="STT Duration" value="45s" delay={1.0} />
                <DetailRow label="TTS Character Count" value="2,345" delay={1.05} />
              </div>
            </motion.div>

            {/* API Call Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <h5 className="text-lg font-semibold mb-4">API Call Details</h5>
              <div className="space-y-3">
                {mockAPICalls.map((call, index) => (
                  <APICallDetail
                    key={index}
                    call={call}
                    index={index}
                    isExpanded={isAPIExpanded(index)}
                    onToggle={toggleAPIExpanded}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Conversation View */}
          <div className="lg:col-span-3 pl-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }}
              className="h-full"
            >
              <ConversationView
                messages={messages}
                record={record}
                onPlayAudio={playThisAudio}
                formatTimestamp={formatTimestamp}
                hasValidAudioUrls={hasValidAudioUrls}
                getAudioUrls={getAudioUrls}
                getAudioFileName={getAudioFileName}
              />
            </motion.div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
