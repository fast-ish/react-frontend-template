'use client';

import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { useEffect } from 'react';

const FARO_URL = process.env.NEXT_PUBLIC_FARO_URL;
const FARO_APP_NAME = process.env.NEXT_PUBLIC_FARO_APP_NAME ?? '${{values.name}}';
const FARO_APP_VERSION = process.env.NEXT_PUBLIC_FARO_APP_VERSION ?? '0.1.0';
const FARO_ENVIRONMENT = process.env.NEXT_PUBLIC_FARO_ENVIRONMENT ?? 'development';

let faro: ReturnType<typeof initializeFaro> | null = null;

function initFaro() {
  if (faro || typeof window === 'undefined') return;
  if (!FARO_URL) {
    console.warn('Grafana Faro: Missing collector URL');
    return;
  }

  faro = initializeFaro({
    url: FARO_URL,
    app: {
      name: FARO_APP_NAME,
      version: FARO_APP_VERSION,
      environment: FARO_ENVIRONMENT,
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: true,
      }),
      new TracingInstrumentation(),
    ],
    sessionTracking: {
      enabled: true,
      persistent: true,
    },
  });
}

export function GrafanaFaroInit() {
  useEffect(() => {
    initFaro();
  }, []);

  return null;
}

// Utility functions for manual instrumentation
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && faro) {
      faro.api.pushLog([message], { level: 'debug', context });
    }
  },
  info: (message: string, context?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && faro) {
      faro.api.pushLog([message], { level: 'info', context });
    }
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && faro) {
      faro.api.pushLog([message], { level: 'warn', context });
    }
  },
  error: (message: string, context?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && faro) {
      faro.api.pushLog([message], { level: 'error', context });
    }
  },
};

export function setUser(user: { id: string; email?: string; username?: string }) {
  if (typeof window !== 'undefined' && faro) {
    faro.api.setUser(user);
  }
}

export function clearUser() {
  if (typeof window !== 'undefined' && faro) {
    faro.api.resetUser();
  }
}

export function pushEvent(name: string, attributes?: Record<string, string>) {
  if (typeof window !== 'undefined' && faro) {
    faro.api.pushEvent(name, attributes);
  }
}

export function pushError(error: Error, context?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && faro) {
    faro.api.pushError(error, { context });
  }
}
