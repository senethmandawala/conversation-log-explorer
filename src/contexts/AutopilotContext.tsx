import { createContext, useContext, useState, ReactNode } from "react";

export interface AutopilotInstance {
  id: string;
  name: string;
  description: string;
  channels: string;
}

export type AutopilotTab = "dashboard" | "conversations" | "reports" | "settings";

interface AutopilotContextType {
  selectedInstance: AutopilotInstance | null;
  setSelectedInstance: (instance: AutopilotInstance | null) => void;
  selectedTab: AutopilotTab;
  setSelectedTab: (tab: AutopilotTab) => void;
}

const AutopilotContext = createContext<AutopilotContextType | undefined>(undefined);

export function AutopilotProvider({ children }: { children: ReactNode }) {
  const [selectedInstance, setSelectedInstance] = useState<AutopilotInstance | null>(null);
  const [selectedTab, setSelectedTab] = useState<AutopilotTab>("dashboard");

  return (
    <AutopilotContext.Provider value={{ selectedInstance, setSelectedInstance, selectedTab, setSelectedTab }}>
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot() {
  const context = useContext(AutopilotContext);
  if (context === undefined) {
    throw new Error("useAutopilot must be used within an AutopilotProvider");
  }
  return context;
}
