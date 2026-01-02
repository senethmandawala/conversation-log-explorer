import { createContext, useContext, useState, ReactNode } from "react";

export interface PostCallInstance {
  id: string;
  name: string;
}

export type PostCallTab = "dashboard" | "call-insight" | "agent-performance" | "agent-insights" | "content-uploader" | "reports" | "report-detail" | "configuration";

interface PostCallContextType {
  selectedInstance: PostCallInstance | null;
  setSelectedInstance: (instance: PostCallInstance | null) => void;
  selectedTab: PostCallTab;
  setSelectedTab: (tab: PostCallTab) => void;
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
}

const PostCallContext = createContext<PostCallContextType | undefined>(undefined);

export function PostCallProvider({ children }: { children: ReactNode }) {
  const [selectedInstance, setSelectedInstance] = useState<PostCallInstance | null>(null);
  const [selectedTab, setSelectedTab] = useState<PostCallTab>("dashboard");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  return (
    <PostCallContext.Provider value={{ 
      selectedInstance, setSelectedInstance, 
      selectedTab, setSelectedTab,
      selectedAgentId, setSelectedAgentId,
      selectedReportId, setSelectedReportId
    }}>
      {children}
    </PostCallContext.Provider>
  );
}

export function usePostCall() {
  const context = useContext(PostCallContext);
  if (context === undefined) {
    throw new Error("usePostCall must be used within a PostCallProvider");
  }
  return context;
}
