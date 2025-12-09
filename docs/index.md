# React Frontend Golden Path

The recommended way to build React frontends at our organization.

## What is a Golden Path?

A golden path is an opinionated, well-supported way to build software. It represents organizational best practices and reduces decision fatigue.

## Why Next.js?

- **Full-stack React** - API routes, server components, edge runtime
- **Performance** - Automatic code splitting, image optimization, streaming
- **Developer experience** - Fast refresh, TypeScript, ESLint integration
- **Deployment flexibility** - Vercel, AWS, self-hosted

## Template Options

### Runtime

| Option | When to Use |
|--------|-------------|
| **Node 22** | Default. Latest features and performance |
| **Node 20** | LTS. Required for specific compatibility |

### Styling

| Option | When to Use |
|--------|-------------|
| **Tailwind CSS** | Default. Utility-first, great DX |
| **CSS Modules** | Scoped styles, no runtime overhead |
| **Styled Components** | CSS-in-JS, dynamic styling |

### UI Library

| Option | When to Use |
|--------|-------------|
| **shadcn/ui** | Default. Copy-paste components, full control |
| **Radix** | Just primitives, bring your own styling |
| **None** | Build from scratch |

### State Management

| Option | When to Use |
|--------|-------------|
| **Zustand** | Default. Simple, minimal boilerplate |
| **Jotai** | Atomic state, fine-grained updates |
| **Redux Toolkit** | Large apps, complex state |
| **None** | Simple apps, React state sufficient |

### Data Fetching

| Option | When to Use |
|--------|-------------|
| **TanStack Query** | Default. Caching, background updates |
| **SWR** | Simpler API, good defaults |
| **None** | Server components, no client caching |

### Authentication

| Option | When to Use |
|--------|-------------|
| **AWS Cognito** | Already using AWS, need hosted UI |
| **Auth0** | Enterprise SSO, advanced features |
| **NextAuth.js** | Multiple providers, self-managed |
| **None** | Public app, auth handled elsewhere |

### Observability

| Option | When to Use |
|--------|-------------|
| **Datadog RUM** | Default. Full observability stack |
| **None** | Simple apps, no monitoring needed |

### Testing

| Option | When to Use |
|--------|-------------|
| **Vitest** | Default. Fast, ESM native |
| **Jest** | Existing Jest ecosystem |
| **Playwright** | Default E2E. Cross-browser, reliable |
| **Cypress** | Interactive debugging, component testing |

## What's Included

### Core

- Next.js 15 with App Router
- TypeScript with strict mode
- Security headers configured
- Health check endpoint

### Developer Experience

- ESLint with React/accessibility rules
- Prettier with Tailwind plugin
- Husky + lint-staged
- VS Code settings

### Testing

- Unit testing setup
- E2E testing setup
- Coverage reporting

### CI/CD

- GitHub Actions workflows
- Docker build with multi-stage
- Security scanning (CodeQL, Trivy)
- Bundle size monitoring

### Kubernetes

- Deployment with security context
- HPA for autoscaling
- PDB for availability
- Ingress for routing

## Getting Started

1. Create a new frontend from Backstage
2. Clone the repository
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3000

See [Getting Started](../skeleton/docs/GETTING_STARTED.md) for details.
