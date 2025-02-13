import { create } from 'zustand';
import type { Call, Agent } from '../types/call';

interface CallStore {
  calls: Call[];
  agents: Agent[];
  activeCall: Call | null;
  socket: WebSocket | null;
  addCall: (call: Call) => void;
  updateCall: (id: string, updates: Partial<Call>) => void;
  setActiveCall: (call: Call | null) => void;
  updateAgentStatus: (agentId: string, status: Agent['status']) => void;
  initializeSocket: () => void;
}

const SOCKET_URL = import.meta.env.VITE_API_URL || window.location.origin.replace('5173', '3000');

export const useCallStore = create<CallStore>((set) => ({
  calls: [],
  agents: [
    { id: '1', name: 'John Doe', status: 'available' },
    { id: '2', name: 'Jane Smith', status: 'offline' },
  ],
  activeCall: null,
  socket: null,
  addCall: (call) => set((state) => ({ 
    calls: [
      call,
      ...state.calls
    ] 
  })),
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
  initializeSocket: () => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('incoming_call', (data) => {
      console.log('Received incoming call:', data);
      const newCall = {
        id: data.callSid,
        status: 'incoming',
        phoneNumber: data.from,
        duration: 0,
        startTime: new Date(data.startTime)
      };
      
      // Play notification sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2912/2912-preview.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      set((state) => ({ calls: [newCall, ...state.calls] }));
    });

    socket.on('call_status', (data) => {
      console.log('Received call status update:', data);
      set((state) => ({
        calls: state.calls.map(call => 
          call.id === data.callSid 
            ? { ...call, status: data.status.toLowerCase() }
            : call
        )
      }));
    });
    
    set({ socket });
    
    // Fetch initial call logs
    fetch(`${SOCKET_URL}/call-logs`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch call logs');
        }
        return response.json();
      })
      .then(data => {
        if (data.calls) {
          set(state => ({
            calls: data.calls.map((call: any) => ({
              id: call.sid,
              status: call.direction === 'inbound' ? 'incoming' : 'outgoing',
              phoneNumber: call.from,
              duration: parseInt(call.duration) || 0,
              startTime: new Date(call.startTime)
            })).sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
          }));
        }
      })
      .catch(error => console.error('Error fetching call logs:', error));
    
    return () => {
      socket.disconnect();
    };
  }
}));