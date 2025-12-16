import { createContext, useContext, useState, ReactNode } from "react";

interface ModuleContextType {
  showModuleTabs: boolean;
  setShowModuleTabs: (show: boolean) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: ReactNode }) {
  const [showModuleTabs, setShowModuleTabs] = useState(true);

  return (
    <ModuleContext.Provider value={{ showModuleTabs, setShowModuleTabs }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error("useModule must be used within a ModuleProvider");
  }
  return context;
}
