const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  try {
    return (await res.json()) as T;
  } catch (err) {
    throw new Error('Resposta inválida do servidor (JSON esperado)');
  }
}

export async function decide(text: string): Promise<{ status?: string; data?: unknown; reply: string }>
{
  return request('/decide', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export { API_BASE };

export type DashboardCrop = {
  name: string;
  emoji: string;
  area: string;
  health: number;
  daysToHarvest: number;
  status: string;
  insight: string;
  planted: string;
  harvest: string;
  progress: number;
  tasks: { task: string; time: string; completed: boolean }[];
  alerts: string[];
  weather: string;
};

export type DashboardData = {
  crops: DashboardCrop[];
  todosToday: { task: string; crop: string; time: string; completed: boolean }[];
  todosWeek: { day: string; task: string; crop: string }[];
  weatherWeek: { day: string; temp: number; rain: number }[];
};

export async function getDashboard(): Promise<DashboardData> {
  return request('/dashboard');
}

export async function toggleDashboardTodo(index: number): Promise<DashboardData> {
  return request('/dashboard/todo/toggle', {
    method: 'POST',
    body: JSON.stringify({ index }),
  });
}

export type PlanningSuggestion = {
  crop: string;
  emoji: string;
  score: number;
  reason: string;
  yield: string;
  revenue: string;
  water: string;
  cycle: string;
  difficulty: string;
};

export type PlanningActivePlan = {
  crop: string;
  emoji: string;
  area: string;
  progress: number;
  daysRemaining: number;
  nextTask: string;
  health: number;
  status: string;
  planted: string;
  harvest: string;
  weather: string;
  tasks: number;
  alerts: string[];
};

export async function getPlanningSuggestions(): Promise<{ suggestions: PlanningSuggestion[] }> {
  return request('/planning/suggestions');
}

export async function getPlanningActive(): Promise<{ plans: PlanningActivePlan[] }> {
  return request('/planning/active');
}

export type CommunityMessage = {
  author: string;
  avatar: string;
  message: string;
  time: string;
  isMe: boolean;
};

export async function getCommunityForum(): Promise<{ messages: CommunityMessage[] }> {
  return request('/community/forum');
}

export type CommunityResource = {
  name: string;
  emoji: string;
  owner: string;
  location: string;
  distance: string;
  price: string;
  unit: string;
  rating: number;
  available: boolean;
};

export async function getCommunityResources(): Promise<{ resources: CommunityResource[] }> {
  return request('/community/resources');
}

export type MarketTrend = { product: string; trend: string; up: boolean };
export type MarketOffer = {
  seller: string;
  product: string;
  quantity: string;
  price: string;
  unit: string;
  location: string;
  image: string;
  quality: string;
  verified: boolean;
};

export async function getCommunityMarket(): Promise<{ trends: MarketTrend[]; offers: MarketOffer[] }> {
  return request('/community/market');
}
