import { create } from 'zustand';
import type { Call, Agent } from '../types/call';

interface CallStore {
  calls: Call[];
  agents: Agent[];
  activeCall: Call | null;
  addCall: (call: Call) => void;
  updateCall: (id: string, updates: Partial<Call>) => void;
  setActiveCall: (call: Call | null) => void;
  updateAgentStatus: (agentId: string, status: Agent['status']) => void;
}

export const useCallStore = create<CallStore>((set) => ({
  calls: [],
  agents: [
    { id: '1', name: 'John Doe', status: 'available' },
    { id: '2', name: 'Jane Smith', status: 'offline' },
  ],
  activeCall: null,
  addCall: (call) => set((state) => ({ calls: [...state.calls, call] })),
  updateCall: (id, updates) =>
    set((state) => ({
      calls: state.calls.map((call) =>
        call.id === id ? { ...call, ...updates } : call
      ),
    })),
  setActiveCall: (call) => set({ activeCall: call }),
  updateAgentStatus: (agentId, status) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, status } : agent
      ),
    })),
}));