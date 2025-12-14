'use client';

import { useEffect, useState } from 'react';
import { MapPin, Star, CheckCircle } from 'lucide-react';
import { addCommunityResource, getCommunityResources, reserveCommunityResource, type CommunityResource } from '@/lib/api';

export function ResourceSharing() {
  const [resources, setResources] = useState<CommunityResource[]>([]);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '', emoji: '🛠️', owner: 'Você', location: 'Cabreúva', distance: '0.5 km', price: 'R$ 0', unit: '/dia', rating: 5,
  });

  useEffect(() => {
    let mounted = true;
    getCommunityResources().then((res) => mounted && setResources(res.resources)).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const seed: CommunityResource[] = [
    {
      name: 'Trator Massey Ferguson',
      emoji: '🚜',
      owner: 'José Carlos',
      location: 'Cabreúva Centro',
      distance: '3.2 km',
      price: 'R$ 200',
      unit: '/dia',
      rating: 4.8,
      available: true
    },
    {
      name: 'Pulverizador 20L',
      emoji: '💦',
      owner: 'Marina Costa',
      location: 'Bairro Rural',
      distance: '1.8 km',
      price: 'R$ 30',
      unit: '/dia',
      rating: 5.0,
      available: true
    },
    {
      name: 'Roçadeira Motorizada',
      emoji: '⚙️',
      owner: 'Antonio Souza',
      location: 'Fazenda Esperança',
      distance: '5.1 km',
      price: 'R$ 80',
      unit: '/dia',
      rating: 4.5,
      available: false
    }
  ];

  return (
    <div className="space-y-2">
      <p className="text-gray-900">Equipamentos Disponíveis</p>

      <div className="bg-white rounded-xl p-4">
        {!adding ? (
          <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm" onClick={() => setAdding(true)}>
            + Anunciar equipamento
          </button>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input className="px-3 py-2 border rounded" placeholder="Nome" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              <input className="px-3 py-2 border rounded" placeholder="Emoji" value={newItem.emoji} onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })} />
              <input className="px-3 py-2 border rounded" placeholder="Preço (ex: R$ 50)" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
              <input className="px-3 py-2 border rounded" placeholder="Unidade (ex: /dia)" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                onClick={async () => {
                  try {
                    const res = await addCommunityResource({ ...newItem, available: true, owner: 'Você', location: 'Cabreúva', distance: '0.5 km', rating: Number(newItem.rating) });
                    setResources(res.resources);
                    setAdding(false);
                    setNewItem({ name: '', emoji: '🛠️', owner: 'Você', location: 'Cabreúva', distance: '0.5 km', price: 'R$ 0', unit: '/dia', rating: 5 });
                  } catch {}
                }}
              >
                Publicar
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm" onClick={() => setAdding(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
      
      {(resources.length ? resources : seed).map((resource, idx) => (
        <div key={idx} className="bg-white rounded-xl p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-4xl">{resource.emoji}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-gray-900 mb-1">{resource.name}</p>
                  <p className="text-sm text-gray-600">{resource.owner}</p>
                </div>
                {resource.available && (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                    <CheckCircle className="size-3" />
                    <span>Disponível</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <span>{resource.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-500 text-yellow-500" />
                  <span>{resource.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl text-gray-900">{resource.price}</span>
                  <span className="text-sm text-gray-600">{resource.unit}</span>
                </div>
                <button
                  disabled={!resource.available}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    resource.available
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  onClick={async () => {
                    try {
                      const res = await reserveCommunityResource(idx);
                      setResources(res.resources);
                    } catch {}
                  }}
                >
                  {resource.available ? 'Reservar' : 'Indisponível'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white rounded-xl p-4 border-l-4 border-green-600">
        <p className="text-sm text-gray-900">
          💡 Alugue equipamentos e economize até 70%
        </p>
      </div>
    </div>
  );
}
