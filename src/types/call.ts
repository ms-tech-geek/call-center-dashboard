export interface Call {
  id: string;
  status: 'incoming' | 'outgoing' | 'ongoing' | 'completed' | 'transferred' | 'conference' | 'missed';
  phoneNumber: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  token?: string;
  recordingUrl?: string;
  notes?: string;
  agentId?: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  currentCallId?: string;
}