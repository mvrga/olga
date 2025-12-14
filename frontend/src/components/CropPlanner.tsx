'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { createPlanningPlan } from '@/lib/api';

interface CropPlannerProps {
  onClose: () => void;
  initialCrop?: string;
  initialArea?: number | string;
  initialStartDate?: string;
  autoGenerate?: boolean;
  initialEmoji?: string;
}

export function CropPlanner({ onClose, initialCrop, initialArea, initialStartDate, autoGenerate, initialEmoji }: CropPlannerProps) {
  const [selectedCrop, setSelectedCrop] = useState(String(initialCrop || ''));
  const [area, setArea] = useState(String(initialArea ?? ''));
  const [startDate, setStartDate] = useState(() => {
    const d = String(initialStartDate || '');
    if (d) return d;
    return '';
  });
  const [showPlan, setShowPlan] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGeneratePlan = () => {
    if (selectedCrop && area && startDate) {
      setShowPlan(true);
    }
  };

  const plan = {
    crop: selectedCrop,
    area: area,
    activities: [
      { day: 0, activity: 'Preparo do solo', icon: '🚜' },
      { day: 3, activity: 'Plantio', icon: '🌱' },
      { day: 7, activity: 'Primeira irrigação', icon: '💧' },
      { day: 14, activity: 'Controle de ervas', icon: '🌿' },
      { day: 21, activity: 'Adubação', icon: '🧪' },
      { day: 45, activity: 'Monitorar pragas', icon: '🔍' },
      { day: 90, activity: 'Colheita', icon: '🎉' }
    ]
  };

  const cropEmojis: { [key: string]: string } = {
    'Tomate': '🍅',
    'Alface': '🥬',
    'Couve': '🥬',
    'Cenoura': '🥕',
    'Brócolis': '🥦'
  };

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (!startDate) {
      // se vier vazio, manter vazio; se foi pedido autoGenerate, usamos hoje
      if (autoGenerate) setStartDate(today);
    }
    if (autoGenerate) {
      const ok = (String(selectedCrop || '').trim().length > 0) && (String(area || '').trim().length > 0) && (String(startDate || today).trim().length > 0);
      if (ok) setShowPlan(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="bg-green-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-6" />
          <p className="text-xl">{showPlan ? 'Plano Pronto' : 'Novo Plano'}</p>
        </div>
        <button onClick={onClose} className="p-1">
          <X className="size-7" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">{!showPlan ? (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-900">
                💡 Responda 3 perguntas e a IA cria seu cronograma completo
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                1. Qual cultura?
              </label>
              {selectedCrop && !['Tomate','Alface','Couve','Cenoura','Brócolis'].includes(selectedCrop) && (
                <div className="text-xs text-gray-600 mb-2">Sugestão da IA: {selectedCrop}</div>
              )}
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-white"
              >
                <option value="">Escolher</option>
                {selectedCrop && !['Tomate','Alface','Couve','Cenoura','Brócolis'].includes(selectedCrop) && (
                  <option value={selectedCrop}>{cropEmojis[selectedCrop] || '🌱'} {selectedCrop}</option>
                )}
                <option value="Tomate">🍅 Tomate</option>
                <option value="Alface">🥬 Alface</option>
                <option value="Couve">🥬 Couve</option>
                <option value="Cenoura">🥕 Cenoura</option>
                <option value="Brócolis">🥦 Brócolis</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                2. Quantos hectares?
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Ex: 2.5"
                step="0.1"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                3. Quando começar?
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl"
              />
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={!selectedCrop || !area || !startDate}
              className="w-full py-4 bg-green-600 text-white rounded-xl disabled:bg-gray-300 disabled:text-gray-500"
            >
              Gerar Plano
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
              <div className="text-5xl">{cropEmojis[plan.crop]}</div>
              <div>
                <p className="text-xl text-gray-900">{plan.crop}</p>
                <p className="text-sm text-gray-600">{plan.area} ha • 90 dias</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-900">Cronograma</p>
              {plan.activities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                    Dia {activity.day}
                  </div>
                  <span className="text-2xl">{activity.icon}</span>
                  <p className="flex-1 text-sm text-gray-900">{activity.activity}</p>
                  <CheckCircle className="size-5 text-gray-300" />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPlan(false)}
                className="flex-1 py-3 border border-green-600 text-green-600 rounded-lg"
              >
                Voltar
              </button>
              <button
                onClick={async () => {
                  if (saving) return;
                  setSaving(true);
                  try {
                    await createPlanningPlan({ crop: selectedCrop, emoji: cropEmojis[selectedCrop] || initialEmoji || '🌱', areaHa: Number(area), startDate });
                  } catch {}
                  setSaving(false);
                  onClose();
                }}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
