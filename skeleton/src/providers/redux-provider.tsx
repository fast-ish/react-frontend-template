{%- if values.stateManagement == "redux" %}
'use client';

import { type ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '@/lib/store';

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
{%- else %}
// Redux not enabled
export const ReduxProvider = ({ children }: { children: React.ReactNode }) => children;
{%- endif %}
