import { tokenStorage } from '@/auth/tokenStorage';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.169:8080/api';

export const api = axios.create({ baseURL: API_BASE_URL });


type TokenRefreshedCallback = (accessToken: string) => void;
type ForceLogoutCallback = () => void;

let onTokenRefreshed: TokenRefreshedCallback | null = null;
let onForceLogout: ForceLogoutCallback | null = null;

export function registerAuthCallbacks(
  refreshed: TokenRefreshedCallback,
  forceLogout: ForceLogoutCallback
) {
  onTokenRefreshed = refreshed;
  onForceLogout = forceLogout;
}

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // queue this request until the in-flight refresh finishes
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
        deviceId: "mobile"
      });

      await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      onTokenRefreshed?.(data.accessToken);
      flushQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      await tokenStorage.clearTokens();
      onForceLogout?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);