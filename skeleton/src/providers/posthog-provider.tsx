{%- if values.analytics == "posthog" %}
'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { type ReactNode, useEffect } from 'react';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';

interface PostHogProviderProps {
  children: ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    if (!POSTHOG_KEY) {
      console.warn('PostHog: Missing API key');
      return;
    }

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // We capture manually for more control
      capture_pageleave: true,
      autocapture: true,
    });
  }, []);

  if (!POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Utility functions
export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  posthog.identify(userId, properties);
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  posthog.capture(eventName, properties);
}

export function resetUser() {
  posthog.reset();
}
{%- else %}
// PostHog not enabled
export const PostHogProvider = ({ children }: { children: React.ReactNode }) => children;
export const identifyUser = () => {};
export const trackEvent = () => {};
export const resetUser = () => {};
{%- endif %}
