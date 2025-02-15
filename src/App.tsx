import React from 'react';
import { Phone } from 'lucide-react';
import { CallList } from './components/CallList';
import { CallControls } from './components/CallControls';
import { AgentStatus } from './components/AgentStatus';
import { DialPad } from './components/DialPad';
import { CallNotification } from './components/CallNotification';
import { useCallStore } from './store/useCallStore';

function App() {
  const { initializeSocket } = useCallStore();

  React.useEffect(() => {
    initializeSocket();
  }, [initializeSocket]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Call Center Dashboard
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CallList />
            </div>
            <div className="space-y-6">
              <DialPad />
              <AgentStatus />
            </div>
          </div>
        </div>
      </main>

      <CallControls />
      <CallNotification />
    </div>
  );
}

export default App;