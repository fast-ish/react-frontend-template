'use client';

import { useEffect } from 'react';
import { pushError } from '@/lib/grafana-faro';
{%- if values.uiLibrary == "shadcn" %}
import { Button } from '@/components/ui/button';
{%- endif %}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error
    console.error('Application error:', error);

    pushError(error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="{%- if values.styling == 'tailwind' %}flex min-h-screen flex-col items-center justify-center p-24{%- endif %}">
      <div className="{%- if values.styling == 'tailwind' %}text-center space-y-6{%- endif %}">
        <h2 className="{%- if values.styling == 'tailwind' %}text-2xl font-bold{%- endif %}">
          Something went wrong
        </h2>
        <p className="{%- if values.styling == 'tailwind' %}text-muted-foreground{%- endif %}">
          An unexpected error occurred. Our team has been notified.
        </p>
        {%- if values.uiLibrary == "shadcn" %}
        <Button onClick={reset}>Try again</Button>
        {%- else %}
        <button onClick={reset}>Try again</button>
        {%- endif %}
      </div>
    </div>
  );
}
