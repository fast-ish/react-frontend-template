'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { pushError } from '@/lib/grafana-faro';
{%- if values.uiLibrary == "shadcn" %}
import { Button } from '@/components/ui/button';
{%- endif %}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    pushError(error, { componentStack: errorInfo.componentStack });

    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="{%- if values.styling == 'tailwind' %}flex min-h-[400px] flex-col items-center justify-center p-8{%- endif %}">
          <div className="{%- if values.styling == 'tailwind' %}text-center space-y-4{%- endif %}">
            <h2 className="{%- if values.styling == 'tailwind' %}text-xl font-semibold{%- endif %}">
              Something went wrong
            </h2>
            <p className="{%- if values.styling == 'tailwind' %}text-muted-foreground{%- endif %}">
              An error occurred while rendering this component.
            </p>
            {%- if values.uiLibrary == "shadcn" %}
            <Button onClick={this.handleReset} variant="outline">
              Try again
            </Button>
            {%- else %}
            <button onClick={this.handleReset}>Try again</button>
            {%- endif %}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
