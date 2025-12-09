# ADR-0002: Use Datadog RUM for Frontend Observability

## Status

Accepted

## Date

2025-12

## Context

We need frontend observability to monitor user experience, track errors, and correlate frontend issues with backend services. The solution must integrate with our existing Datadog backend APM.

## Decision Drivers

- Unified observability platform (frontend + backend)
- Real User Monitoring capabilities
- Error tracking and session replay
- Performance monitoring
- Distributed tracing correlation

## Considered Options

### Option 1: Datadog RUM

Real User Monitoring from Datadog.

**Pros:**
- Unified with backend APM
- Automatic trace correlation
- Session replay
- Core Web Vitals tracking
- Error tracking built-in
- Enterprise support

**Cons:**
- Cost per session
- Data residency considerations

### Option 2: Sentry

Error tracking with performance monitoring.

**Pros:**
- Excellent error tracking
- Good performance monitoring
- Lower cost at scale
- Open source option

**Cons:**
- Separate platform from backend APM
- No automatic trace correlation
- Less comprehensive RUM

### Option 3: LogRocket

Session replay and analytics.

**Pros:**
- Excellent session replay
- Good debugging tools
- Privacy controls

**Cons:**
- Separate platform
- Higher cost for session replay
- Less trace integration

## Decision

We will use **Datadog RUM** because:

1. Unified platform with backend APM eliminates context switching
2. Automatic distributed trace correlation links frontend to backend
3. Session replay helps debug user-reported issues
4. Core Web Vitals monitoring for performance
5. Single vendor relationship simplifies procurement

## Consequences

### Positive

- Click on frontend error, see backend trace
- Single dashboard for all observability
- Automatic performance tracking
- Session replay for debugging

### Negative

- Per-session pricing at scale
- Requires Datadog subscription
- Data sent to third party

### Neutral

- Team uses same platform for all observability

## Implementation Notes

- Initialize RUM early in application lifecycle
- Use `DatadogInit` component in root layout
- Configure `allowedTracingUrls` for trace propagation
- Set appropriate `sessionSampleRate` for cost control
- Use `defaultPrivacyLevel: 'mask-user-input'` for sensitive data

```tsx
datadogRum.init({
  applicationId: 'xxx',
  clientToken: 'xxx',
  site: 'datadoghq.com',
  service: 'my-frontend',
  env: 'production',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});
```

## References

- [Datadog RUM Documentation](https://docs.datadoghq.com/real_user_monitoring/)
- [RUM Browser SDK](https://docs.datadoghq.com/real_user_monitoring/browser/)
- [Connect RUM and Traces](https://docs.datadoghq.com/real_user_monitoring/connect_rum_and_traces/)
