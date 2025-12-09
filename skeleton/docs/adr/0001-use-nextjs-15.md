# ADR-0001: Use Next.js 15 with App Router

## Status

Accepted

## Date

2025-12

## Context

We need to choose a React framework for building production frontends. The framework should support modern React patterns, provide excellent developer experience, and integrate well with our deployment infrastructure.

## Decision Drivers

- Server-side rendering requirements
- Developer productivity
- Performance optimization
- Enterprise adoption
- React 19 support

## Considered Options

### Option 1: Next.js 15 with App Router

Latest Next.js with React Server Components.

**Pros:**
- Native React 19 support
- Server Components reduce client bundle
- Built-in optimizations (images, fonts, scripts)
- Excellent TypeScript support
- Large ecosystem and community
- Vercel and self-hosted deployment options

**Cons:**
- App Router learning curve
- Some ecosystem libraries not yet compatible
- More complex mental model than Pages Router

### Option 2: Next.js 14 with Pages Router

Stable Next.js with traditional routing.

**Pros:**
- Battle-tested stability
- More library compatibility
- Simpler mental model
- More documentation/tutorials

**Cons:**
- Missing React 19 features
- No Server Components benefits
- Eventually will need migration

### Option 3: Remix

Full-stack web framework focused on web standards.

**Pros:**
- Web standards focus
- Built-in form handling
- Good performance
- Nested routing

**Cons:**
- Smaller ecosystem
- Less enterprise adoption
- Different patterns from Next.js

### Option 4: Vite + React

Lightweight build tool with React.

**Pros:**
- Fast development builds
- Flexible
- No framework lock-in

**Cons:**
- No SSR out of the box
- Must build own solutions
- More setup required

## Decision

We will use **Next.js 15 with App Router** because:

1. React 19 support enables latest features
2. Server Components improve performance
3. Built-in optimizations reduce configuration
4. Strong TypeScript integration
5. Largest ecosystem for React frameworks
6. Supports both Vercel and self-hosted deployment

## Consequences

### Positive

- Smaller client bundles with Server Components
- Automatic code splitting and optimization
- Streaming SSR for better TTFB
- Type-safe routing with experimental typedRoutes

### Negative

- Team needs to learn App Router patterns
- Some libraries need 'use client' wrappers
- More complex debugging (server vs client)

### Neutral

- Different file-based routing structure

## Implementation Notes

- Use `src/` directory for source code
- Prefer Server Components, add 'use client' only when needed
- Use Route Groups for layout organization
- Enable `typedRoutes` experimental feature

## References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [React 19 Release Notes](https://react.dev/blog)
