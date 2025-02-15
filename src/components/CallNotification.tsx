import React from 'react';
import { Phone, X } from 'lucide-react';
import { useCallStore } from '../store/useCallStore';

export const CallNotification: React.FC = () => {
  const activeCall = useCallStore((state) => state.activeCall);
  const setActiveCall = useCallStore((state) => state.setActiveCall);
  const socket = useCallStore((state) => state.socket);

  if (!activeCall || activeCall.status !== 'incoming') return null;

  const handleAnswer = () => {
    if (socket) {
      socket.emit('call:answer', { callId: activeCall.id });
    }
  };

  const handleDecline = () => {
    if (socket) {
      socket.emit('call:decline', { callId: activeCall.id });
    }
    setActiveCall(null);
  };

  return (
    <div className="fixed top-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slide-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Incoming Call</h3>
            <p className="text-sm text-gray-600">{activeCall.phoneNumber}</p>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 flex space-x-3">
        <button
          onClick={handleAnswer}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Answer
        </button>
        <button
          onClick={handleDecline}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
};