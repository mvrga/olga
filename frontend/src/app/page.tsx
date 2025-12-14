'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dashboard } from '@/components/Dashboard';
import { Planejamento } from '@/components/Planejamento';
import { Comunidade } from '@/components/Comunidade';
import { DevNav } from '@/components/DevNav';
import { LayoutDashboard, Users, Sprout, LogOut } from 'lucide-react';

type Tab = 'dashboard' | 'comunidade';

export default function Home() {
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
      {/* Header - Responsive */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3 md:px-8 md:py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg md:p-3">
                <Sprout className="size-5 text-white md:size-6" />
              </div>
              <div>
                <h1 className="text-green-900 text-lg md:text-xl">MeuAgronomo</h1>
                <p className="text-xs text-gray-600 md:text-sm">Fazenda São José</p>
              </div>
            </div>
            <div className="size-10 bg-green-600 rounded-full flex items-center justify-center text-white md:size-12">
              <span className="md:text-lg">JS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Responsive */}
      <nav className="bg-white border-b border-gray-200 sticky top-[60px] md:top-[76px] z-40">
        <div className="flex max-w-7xl mx-auto">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`flex-1 md:flex-none md:px-8 flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 md:py-4 transition-colors relative ${
              activeTab === 'dashboard'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutDashboard className="size-5 md:size-4" />
            <span className="text-xs md:text-sm">Início</span>
            {activeTab === 'dashboard' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
          <button
            onClick={() => handleTabChange('comunidade')}
            className={`flex-1 md:flex-none md:px-8 flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 md:py-4 transition-colors relative ${
              activeTab === 'comunidade'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="size-5 md:size-4" />
            <span className="text-xs md:text-sm">Comunidade</span>
            {activeTab === 'comunidade' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="px-4 py-4 pb-20 md:px-8 md:py-6 max-w-7xl mx-auto">
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

      {/* Dev Navigation Helper */}
      <DevNav />
    </div>
  );
}