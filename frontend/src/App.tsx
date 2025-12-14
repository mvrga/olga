import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Planejamento } from './components/Planejamento';
import { Comunidade } from './components/Comunidade';
import { LayoutDashboard, Users, Sprout } from 'lucide-react';

type Tab = 'dashboard' | 'comunidade';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [planningView, setPlanningView] = useState<'suggestions' | 'active' | 'new' | null>(null);

  const handleNavigateToNewPlan = () => {
    setPlanningView('new');
  };

  const handleNavigateToSuggestions = () => {
    setPlanningView('suggestions');
  };

  const handleClosePlanning = () => {
    setPlanningView(null);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPlanningView(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Sprout className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-green-900 text-lg">MeuAgronomo</h1>
                <p className="text-xs text-gray-600">Fazenda São José</p>
              </div>
            </div>
            <div className="size-10 bg-green-600 rounded-full flex items-center justify-center text-white">
              <span>JS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Mobile Optimized */}
      <nav className="bg-white border-b border-gray-200 sticky top-[60px] z-40">
        <div className="flex">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative ${
              activeTab === 'dashboard'
                ? 'text-green-600'
                : 'text-gray-500'
            }`}
          >
            <LayoutDashboard className="size-5" />
            <span className="text-xs">Início</span>
            {activeTab === 'dashboard' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
          <button
            onClick={() => handleTabChange('comunidade')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative ${
              activeTab === 'comunidade'
                ? 'text-green-600'
                : 'text-gray-500'
            }`}
          >
            <Users className="size-5" />
            <span className="text-xs">Comunidade</span>
            {activeTab === 'comunidade' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="px-4 py-4 pb-20">
        {activeTab === 'dashboard' && !planningView && (
          <Dashboard onNavigateToPlanning={handleNavigateToNewPlan} onNavigateToSuggestions={handleNavigateToSuggestions} />
        )}
        {activeTab === 'dashboard' && planningView && planningView !== 'new' && (
          <Planejamento initialTab={planningView} onClose={handleClosePlanning} />
        )}
        {activeTab === 'comunidade' && <Comunidade />}
      </main>

      {/* Fullscreen New Plan Modal */}
      {planningView === 'new' && (
        <Planejamento initialTab="new" onClose={handleClosePlanning} />
      )}
    </div>
  );
}