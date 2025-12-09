'use client';

import { ReactNode } from 'react';
{%- if values.dataFetching == "tanstack-query" %}
import { QueryProvider } from './query-provider';
{%- endif %}
{%- if values.stateManagement == "redux" %}
import { ReduxProvider } from './redux-provider';
{%- endif %}
{%- if values.authentication == "nextauth" %}
import { SessionProvider } from 'next-auth/react';
{%- endif %}
{%- if values.analytics == "posthog" %}
import { PostHogProvider } from './posthog-provider';
{%- endif %}
{%- if values.featureFlags == "launchdarkly" %}
import { LaunchDarklyProvider } from './launchdarkly-provider';
{%- endif %}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    {%- if values.authentication == "nextauth" %}
    <SessionProvider>
    {%- endif %}
    {%- if values.stateManagement == "redux" %}
    <ReduxProvider>
    {%- endif %}
    {%- if values.dataFetching == "tanstack-query" %}
    <QueryProvider>
    {%- endif %}
    {%- if values.analytics == "posthog" %}
    <PostHogProvider>
    {%- endif %}
    {%- if values.featureFlags == "launchdarkly" %}
    <LaunchDarklyProvider>
    {%- endif %}
      {children}
    {%- if values.featureFlags == "launchdarkly" %}
    </LaunchDarklyProvider>
    {%- endif %}
    {%- if values.analytics == "posthog" %}
    </PostHogProvider>
    {%- endif %}
    {%- if values.dataFetching == "tanstack-query" %}
    </QueryProvider>
    {%- endif %}
    {%- if values.stateManagement == "redux" %}
    </ReduxProvider>
    {%- endif %}
    {%- if values.authentication == "nextauth" %}
    </SessionProvider>
    {%- endif %}
  );
}
