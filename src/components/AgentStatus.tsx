import React from 'react';
import { User } from 'lucide-react';
import { useCallStore } from '../store/useCallStore';
import type { Agent } from '../types/call';

export const AgentStatus: React.FC = () => {
  const agents = useCallStore((state) => state.agents);
  const updateAgentStatus = useCallStore((state) => state.updateAgentStatus);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Agent Status</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {agents.map((agent) => (
          <div key={agent.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{agent.name}</div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    <span className="text-sm text-gray-500 capitalize">{agent.status}</span>
                  </div>
                </div>
              </div>
              <select
                value={agent.status}
                onChange={(e) => updateAgentStatus(agent.id, e.target.value as Agent['status'])}
                className="rounded-md border-gray-300 text-sm"
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};