'use client';

import { TrendingUp, TrendingDown, MapPin, DollarSign } from 'lucide-react';

export function LocalMarket() {
  const offers = [
    {
      seller: 'Maria Santos',
      product: 'Tomate Orgânico',
      quantity: '500 kg',
      price: 'R$ 4,50',
      unit: '/kg',
      location: '3 km',
      image: '🍅',
      quality: 'Certificado',
      verified: true
    },
    {
      seller: 'Carlos Oliveira',
      product: 'Alface Crespa',
      quantity: '300 un',
      price: 'R$ 2,00',
      unit: '/un',
      location: '2 km',
      image: '🥬',
      quality: 'Sem agrotóxico',
      verified: true
    },
    {
      seller: 'Ana Rodrigues',
      product: 'Cenoura Premium',
      quantity: '400 kg',
      price: 'R$ 3,80',
      unit: '/kg',
      location: '5 km',
      image: '🥕',
      quality: 'Familiar',
      verified: false
    }
  ];

  const trends = [
    { product: 'Tomate', trend: '+12%', up: true },
    { product: 'Alface', trend: '+8%', up: true },
    { product: 'Cenoura', trend: '-3%', up: false },
    { product: 'Couve', trend: '+5%', up: true }
  ];

  return (
    <div className="space-y-2">
      <p className="text-gray-900">Mercado Local</p>

      {/* Trends */}
      <div className="bg-white rounded-xl p-4">
        <p className="text-sm text-gray-600 mb-3">Preços esta semana</p>
        <div className="grid grid-cols-2 gap-2">
          {trends.map((trend, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-900">{trend.product}</span>
              <div className="flex items-center gap-1">
                {trend.up ? (
                  <TrendingUp className="size-4 text-green-500" />
                ) : (
                  <TrendingDown className="size-4 text-red-500" />
                )}
                <span className={`text-sm ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offers */}
      {offers.map((offer, idx) => (
        <div key={idx} className="bg-white rounded-xl p-4">
          <div className="flex gap-3 mb-3">
            <div className="text-4xl">{offer.image}</div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-gray-900 mb-1">{offer.product}</p>
                  <p className="text-sm text-gray-600">{offer.seller}</p>
                </div>
                {offer.verified && (
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    ✓ Verificado
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                <span>{offer.quantity}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <span>{offer.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="size-5 text-green-600" />
                  <span className="text-xl text-gray-900">{offer.price}</span>
                  <span className="text-sm text-gray-600">{offer.unit}</span>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                  Contato
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white rounded-xl p-4 border-l-4 border-green-600">
        <p className="text-sm text-gray-900">
          💰 Venda direta = mais lucro (até 40%)
        </p>
      </div>
    </div>
  );
}