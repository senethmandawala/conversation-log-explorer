import { motion } from "framer-motion";
import { Phone, Cpu, Play, Pause } from "lucide-react";

interface MessageItem {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: string;
  audioUrls?: string[];
  textUrls?: string[];
  isPlaying?: boolean;
}

interface ConversationViewProps {
  messages: MessageItem[];
  record: any;
  onPlayAudio: (messageIndex: number, audioUrl: string) => void;
  formatTimestamp: (timestamp: string) => string;
  hasValidAudioUrls: (urls: string[]) => boolean;
  getAudioUrls: (urls: string[]) => string[];
  getAudioFileName: (audioUrl: string) => string;
}

export function ConversationView({ 
  messages, 
  record, 
  onPlayAudio, 
  formatTimestamp, 
  hasValidAudioUrls, 
  getAudioUrls, 
  getAudioFileName 
}: ConversationViewProps) {
  return (
    <div className="bg-white rounded-xl border border-border/50 h-full overflow-hidden">
      {/* Card Header */}
      <div className="bg-white px-4 py-3 border-b border-border/30">
        <h5 className="mb-0 text-lg font-semibold">Conversation</h5>
      </div>
      
      {/* Card Body */}
      <div className="bg-white px-4 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
        <div className="space-y-4 pt-4">
          {messages.map((message, index) => (
            <div key={index} className="flex gap-3">
              {message.role === 'user' ? (
                <>
                  <div className="flex-1">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <p className="text-sm mb-2 text-break leading-relaxed">
                        {message.content}
                      </p>
                      {hasValidAudioUrls(message.audioUrls || []) && (
                        <div className="flex items-center gap-2 mb-2">
                          <button 
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                              message.isPlaying 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                            onClick={() => onPlayAudio(index, getAudioUrls(message.audioUrls || [])[0])}
                          >
                            {message.isPlaying ? (
                              <Pause className="h-4 w-4 text-white" />
                            ) : (
                              <Play className="h-4 w-4 text-white" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="text-blue-600 text-xs font-medium mb-1">
                              {getAudioFileName(getAudioUrls(message.audioUrls || [])[0])}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-blue-100 rounded-full h-1">
                                <div className="bg-blue-500 h-1 rounded-full" style={{ width: message.isPlaying ? '60%' : '35%' }}></div>
                              </div>
                              <span className="text-blue-600 text-xs">0:35</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <small className="text-blue-600 text-xs">
                          {message.timestamp ? formatTimestamp(message.timestamp) : record.time}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="profile-img flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="profile-img flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Cpu className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <p className="text-sm mb-2 text-break leading-relaxed">
                        {message.content}
                      </p>
                      <div>
                        <small className="text-green-600 text-xs">
                          {message.timestamp ? formatTimestamp(message.timestamp) : record.time}
                        </small>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="bg-white py-2 border-t border-border/30"></div>
    </div>
  );
}
