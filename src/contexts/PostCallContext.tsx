import { createContext, useContext, useState, ReactNode } from "react";

export interface PostCallInstance {
  id: string;
  name: string;
}

interface PostCallContextType {
  selectedInstance: PostCallInstance | null;
  setSelectedInstance: (instance: PostCallInstance | null) => void;
}

const PostCallContext = createContext<PostCallContextType | undefined>(undefined);

export function PostCallProvider({ children }: { children: ReactNode }) {
  const [selectedInstance, setSelectedInstance] = useState<PostCallInstance | null>(null);

  return (
    <PostCallContext.Provider value={{ selectedInstance, setSelectedInstance }}>
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
