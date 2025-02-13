import React from 'react';
import { PhoneIncoming, PhoneOutgoing, PhoneForwarded, PhoneMissed } from 'lucide-react';
import { format } from 'date-fns';
import { useCallStore } from '../store/useCallStore';
import type { Call } from '../types/call';

export const CallList: React.FC = () => {
  const calls = useCallStore((state) => state.calls);
  const setActiveCall = useCallStore((state) => state.setActiveCall);

  const getCallIcon = (status: Call['status']) => {
    switch (status) {
      case 'incoming':
        return <PhoneIncoming className="text-green-500" />;
      case 'outgoing':
      case 'ongoing':
        return <PhoneOutgoing className="text-blue-500" />;
      case 'transferred':
        return <PhoneForwarded className="text-orange-500" />;
      case 'missed':
        return <PhoneMissed className="text-red-500" />;
      default:
        return <PhoneIncoming className="text-gray-500" />;
    }
  };

  const getCallStatusBadge = (status: Call['status']) => {
    const baseClasses = "px-2 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'incoming':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Incoming</span>;
      case 'outgoing':
      case 'ongoing':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Outgoing</span>;
      case 'transferred':
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>Transferred</span>;
      case 'missed':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Missed</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Calls ({calls.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {calls.map((call, index) => {
          const uniqueKey = `${call.id}-${index}`;
          return (
            <div
              key={uniqueKey}
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
                    <span className="mr-2">{call.phoneNumber}</span>
                    {getCallStatusBadge(call.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(call.startTime, 'HH:mm')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{call.duration}s</span>
                </div>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  ); 
};