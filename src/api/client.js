import axios from 'axios';
import config from '../config/env';
import { toApiError } from './errors';

const client = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(req => {
  const token = localStorage.getItem(config.storageKeys.token);
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth endpoints returning 401 mean the credentials were wrong — NOT an
// expired session — so the component shows the reason without a redirect.
const AUTH_ENDPOINTS = ['/auth/login', '/auth/signup'];

client.interceptors.response.use(
  res => res,
  err => {
    const apiError = toApiError(err);

    if (apiError.isUnauthorized) {
      const url = err.config?.url || '';
      if (!AUTH_ENDPOINTS.some(p => url.includes(p))) {
        localStorage.removeItem(config.storageKeys.token);
        localStorage.removeItem(config.storageKeys.user);
        if (window.location.pathname !== '/login') window.location.href = '/login';
      }
    }

    if (config.isDev && !apiError.isValidationError && !apiError.isUnauthorized) {
      console.error(`[api] ${err.config?.method?.toUpperCase()} ${err.config?.url} →`, apiError.status, apiError.message);
    }

    return Promise.reject(apiError);
  }
);

export default client;
