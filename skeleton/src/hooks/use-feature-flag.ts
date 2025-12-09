{%- if values.featureFlags == "launchdarkly" %}
'use client';

import { useLDClient } from '@launchdarkly/js-client-sdk';
import { useEffect, useState } from 'react';

export function useFeatureFlag<T>(
  flagKey: string,
  defaultValue: T
): { value: T; isLoading: boolean } {
  const client = useLDClient();
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!client) return;

    const updateValue = () => {
      const flagValue = client.variation(flagKey, defaultValue) as T;
      setValue(flagValue);
      setIsLoading(false);
    };

    updateValue();

    client.on(`change:${flagKey}`, updateValue);

    return () => {
      client.off(`change:${flagKey}`, updateValue);
    };
  }, [client, flagKey, defaultValue]);

  return { value, isLoading };
}
{%- elif values.featureFlags == "posthog" %}
'use client';

import { useFeatureFlagEnabled, useFeatureFlagPayload } from 'posthog-js/react';

export function useFeatureFlag(flagKey: string): boolean {
  return useFeatureFlagEnabled(flagKey) ?? false;
}

export function useFeatureFlagWithPayload<T>(
  flagKey: string
): { enabled: boolean; payload: T | undefined } {
  const enabled = useFeatureFlagEnabled(flagKey) ?? false;
  const payload = useFeatureFlagPayload(flagKey) as T | undefined;
  return { enabled, payload };
}
{%- else %}
// Feature flags not enabled - simple implementation
export function useFeatureFlag(
  _flagKey: string,
  defaultValue: boolean = false
): boolean {
  return defaultValue;
}

export function useFeatureFlagWithPayload<T>(
  _flagKey: string,
  defaultValue: T
): { enabled: boolean; payload: T } {
  return { enabled: false, payload: defaultValue };
}
{%- endif %}
