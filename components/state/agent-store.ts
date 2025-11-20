import { create } from "zustand";

export type AgentSection = "assistant" | "visuals" | "video" | "growth";

export type AgentMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

type AgentStore = {
  section: AgentSection;
  setSection: (section: AgentSection) => void;
  messages: AgentMessage[];
  addMessage: (message: AgentMessage) => void;
  setMessages: (messages: AgentMessage[]) => void;
  assetResult?: string;
  setAssetResult: (asset?: string) => void;
  isProcessing: boolean;
  setProcessing: (value: boolean) => void;
  videoStatus?: string;
  setVideoStatus: (status?: string) => void;
};

export const useAgentStore = create<AgentStore>((set) => ({
  section: "assistant",
  setSection: (section) => set({ section }),
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "I am InfluenceOS, your autonomous brand architect. Share your persona, goals, and constraints—I will orchestrate strategy, scripts, visuals, and media to amplify your voice.",
      createdAt: new Date().toISOString()
    }
  ],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  assetResult: undefined,
  setAssetResult: (asset) => set({ assetResult: asset }),
  isProcessing: false,
  setProcessing: (value) => set({ isProcessing: value }),
  videoStatus: undefined,
  setVideoStatus: (status) => set({ videoStatus: status })
}));
