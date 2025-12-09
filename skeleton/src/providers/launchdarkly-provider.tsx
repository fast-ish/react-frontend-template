{%- if values.featureFlags == "launchdarkly" %}
'use client';

import { LDProvider } from '@launchdarkly/js-client-sdk';
import { type ReactNode, useMemo } from 'react';

const LD_CLIENT_ID = process.env.NEXT_PUBLIC_LD_CLIENT_ID;

interface LaunchDarklyProviderProps {
  children: ReactNode;
}

export function LaunchDarklyProvider({ children }: LaunchDarklyProviderProps) {
  const context = useMemo(
    () => ({
      kind: 'user',
      key: 'anonymous',
      anonymous: true,
    }),
    []
  );

  if (!LD_CLIENT_ID) {
    console.warn('LaunchDarkly: Missing client ID');
    return <>{children}</>;
  }

  return (
    <LDProvider clientSideID={LD_CLIENT_ID} context={context}>
      {children}
    </LDProvider>
  );
}
{%- else %}
// LaunchDarkly not enabled
export const LaunchDarklyProvider = ({ children }: { children: React.ReactNode }) => children;
{%- endif %}
