'use client';

import { AlertTriangle, TrendingUp, Sun, CloudRain, Calendar, CheckCircle, Circle, Plus, Sparkles, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDashboard, toggleDashboardTodo, getEvents, type DashboardData, type EventItem } from '@/lib/api';

export function Dashboard({ onNavigateToPlanning, onNavigateToSuggestions }: { onNavigateToPlanning?: () => void; onNavigateToSuggestions?: () => void }) {
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsOpen, setEventsOpen] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDashboard()
      .then((d) => {
        if (mounted) setData(d);
      })
      .catch(() => {
        // fallback stays null; UI below handles gracefully
      });
    let t: any;
    const loop = async () => {
      try { const res = await getEvents(); setEvents(res.events || []); } catch {}
      t = setTimeout(loop, 2000);
    };
    loop();
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, []);

  const crops = data?.crops || [];
  const todosToday = data?.todosToday || [];
  const todosWeek = data?.todosWeek || [];
  const weatherWeek = (data?.weatherWeek || []).map((w) => ({
    ...w,
    icon: w.rain > 70 ? CloudRain : Sun,
  }));
  const satellite = data?.satellite;

  async function handleToggleToday(index: number) {
    try {
      const next = await toggleDashboardTodo(index);
      setData(next);
    } catch (e) {
      // no-op in demo
    }
  }

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
      {satellite && (
        <div className="bg-white rounded-xl p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-green-600" />
              <p className="text-gray-900">{satellite.label}</p>
            </div>
            <span className="text-xs text-gray-500">Última imagem: {satellite.ndvi.last_image_date}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="h-28 w-full bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3">
                <div className="flex gap-1 h-full items-end">
                  {satellite.ndvi.series_14d.map((p, i) => (
                    <div key={i} title={`${p.date}: ${p.ndvi}`}
                      className="flex-1 bg-green-500/70"
                      style={{ height: `${Math.max(8, Math.min(100, Math.round(p.ndvi * 100)))}%` }} />
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>14 dias</span>
                <span>NDVI médio atual: {satellite.ndvi.current_mean.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-900 mb-1">Variação 7d</p>
                <p className={`text-lg ${satellite.ndvi.delta_7d >= 0 ? 'text-green-600' : 'text-orange-600'}`}>{satellite.ndvi.delta_7d >= 0 ? '+' : ''}{satellite.ndvi.delta_7d.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-900 mb-1">Qualidade</p>
                <p className="text-sm text-gray-600 capitalize">{satellite.ndvi.quality}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-900 mb-1">Clima (demo)</p>
                <p className="text-xs text-gray-600">Chuva 7d: {satellite.weather_demo.rain_next_7d_mm} mm</p>
                <p className="text-xs text-gray-600">Máx. 3d: {satellite.weather_demo.temp_max_next_3d_c}°C</p>
              </div>
            </div>
          </div>
          {satellite.insights?.length > 0 && (
            <div className="mt-3 grid md:grid-cols-3 gap-2">
              {satellite.insights.map((ins, i) => (
                <div key={i} className="bg-green-50 rounded-lg p-2 text-xs text-green-900">• {ins}</div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="bg-white rounded-xl p-4 lg:p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-purple-600" />
            <p className="text-gray-900">Eventos em Tempo Real</p>
            <span className="text-xs text-gray-500">{events.length}</span>
          </div>
          <button onClick={() => setEventsOpen((v) => !v)} className="text-xs text-gray-600 hover:text-gray-900">{eventsOpen ? 'Esconder' : 'Mostrar'}</button>
        </div>
        {eventsOpen && (
          <div className="max-h-64 overflow-y-auto divide-y">
            {events.slice().reverse().map((e, idx) => (
              <div key={idx} className="py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-800">{e.type}</span>
                  <span className="text-[10px] text-gray-500">{new Date(e.time).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-gray-700">{e.message}</p>
              </div>
            ))}
            {events.length === 0 && <div className="text-xs text-gray-500">Sem eventos</div>}
          </div>
        )}
      </div>
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
                <button className="flex-shrink-0" onClick={() => handleToggleToday(idx)}>
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
