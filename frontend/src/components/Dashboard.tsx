'use client';

import { AlertTriangle, TrendingUp, Sun, CloudRain, Calendar, CheckCircle, Circle, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function Dashboard({ onNavigateToPlanning, onNavigateToSuggestions }: { onNavigateToPlanning?: () => void; onNavigateToSuggestions?: () => void }) {
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null);

  const todosToday = [
    {
      task: 'Fertilizar tomate',
      crop: '🍅',
      time: '06:00',
      completed: false
    },
    {
      task: 'Colher couve',
      crop: '🥬',
      time: '07:30',
      completed: false
    },
    {
      task: 'Verificar irrigação alface',
      crop: '🥬',
      time: '16:00',
      completed: false
    }
  ];

  const todosWeek = [
    {
      day: 'Ter',
      task: 'Aplicar calda de fumo no tomate',
      crop: '🍅'
    },
    {
      day: 'Qua',
      task: 'Proteger cenoura da chuva',
      crop: '🥕'
    },
    {
      day: 'Qui',
      task: 'Irrigar alface (manhã)',
      crop: '🥬'
    },
    {
      day: 'Sex',
      task: 'Monitorar pragas em geral',
      crop: '🔍'
    },
    {
      day: 'Sáb',
      task: 'Preparar área para brócolis',
      crop: '🥦'
    }
  ];

  const crops = [
    {
      name: 'Couve',
      emoji: '🥬',
      area: '1.5 ha',
      health: 95,
      daysToHarvest: 5,
      status: 'ready',
      insight: 'Preço alto no mercado',
      planted: '10/Nov',
      harvest: '19/Dez',
      progress: 97,
      tasks: [
        { task: 'Colher couve', time: '07:30', completed: false },
        { task: 'Preparar para venda', time: '10:00', completed: false }
      ],
      alerts: [],
      weather: 'Sol, 30°C'
    },
    {
      name: 'Tomate',
      emoji: '🍅',
      area: '3.5 ha',
      health: 92,
      daysToHarvest: 13,
      status: 'healthy',
      insight: 'Fertilizar amanhã',
      planted: '03/Nov',
      harvest: '27/Dez',
      progress: 82,
      tasks: [
        { task: 'Fertilizar tomate', time: '06:00', completed: false },
        { task: 'Verificar tutoramento', time: '15:00', completed: false }
      ],
      alerts: [],
      weather: 'Chuva quarta (80mm)'
    },
    {
      name: 'Cenoura',
      emoji: '🥕',
      area: '2.5 ha',
      health: 68,
      daysToHarvest: 32,
      status: 'warning',
      insight: 'Possível praga',
      planted: '15/Nov',
      harvest: '15/Jan',
      progress: 52,
      tasks: [
        { task: 'Proteger cenoura da chuva', time: 'Quarta', completed: false },
        { task: 'Aplicar controle de pragas', time: 'Quinta', completed: false }
      ],
      alerts: ['Possível ataque de lagarta', 'Proteger da chuva intensa'],
      weather: 'Chuva quarta (80mm)'
    },
    {
      name: 'Alface',
      emoji: '🥬',
      area: '2.0 ha',
      health: 85,
      daysToHarvest: 22,
      status: 'healthy',
      insight: 'Irrigar em 2 dias',
      planted: '22/Nov',
      harvest: '05/Jan',
      progress: 65,
      tasks: [
        { task: 'Verificar irrigação alface', time: '16:00', completed: false },
        { task: 'Irrigar alface (manhã)', time: 'Quinta', completed: false }
      ],
      alerts: [],
      weather: 'Sol, 32°C quinta'
    }
  ];

  const weatherWeek = [
    { day: 'Seg', temp: 30, icon: Sun, rain: 10 },
    { day: 'Ter', temp: 27, icon: Sun, rain: 20 },
    { day: 'Qua', temp: 24, icon: CloudRain, rain: 80 },
    { day: 'Qui', temp: 32, icon: Sun, rain: 5 },
    { day: 'Sex', temp: 29, icon: Sun, rain: 15 }
  ];

  // If a crop is selected, show detailed view
  if (selectedCrop !== null) {
    const crop = crops[selectedCrop];
    
    return (
      <div className="space-y-4">
        {/* Back button */}
        <button
          onClick={() => setSelectedCrop(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
        >
          <span>←</span>
          <span>Voltar</span>
        </button>

        {/* Crop Header */}
        <div className={`bg-white rounded-xl p-5 ${
          crop.status === 'warning' ? 'border-l-4 border-orange-500' : ''
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{crop.emoji}</div>
            <div className="flex-1">
              <p className="text-2xl text-gray-900 mb-1">{crop.name}</p>
              <p className="text-sm text-gray-500">{crop.area} • Plantado {crop.planted}</p>
            </div>
            <div className="text-right">
              {crop.status === 'ready' ? (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                  Pronto para colher
                </div>
              ) : (
                <div>
                  <p className="text-4xl text-gray-900">{crop.daysToHarvest}</p>
                  <p className="text-xs text-gray-500">dias p/ colheita</p>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-3xl mb-1">{crop.health}%</p>
              <p className="text-xs text-gray-600">Saúde</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-3xl mb-1">{crop.progress}%</p>
              <p className="text-xs text-gray-600">Progresso</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-3xl mb-1">{crop.tasks.length}</p>
              <p className="text-xs text-gray-600">Tarefas</p>
            </div>
          </div>

          {/* Health Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Saúde da Plantação</p>
              <p className="text-sm text-gray-900">{crop.health}%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  crop.health >= 90
                    ? 'bg-green-500'
                    : crop.health >= 80
                    ? 'bg-blue-500'
                    : 'bg-orange-500'
                }`}
                style={{ width: `${crop.health}%` }}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Progresso do Ciclo</p>
              <p className="text-sm text-gray-900">{crop.progress}%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-blue-500"
                style={{ width: `${crop.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Alerts */}
        {crop.alerts.length > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 mb-2">Atenção necessária</p>
                {crop.alerts.map((alert, idx) => (
                  <p key={idx} className="text-sm text-gray-600 mb-1">• {alert}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              {crop.weather.includes('Chuva') ? (
                <CloudRain className="size-5 text-blue-500" />
              ) : (
                <Sun className="size-5 text-yellow-500" />
              )}
              <p className="text-gray-900">Clima Importante</p>
            </div>
            <p className="text-gray-600">{crop.weather}</p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="size-5 text-gray-600" />
              <p className="text-gray-900">Colheita Prevista</p>
            </div>
            <p className="text-gray-600">{crop.harvest}</p>
          </div>
        </div>

        {/* Insight */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2">
            {crop.status === 'ready' && <TrendingUp className="size-5 text-green-600" />}
            {crop.status === 'warning' && <AlertTriangle className="size-5 text-orange-500" />}
            {crop.status === 'healthy' && <Calendar className="size-5 text-blue-500" />}
            <p className="text-gray-600">{crop.insight}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Crop Selection Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {crops.map((crop, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCrop(idx)}
            className="bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition-colors aspect-square"
          >
            <div className="text-6xl">{crop.emoji}</div>
            <p className="text-gray-900">{crop.name}</p>
          </button>
        ))}
      </div>

      {/* Create New Plan Button */}
      {onNavigateToPlanning && (
        <button
          onClick={onNavigateToPlanning}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-2 border-dashed border-gray-300"
        >
          <div className="bg-green-100 p-3 rounded-xl">
            <Plus className="size-6 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-900">Criar Novo Plano</p>
            <p className="text-xs text-gray-600">Monte seu próprio cronograma</p>
          </div>
          <div className="text-2xl text-green-600">→</div>
        </button>
      )}

      {/* Desktop: 2 columns layout for To-Dos and Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* To-Do Hoje */}
        <div className="bg-white rounded-xl p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-900">Tarefas de Hoje</p>
            <p className="text-xs text-gray-500">Segunda, 14 Dez</p>
          </div>
          
          <div className="space-y-2">
            {todosToday.map((todo, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <button className="flex-shrink-0">
                  {todo.completed ? (
                    <CheckCircle className="size-6 text-green-600" />
                  ) : (
                    <Circle className="size-6 text-gray-300" />
                  )}
                </button>
                <div className="text-2xl">{todo.crop}</div>
                <div className="flex-1">
                  <p className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {todo.task}
                  </p>
                  <p className="text-xs text-gray-500">{todo.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather - Simplified */}
        <div className="bg-white rounded-xl p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-sm">Clima</p>
              <p className="text-3xl text-gray-900">28°</p>
            </div>
            <Sun className="size-12 text-yellow-500" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 lg:justify-between">
            {weatherWeek.map((day, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-16 lg:flex-1 text-center p-3 rounded-lg ${
                  day.rain > 70 ? 'bg-orange-50' : 'bg-gray-50'
                }`}
              >
                <p className="text-xs text-gray-600 mb-2">{day.day}</p>
                <day.icon className={`size-6 mx-auto mb-2 ${
                  day.rain > 70 ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <p className="text-gray-900 mb-1">{day.temp}°</p>
                <p className="text-xs text-blue-600">{day.rain}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions Button */}
      {onNavigateToSuggestions && (
        <button
          onClick={onNavigateToSuggestions}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <div className="bg-green-100 p-3 rounded-xl">
            <Sparkles className="size-6 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-900">Sugestões</p>
            <p className="text-xs text-gray-600">Veja o que a IA recomenda plantar</p>
          </div>
          <div className="text-2xl text-green-600">→</div>
        </button>
      )}

      {/* To-Do Semana */}
      <div className="bg-white rounded-xl p-4 lg:p-5">
        <p className="text-gray-900 mb-3">Próximos Dias</p>
        
        <div className="space-y-2">
          {todosWeek.map((todo, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium w-10 text-center">
                {todo.day}
              </div>
              <div className="text-2xl">{todo.crop}</div>
              <p className="flex-1 text-sm text-gray-900">{todo.task}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}