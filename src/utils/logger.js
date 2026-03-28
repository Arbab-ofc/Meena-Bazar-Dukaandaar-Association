const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 99
};

const getLevelFromEnv = () => {
  const raw = String(import.meta.env.VITE_LOG_LEVEL || '').toLowerCase();
  if (raw in LEVELS) return raw;
  return import.meta.env.DEV ? 'debug' : 'warn';
};

const activeLevel = getLevelFromEnv();

const safeMeta = (meta) => {
  if (!meta) return undefined;
  try {
    return JSON.parse(JSON.stringify(meta));
  } catch {
    return { note: 'Unserializable meta payload' };
  }
};

const shouldLog = (level) => LEVELS[level] >= LEVELS[activeLevel];

const writeLog = (level, scope, message, meta) => {
  if (!shouldLog(level)) return;

  const prefix = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${scope}] ${message}`;
  const payload = safeMeta(meta);

  if (level === 'error') {
    console.error(prefix, payload || '');
    return;
  }
  if (level === 'warn') {
    console.warn(prefix, payload || '');
    return;
  }
  if (level === 'info') {
    console.info(prefix, payload || '');
    return;
  }
  console.debug(prefix, payload || '');
};

export const createLogger = (scope) => ({
  debug: (message, meta) => writeLog('debug', scope, message, meta),
  info: (message, meta) => writeLog('info', scope, message, meta),
  warn: (message, meta) => writeLog('warn', scope, message, meta),
  error: (message, meta) => writeLog('error', scope, message, meta)
});

export const logger = createLogger('app');
