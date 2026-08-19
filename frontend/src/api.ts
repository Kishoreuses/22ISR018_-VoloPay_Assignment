// Central API client — reads base URL from environment variable
let rawBaseUrl = (import.meta.env.VITE_API_URL || '').trim();

// Clean up trailing slash
if (rawBaseUrl.endsWith('/')) {
  rawBaseUrl = rawBaseUrl.slice(0, -1);
}

// Automatically ensure /api is appended if the root domain was provided
if (rawBaseUrl && !rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}

// Fallback to relative /api if empty, or localhost in development
const BASE_URL = rawBaseUrl || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options
    });
  } catch (netErr: any) {
    console.error(`Network fetch failed for ${url}:`, netErr);
    throw new Error(`Network error connecting to backend (${url}). Check VITE_API_URL configuration.`);
  }

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (parseErr) {
    console.error(`Non-JSON response received from ${url}:`, text.slice(0, 200));
    throw new Error(`Invalid response received from server (${res.status} ${res.statusText}).`);
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.error || `Request failed with status ${res.status}`);
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Dashboard
  getDashboard: () => request<any>('/dashboard'),

  // Members
  getMembers: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any[]>(`/members${qs}`);
  },
  getMember: (id: string) => request<any>(`/members/${id}`),
  createMember: (data: any) => request<any>('/members', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id: string, data: any) => request<any>(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Activities
  getActivities: () => request<any[]>('/activities'),
  createActivity: (data: any) => request<any>('/activities', { method: 'POST', body: JSON.stringify(data) }),

  // AI
  getAIRecommendation: (memberId: string) => request<any>('/ai-recommend', { method: 'POST', body: JSON.stringify({ memberId }) }),

  // Invitees (Task 1 & 2)
  getInvitees: () => request<any[]>('/invitees'),
  updateInviteeStatus: (id: string, status: string) => request<any>(`/invitees/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Seed
  resetSeed: () => request<any>('/seed', { method: 'POST' })
};
