'use client';

import { useState } from 'react';
import { MessageSquare, ShoppingBag } from 'lucide-react';
import { CommunityForum } from './CommunityForum';
import { ResourceSharing } from './ResourceSharing';
import { LocalMarket } from './LocalMarket';

type CommunityTab = 'chat' | 'marketplace';

export function Comunidade() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('chat');

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="bg-white rounded-xl p-1 flex gap-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
            activeTab === 'chat'
              ? 'bg-green-600 text-white'
              : 'text-gray-600'
          }`}
        >
          <MessageSquare className="size-5" />
          <span>Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
            activeTab === 'marketplace'
              ? 'bg-green-600 text-white'
              : 'text-gray-600'
          }`}
        >
          <ShoppingBag className="size-5" />
          <span>Marketplace</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'chat' && <CommunityForum />}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <ResourceSharing />
          <LocalMarket />
        </div>
      )}
    </div>
  );
}