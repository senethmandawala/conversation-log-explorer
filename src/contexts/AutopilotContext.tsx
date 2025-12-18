import { createContext, useContext, useState, ReactNode } from "react";

export interface AutopilotInstance {
  id: string;
  name: string;
  description: string;
  channels: string;
}

interface AutopilotContextType {
  selectedInstance: AutopilotInstance | null;
  setSelectedInstance: (instance: AutopilotInstance | null) => void;
}

const AutopilotContext = createContext<AutopilotContextType | undefined>(undefined);

export function AutopilotProvider({ children }: { children: ReactNode }) {
  const [selectedInstance, setSelectedInstance] = useState<AutopilotInstance | null>(null);

  return (
    <AutopilotContext.Provider value={{ selectedInstance, setSelectedInstance }}>
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
