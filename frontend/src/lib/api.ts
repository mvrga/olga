const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('auth_token') ? { 'x-auth-token': localStorage.getItem('auth_token') as string } : {}),
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

export async function authSignup(input: { name: string; email: string; password: string }): Promise<{ ok: boolean; user?: { name: string; email: string }; error?: string }>{
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function authLogin(input: { email: string; password: string }): Promise<{ ok: boolean; token?: string; user?: { name: string; email: string }; error?: string }>{
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function authMe(token?: string): Promise<{ ok: boolean; user?: { name: string; email: string }; error?: string }>{
  const t = token || localStorage.getItem('auth_token') || '';
  return request(`/auth/me?token=${encodeURIComponent(String(t))}`);
}

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
  satellite: {
    label: string;
    location: { lat: number; lon: number };
    ndvi: {
      current_mean: number;
      delta_7d: number;
      last_image_date: string;
      quality: string;
      series_14d: { date: string; ndvi: number }[];
    };
    weather_demo: { label: string; rain_next_7d_mm: number; temp_max_next_3d_c: number };
    insights: string[];
  };
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

export type EventItem = { time: string; type: string; message: string; meta: Record<string, unknown> };
export async function getEvents(): Promise<{ events: EventItem[] }> {
  return request('/events');
}
export async function clearEvents(): Promise<{ cleared: boolean }> {
  return request('/events', { method: 'DELETE' });
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

export async function createPlanningPlan(input: { crop: string; emoji: string; areaHa: number; startDate: string }): Promise<{ created: PlanningActivePlan; plans: PlanningActivePlan[] }> {
  return request('/planning/active', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getAISuggestions(input: { prompt: string; city?: string; state?: string }): Promise<{ suggestions: PlanningSuggestion[] }> {
  return request('/planning/suggestions/ai', {
    method: 'POST',
    body: JSON.stringify(input),
  });
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

export async function postCommunityForum(input: { author: string; message: string; avatar?: string | null; isMe?: boolean }): Promise<{ created: CommunityMessage; messages: CommunityMessage[] }> {
  return request('/community/forum', {
    method: 'POST',
    body: JSON.stringify(input),
  });
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

export async function addCommunityResource(input: {
  name: string;
  emoji: string;
  owner: string;
  location: string;
  distance: string;
  price: string;
  unit: string;
  rating: number;
  available?: boolean;
}): Promise<{ created: CommunityResource; resources: CommunityResource[] }> {
  return request('/community/resources', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function reserveCommunityResource(index: number): Promise<{ resources: CommunityResource[] }> {
  return request(`/community/resources/${index}/reserve`, { method: 'POST' });
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

export async function addCommunityMarketOffer(input: {
  seller: string;
  product: string;
  quantity: string;
  price: string;
  unit: string;
  location: string;
  image: string;
  quality: string;
  verified?: boolean;
}): Promise<{ created: MarketOffer; offers: MarketOffer[]; trends: MarketTrend[] }> {
  return request('/community/market', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
