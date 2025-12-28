
import React from 'react';
import TitleBar from './components/TitleBar';
import ConfigurationPanel from './components/ConfigurationPanel';
import ConsolePanel from './components/ConsolePanel';
import { InjectionProvider } from './context/InjectionContext';

const App: React.FC = () => {
  return (
    <InjectionProvider>
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden border border-white/5 rounded-lg shadow-2xl">
        <TitleBar />
        
        <div className="flex-1 flex p-4 gap-4 overflow-hidden">
          {/* Left Side: Configuration */}
          <div className="w-80 flex flex-col shrink-0">
            <ConfigurationPanel />
          </div>

          {/* Right Side: Console & Output */}
          <div className="flex-1 flex flex-col min-w-0">
            <ConsolePanel />
          </div>
        </div>
      </div>
    </InjectionProvider>
  );
};

export default App;
