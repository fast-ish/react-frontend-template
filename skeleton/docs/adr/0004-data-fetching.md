# ADR-0004: Data Fetching Strategy

## Status

Accepted

## Date

2025-12

## Context

We need a consistent approach to data fetching that handles loading states, caching, error handling, and optimistic updates. The solution must work well with Next.js App Router and Server Components.

## Decision Drivers

- Developer experience
- Caching and revalidation
- Loading/error state management
- Server Component compatibility
- Type safety

## Decisions

### 1. Server-Side Data Fetching

Use Next.js native fetch with caching:

```tsx
// Server Component
async function ProductsPage() {
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 }, // Cache for 60 seconds
  }).then(res => res.json());

  return <ProductList products={products} />;
}
```

**Rationale:**
- No client-side JavaScript for initial data
- Built-in caching and revalidation
- Streaming SSR support

### 2. Client-Side Data Fetching: TanStack Query

For client components requiring data:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';

function ProductDetails({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <ProductCard product={data} />;
}
```

**Rationale:**
- Automatic caching and deduplication
- Built-in loading/error states
- Optimistic updates for mutations
- DevTools for debugging
- Large ecosystem and community

### 3. Server Actions for Mutations

Use Server Actions for form submissions:

```tsx
// actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const response = await fetch('https://api.example.com/products', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  revalidatePath('/products');
  return response.json();
}
```

```tsx
// Component
<form action={createProduct}>
  <input name="name" />
  <button type="submit">Create</button>
</form>
```

**Rationale:**
- Progressive enhancement (works without JS)
- Automatic form state handling
- Built-in validation support
- Secure (no API exposure)

### 4. Hydration Pattern

Prefetch on server, hydrate on client:

```tsx
// page.tsx (Server Component)
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList />
    </HydrationBoundary>
  );
}
```

**Rationale:**
- Fast initial render (SSR)
- No loading flash
- Client takes over for interactions

## Consequences

### Positive

- Optimal loading performance
- Consistent caching strategy
- Good developer experience
- Type-safe data fetching

### Negative

- Multiple patterns to learn
- TanStack Query adds bundle size
- Complexity in choosing approach

### Neutral

- Different from traditional SPA patterns

## Implementation Notes

### When to use each approach:

| Scenario | Approach |
|----------|----------|
| Page data (static/SSR) | Server fetch |
| User-specific data | TanStack Query |
| Form submissions | Server Actions |
| Real-time updates | TanStack Query + refetch |
| Infinite scroll | TanStack Query infinite |

### API Client

```tsx
// lib/api.ts
const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
};
```

## References

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
