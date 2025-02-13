import React from 'react';
import { Phone, PhoneOff, UserPlus, Mic, MicOff, SwordIcon as Record } from 'lucide-react';
import { useCallStore } from '../store/useCallStore';

export const CallControls: React.FC = () => {
  const activeCall = useCallStore((state) => state.activeCall);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);

  if (!activeCall) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Call with {activeCall.phoneNumber}
          </span>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            {activeCall.duration}s
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            } hover:bg-gray-200`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-full ${
              isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            } hover:bg-gray-200`}
          >
            <Record size={20} />
          </button>
          
          <button
            className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <UserPlus size={20} />
          </button>
          
          <button
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};