import { Server } from 'socket.io';
import { CallHandler } from './handlers/call-handler';

export function setupWebSocket(io: Server, callHandler: CallHandler) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle agent status updates
    socket.on('agent:status', (data) => {
      io.emit('agent:status:updated', data);
    });

    // Handle call events
    socket.on('call:answer', async (data) => {
      try {
        // Implementation for when an agent answers a call
        io.emit('call:answered', {
          callId: data.callId,
          agentId: data.agentId
        });
      } catch (error) {
        console.error('Error handling call answer:', error);
      }
    });

    socket.on('call:end', async (data) => {
      try {
        // Implementation for ending a call
        io.emit('call:ended', {
          callId: data.callId
        });
      } catch (error) {
        console.error('Error ending call:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}