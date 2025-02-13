import React from 'react';
import { Phone, PhoneIncoming, PhoneForwarded } from 'lucide-react';
import { format } from 'date-fns';
import { useCallStore } from '../store/useCallStore';
import type { Call } from '../types/call';

export const CallList: React.FC = () => {
  const calls = useCallStore((state) => state.calls);
  const setActiveCall = useCallStore((state) => state.setActiveCall);

  const getCallIcon = (status: Call['status']) => {
    switch (status) {
      case 'incoming':
        return <PhoneIncoming className="text-blue-500" />;
      case 'transferred':
        return <PhoneForwarded className="text-orange-500" />;
      default:
        return <Phone className="text-green-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recent Calls</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {calls.map((call) => (
          <div
            key={call.id}
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => setActiveCall(call)}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-full">
                {getCallIcon(call.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {call.phoneNumber}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(call.startTime, 'HH:mm')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{call.status}</span>
                  <span>•</span>
                  <span>{call.duration}s</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};