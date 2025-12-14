'use client';

import { useEffect, useState } from 'react';
import { Plus, Sparkles, TrendingUp, DollarSign, Droplets, Clock, ListTodo, ArrowLeft, AlertTriangle, Calendar, Sun, CloudRain } from 'lucide-react';
import { CropPlanner } from './CropPlanner';
import { getPlanningActive, getPlanningSuggestions, getAISuggestions, type PlanningActivePlan, type PlanningSuggestion } from '@/lib/api';

type PlanTab = null | 'suggestions' | 'active' | 'new';

export function Planejamento({ initialTab, onClose }: { initialTab?: PlanTab; onClose?: () => void } = {}) {
  const [activeTab, setActiveTab] = useState<PlanTab>(initialTab || null);
  const [suggestions, setSuggestions] = useState<PlanningSuggestion[]>([]);
  const [activePlans, setActivePlans] = useState<PlanningActivePlan[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [city, setCity] = useState('');
  const [stateUf, setStateUf] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState('');
  const [prefill, setPrefill] = useState<{ crop?: string; emoji?: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    getPlanningSuggestions().then((res) => mounted && setSuggestions(res.suggestions)).catch(() => {});
    getPlanningActive().then((res) => mounted && setActivePlans(res.plans)).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Initial Menu
  if (activeTab === null) {
    return (
      <div className="space-y-4">
        {/* Menu Options */}
        <div className="space-y-3">
          <button
            onClick={() => setActiveTab('active')}
            className="w-full bg-white rounded-xl p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-100 p-4 rounded-xl">
              <ListTodo className="size-8 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 text-lg mb-1">Planos Ativos</p>
              <p className="text-sm text-gray-600">Acompanhe culturas em andamento</p>
            </div>
            <div className="text-2xl text-blue-600">→</div>
          </button>

          <button
            onClick={() => setActiveTab('suggestions')}
            className="w-full bg-white rounded-xl p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <div className="bg-green-100 p-4 rounded-xl">
              <Sparkles className="size-8 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 text-lg mb-1">Sugestões</p>
              <p className="text-sm text-gray-600">Veja o que a IA recomenda plantar</p>
            </div>
            <div className="text-2xl text-green-600">→</div>
          </button>
        </div>

        {/* Create New Plan Button - Separated */}
        <button
          onClick={() => setActiveTab('new')}
          className="w-full bg-white rounded-xl p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <div className="bg-orange-100 p-4 rounded-xl">
            <Plus className="size-8 text-orange-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-900 text-lg mb-1">Criar Novo Plano</p>
            <p className="text-sm text-gray-600">Monte seu próprio cronograma</p>
          </div>
          <div className="text-2xl text-orange-600">→</div>
        </button>
      </div>
    );
  }

  // Content Views
  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={() => onClose?.()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="size-5" />
        <span>Voltar</span>
      </button>

      {/* Suggestions Content */}
      {activeTab === 'suggestions' && (
        <div className="space-y-2">
          <div className="bg-green-600 rounded-xl p-4 text-white">
            <p className="text-xl mb-1">Sugestões IA</p>
            <p className="text-sm text-green-100">Análise baseada em solo, clima e mercado</p>
          </div>

          <div className="bg-white rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Descreva objetivo (ex: vender na feira, pouca água)"
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cidade"
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
              <input
                value={stateUf}
                onChange={(e) => setStateUf(e.target.value)}
                placeholder="UF"
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  setErrorAI('');
                  setLoadingAI(true);
                  try {
                    const res = await getAISuggestions({ prompt: aiPrompt, city, state: stateUf });
                    const list = res.suggestions || [];
                    setSuggestions(list);
                    if (list.length > 0) {
                      setPrefill({ crop: list[0].crop, emoji: list[0].emoji });
                      setActiveTab('new');
                    }
                  } catch (e) {
                    setErrorAI('Falha ao gerar sugestões.');
                  } finally {
                    setLoadingAI(false);
                  }
                }}
                disabled={loadingAI}
                className={`px-4 py-2 rounded-md text-white ${loadingAI ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {loadingAI ? 'Gerando…' : 'Gerar com IA'}
              </button>
              <button
                onClick={async () => {
                  setErrorAI('');
                  try {
                    const res = await getPlanningSuggestions();
                    setSuggestions(res.suggestions || []);
                  } catch {}
                }}
                className="px-4 py-2 rounded-md border text-gray-700"
              >
                Resetar
              </button>
              {errorAI && <span className="text-sm text-red-600">{errorAI}</span>}
            </div>
          </div>

          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{suggestion.emoji}</div>
                  <div>
                    <p className="text-gray-900 mb-1">{suggestion.crop}</p>
                    <p className="text-xs text-green-600">{suggestion.difficulty}</p>
                  </div>
                </div>
                <div className="text-center bg-green-50 rounded-lg px-3 py-2">
                  <p className="text-2xl text-green-600">{suggestion.score}</p>
                  <p className="text-xs text-gray-600">Score</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <TrendingUp className="size-4 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-900">{suggestion.yield}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <DollarSign className="size-4 text-yellow-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-900">{suggestion.revenue}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <Droplets className="size-4 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-900">{suggestion.water}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <Clock className="size-4 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-900">{suggestion.cycle}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('new');
                  // Passaremos sugestão via estado local simples
                  setPrefill({ crop: suggestion.crop, emoji: suggestion.emoji });
                }}
                className="w-full py-3 bg-green-600 text-white rounded-lg"
              >
                Criar Plano
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Plans Content */}
      {activeTab === 'active' && (
        <div className="space-y-2">
          <div className="bg-blue-600 rounded-xl p-4 text-white">
            <p className="text-xl mb-1">Planos Ativos</p>
            <p className="text-sm text-blue-100">{activePlans.length} culturas em andamento</p>
          </div>

          {activePlans.length > 0 ? (
            activePlans.map((plan, idx) => (
              <div key={idx} className={`bg-white rounded-xl p-4 ${
                plan.alerts.length > 0 ? 'border-l-4 border-orange-500' : ''
              }`}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{plan.emoji}</div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{plan.crop}</p>
                    <p className="text-sm text-gray-500">{plan.area} • Plantado {plan.planted}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-gray-900">{plan.daysRemaining}</p>
                    <p className="text-xs text-gray-500">dias</p>
                  </div>
                </div>

                {/* Health Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl mb-1">{plan.health}%</p>
                    <p className="text-xs text-gray-600">Saúde</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl mb-1">{plan.progress}%</p>
                    <p className="text-xs text-gray-600">Progresso</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl mb-1">{plan.tasks}</p>
                    <p className="text-xs text-gray-600">Tarefas</p>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-600">Saúde da Plantação</p>
                    <p className="text-xs text-gray-900">{plan.health}%</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        plan.health >= 90
                          ? 'bg-green-500'
                          : plan.health >= 80
                          ? 'bg-blue-500'
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${plan.health}%` }}
                    />
                  </div>
                </div>

                {/* Alerts */}
                {plan.alerts.length > 0 && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-3 mb-4 flex items-start gap-3">
                    <AlertTriangle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">Atenção necessária</p>
                      {plan.alerts.map((alert, alertIdx) => (
                        <p key={alertIdx} className="text-xs text-gray-600">• {alert}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weather & Next Task */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    {plan.weather.includes('Chuva') ? (
                      <CloudRain className="size-4 text-blue-500" />
                    ) : (
                      <Sun className="size-4 text-yellow-500" />
                    )}
                    <p className="text-gray-600">{plan.weather}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-gray-400" />
                    <p className="text-gray-600">Colheita prevista: {plan.harvest}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ListTodo className="size-4 text-blue-500" />
                    <p className="text-gray-900">{plan.nextTask}</p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Cronograma Completo
                </button>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <ListTodo className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 mb-2">Nenhum plano ativo</p>
              <p className="text-sm text-gray-600 mb-4">
                Crie um novo plano ou escolha uma sugestão
              </p>
              <button
                onClick={() => { setPrefill(null); setActiveTab('new'); }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg"
              >
                Criar Plano
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Plan Form */}
      {activeTab === 'new' && (
        <CropPlanner
          onClose={() => onClose?.()}
          initialCrop={prefill?.crop}
          initialArea={2}
          initialStartDate={new Date().toISOString().slice(0,10)}
          autoGenerate={Boolean(prefill?.crop)}
          initialEmoji={prefill?.emoji}
        />
      )}
    </div>
  );
}
