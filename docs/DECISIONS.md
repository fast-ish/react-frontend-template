# Decision Guide

Help choosing template options.

## Styling

```
Do you need dynamic styles based on props?
├── Yes → Styled Components
└── No
    ├── Team familiar with utility CSS? → Tailwind CSS
    └── Prefer traditional CSS? → CSS Modules
```

## UI Library

```
Building a design system from scratch?
├── Yes → None or Radix (primitives only)
└── No
    ├── Want customizable components? → shadcn/ui
    └── Just need unstyled primitives? → Radix
```

## State Management

```
How complex is your client state?
├── Simple (few pieces of state) → None (React useState/useContext)
├── Medium (shared state across components)
│   ├── Prefer minimal API? → Zustand
│   └── Prefer atomic updates? → Jotai
└── Complex (normalized data, time-travel debugging) → Redux Toolkit
```

## Data Fetching

```
Using mostly Server Components?
├── Yes → None (server-side fetching)
└── No
    ├── Need advanced caching/mutations? → TanStack Query
    └── Simple caching sufficient? → SWR
```

## Authentication

```
What's your auth requirement?
├── Enterprise SSO required → Auth0
├── Already using AWS → Cognito
├── Multiple OAuth providers → NextAuth.js
└── No auth needed → None
```

## Testing

```
Which test runner?
├── New project → Vitest (faster, ESM native)
└── Migrating from Jest → Jest (easier migration)

E2E Testing:
├── Need cross-browser testing → Playwright
└── Prefer interactive debugging → Cypress
```

## Error Tracking

```
Using Datadog for observability?
├── Yes → Datadog (consolidate in one tool)
└── No → Sentry (specialized error tracking)
```

## Feature Flags

```
Need feature flags?
├── Yes
│   ├── Already using PostHog → PostHog
│   └── Need advanced targeting → LaunchDarkly
└── No → None
```

## Common Combinations

### Startup MVP

- Tailwind + shadcn/ui
- Zustand
- TanStack Query
- NextAuth.js
- Vitest + Playwright

### Enterprise App

- Tailwind + shadcn/ui
- Redux Toolkit
- TanStack Query
- Cognito or Auth0
- Vitest + Playwright
- Datadog + LaunchDarkly

### Marketing Site

- Tailwind + shadcn/ui
- None (state)
- None (data fetching)
- None (auth)
- Vitest + Playwright
