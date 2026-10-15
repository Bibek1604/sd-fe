/**
 * Global frontend configuration — the ONLY place import.meta.env is read
 * for app settings. Import `config` from here instead of hard-coding values.
 * See frontend/.env.example for the available variables.
 */
const env = import.meta.env;

const toNumber = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const config = Object.freeze({
  appName: env.VITE_APP_NAME || 'Safety Detective',
  mode: env.MODE,
  isDev: env.DEV,
  isProd: env.PROD,

  api: Object.freeze({
    baseUrl: (env.VITE_API_BASE_URL || '/api').replace(/\/+$/, ''),
    timeout: toNumber(env.VITE_API_TIMEOUT, 15000),
  }),

  storageKeys: Object.freeze({
    token: 'token',
    user: 'user',
  }),
});

export default config;
