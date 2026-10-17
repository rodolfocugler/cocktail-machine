import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'https://cocktail-api-0x99.onrender.com/';
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  || '631600537622-8m9b9bhjk98k4no77c5khes7p6ip0l7m.apps.googleusercontent.com';

// ── Session (localStorage) ────────────────────────────────────────────────────

const SESSION_KEY = 'drinkeiro.session';
const MACHINE_KEY = 'drinkeiro.activeMachineId';
const listeners = new Set();

export const session = {
  get: () => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
  },
  save: (s) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    listeners.forEach((l) => l(s));
  },
  clear: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(MACHINE_KEY);
    listeners.forEach((l) => l(null));
  },
  subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
  getMachineId: () => localStorage.getItem(MACHINE_KEY),
  setMachineId: (id) => localStorage.setItem(MACHINE_KEY, id),
};

// ── Axios + auth refresh ──────────────────────────────────────────────────────

const api = axios.create({baseURL: API_URL, timeout: 30000});

api.interceptors.request.use((config) => {
  const token = session.get()?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Only one refresh in flight; concurrent 401s wait on the same promise
let refreshing = null;

async function refresh() {
  const refreshToken = session.get()?.refreshToken;
  if (!refreshToken) throw new Error('No refresh token');
  const {data} = await axios.post(`${API_URL}api/auth/refresh`, {refreshToken});
  session.save({...data, refreshToken: data.refreshToken || refreshToken});
  return data.accessToken;
}

api.interceptors.response.use(undefined, async (error) => {
  const {config, response} = error;
  const isAuthCall = config?.url?.startsWith('api/auth/');
  if (!response || ![401, 403].includes(response.status) || config._retried || isAuthCall) throw error;
  config._retried = true;
  try {
    refreshing = refreshing || refresh().finally(() => { refreshing = null; });
    const token = await refreshing;
    config.headers.Authorization = `Bearer ${token}`;
    return api(config);
  } catch (e) {
    session.clear();
    throw error;
  }
});

export const errorMessage = (e) => e?.response?.data?.message || e?.message || 'Request failed';

export async function loginWithGoogle(idToken) {
  const {data} = await api.post('api/auth/google', {idToken});
  session.save(data);
}

export async function logout() {
  // Send the token explicitly — the session is cleared before the interceptor runs
  const headers = {Authorization: `Bearer ${session.get()?.accessToken}`};
  api.post('api/auth/logout', null, {headers}).catch(() => {});
  session.clear();
}

export default api;
