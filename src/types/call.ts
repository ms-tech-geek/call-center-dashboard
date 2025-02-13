export interface Call {
  id: string;
  status: 'incoming' | 'ongoing' | 'completed' | 'transferred' | 'conference';
  phoneNumber: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
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