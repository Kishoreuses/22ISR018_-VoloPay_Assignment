// Central API client — reads base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'API request failed');
  }
  return json.data ?? json;
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
