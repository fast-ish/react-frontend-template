# ADR-0003: Component and Styling Patterns

## Status

Accepted

## Date

2025-12

## Context

We need consistent patterns for building UI components. The approach should balance developer productivity, design system consistency, and maintainability.

## Decision Drivers

- Developer productivity
- Design system consistency
- Accessibility compliance
- Bundle size optimization
- Team familiarity

## Decisions

### 1. Styling: Tailwind CSS

**Rationale:**
- Utility-first approach speeds development
- No CSS-in-JS runtime overhead
- Automatic purging of unused styles
- Consistent design tokens
- Excellent IDE support

**Usage:**
```tsx
<button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
  Click me
</button>
```

### 2. UI Components: shadcn/ui

**Rationale:**
- Copy-paste ownership (no dependency updates)
- Built on Radix primitives (accessible)
- Tailwind-based (consistent with styling)
- Highly customizable
- Large component library

**Usage:**
```bash
npx shadcn-ui@latest add button card dialog
```

```tsx
import { Button } from '@/components/ui/button';

<Button variant="outline" size="sm">Click me</Button>
```

### 3. Component Structure

**File organization:**
```
src/components/
├── ui/                 # shadcn primitives (Button, Card, etc.)
├── forms/              # Form-specific components
├── layouts/            # Layout components
└── [feature]/          # Feature-specific components
```

**Naming conventions:**
- PascalCase for components: `ProductCard.tsx`
- kebab-case for files: `product-card.tsx`
- Colocate tests: `product-card.test.tsx`

### 4. Server vs Client Components

**Default to Server Components:**
```tsx
// No directive = Server Component
export default function ProductList({ products }) {
  return <ul>{products.map(p => <li>{p.name}</li>)}</ul>;
}
```

**Use Client Components when needed:**
```tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 5. Composition Pattern

**Prefer composition over configuration:**
```tsx
// Good - composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid - prop explosion
<Card title="Title" content="Content" />
```

## Consequences

### Positive

- Consistent styling across application
- Accessible components out of the box
- Small bundle size (no runtime CSS)
- Easy to customize

### Negative

- Learning Tailwind class names
- Long className strings
- shadcn updates require manual copy

### Neutral

- Different from traditional CSS approaches

## Implementation Notes

- Run `npx shadcn-ui@latest init` during project setup
- Configure `components.json` for path aliases
- Extend `tailwind.config.ts` for custom design tokens
- Use `cn()` utility for conditional classes

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)} />
```

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix Primitives](https://www.radix-ui.com/primitives)
