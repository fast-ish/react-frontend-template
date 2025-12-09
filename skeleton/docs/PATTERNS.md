# Frontend Patterns

Production-ready patterns included in this template.

## Error Handling

### Error Boundary

Catch and handle React component errors:

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}
```

### API Error Handling

The API client handles errors consistently:

```tsx
import { api, ApiError } from '@/lib/api';

try {
  const data = await api.get('/endpoint');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Handle unauthorized
    } else if (error.status === 404) {
      // Handle not found
    }
  }
}
```

## Observability

### Logging

Use the structured logger:

```tsx
import { logger } from '@/lib/datadog';

logger.info('User action', { userId: '123', action: 'checkout' });
logger.error('Payment failed', { orderId: '456', error: 'Declined' });
```

### User Tracking

Track authenticated users:

```tsx
import { setUser, clearUser } from '@/lib/datadog';

// On login
setUser({ id: user.id, email: user.email, name: user.name });

// On logout
clearUser();
```

### Custom Actions

Track user interactions:

```tsx
import { addAction } from '@/lib/datadog';

function handleCheckout() {
  addAction('checkout_started', { cartValue: 99.99 });
  // ... checkout logic
}
```

{%- if values.featureFlags != "none" %}
## Feature Flags

### Using Feature Flags

```tsx
import { useFeatureFlag } from '@/hooks/use-feature-flag';

function NewFeature() {
  const isEnabled = useFeatureFlag('new-feature');

  if (!isEnabled) return null;

  return <div>New Feature!</div>;
}
```

### Feature Flag Best Practices

1. Use descriptive flag names: `checkout-v2`, `dark-mode-beta`
2. Clean up flags after rollout
3. Test both flag states
4. Document flag purpose
{%- endif %}

{%- if values.stateManagement == "zustand" %}
## State Management (Zustand)

### Creating a Store

```tsx
// src/lib/store.ts
import { create } from 'zustand';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}));
```

### Using the Store

```tsx
function Cart() {
  const { items, removeItem } = useCartStore();

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```
{%- endif %}

{%- if values.formLibrary == "react-hook-form" %}
## Forms (React Hook Form + Zod)

### Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ characters'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await api.post('/auth/login', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```
{%- endif %}

## Performance

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image';

function Avatar({ src, name }: { src: string; name: string }) {
  return (
    <Image
      src={src}
      alt={name}
      width={48}
      height={48}
      className="rounded-full"
    />
  );
}
```

### Code Splitting

Use dynamic imports for heavy components:

```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,
});
```

### Memoization

Prevent unnecessary re-renders:

```tsx
import { memo, useMemo, useCallback } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }: Props) {
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  return (
    <ul>
      {sortedItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});
```

## Accessibility

### Keyboard Navigation

```tsx
function InteractiveCard({ onClick }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      Click or press Enter
    </div>
  );
}
```

### Focus Management

```tsx
import { useRef, useEffect } from 'react';

function Modal({ isOpen }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <dialog open={isOpen}>
      <button ref={closeButtonRef}>Close</button>
    </dialog>
  );
}
```

## Security

### XSS Prevention

React escapes by default. For raw HTML:

```tsx
// Dangerous - only use with trusted content
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

// Prefer: Use a sanitization library
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### CSRF Protection

API client includes credentials:

```tsx
// Cookies are sent automatically
const data = await api.post('/api/action', payload);
```

### Content Security Policy

Headers are configured in `next.config.ts`.
