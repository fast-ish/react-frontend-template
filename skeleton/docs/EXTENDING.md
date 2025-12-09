# Extending Your Frontend

This guide shows how to customize and extend the generated frontend for your specific needs.

## Table of Contents

- [Adding a New Page](#adding-a-new-page)
- [Adding Components](#adding-components)
- [Data Fetching](#data-fetching)
- [Forms](#forms)
- [State Management](#state-management)
- [Authentication](#authentication)
- [API Integration](#api-integration)
- [Testing](#testing)

---

## Adding a New Page

### Basic Page

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="mt-4 text-muted-foreground">
        Learn more about our company.
      </p>
    </main>
  );
}
```

### Page with Metadata

```tsx
// src/app/products/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our product catalog',
};

export default function ProductsPage() {
  return <div>Products</div>;
}
```

### Dynamic Route

```tsx
// src/app/products/[id]/page.tsx
interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  return <div>Product: {id}</div>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Product ${id}` };
}
```

### Layout for Section

```tsx
// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 border-r">
        {/* Sidebar navigation */}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

---

## Adding Components

{%- if values.uiLibrary == "shadcn" %}

### Using shadcn/ui

Add components from shadcn/ui:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

Use in your code:

```tsx
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${product.price}</p>
        <Button className="mt-4 w-full">Add to Cart</Button>
      </CardContent>
    </Card>
  );
}
```
{%- endif %}

### Custom Component

```tsx
// src/components/product-list.tsx
'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductListProps {
  products: Product[];
  onSelect?: (product: Product) => void;
}

export function ProductList({ products, onSelect }: ProductListProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (product: Product) => {
    setSelected(product.id);
    onSelect?.(product);
  };

  return (
    <ul className="space-y-2">
      {products.map((product) => (
        <li
          key={product.id}
          className={`p-4 rounded-lg border cursor-pointer ${
            selected === product.id ? 'border-primary' : ''
          }`}
          onClick={() => handleSelect(product)}
        >
          <span className="font-medium">{product.name}</span>
          <span className="ml-2 text-muted-foreground">
            ${product.price}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

---

## Data Fetching

{%- if values.dataFetching == "tanstack-query" %}

### Server-Side Fetching with TanStack Query

```tsx
// src/app/products/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import { ProductList } from './product-list';

export default async function ProductsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList />
    </HydrationBoundary>
  );
}
```

### Client-Side Fetching

```tsx
// src/app/products/product-list.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';

export function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <ul>
      {data?.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Mutations

```tsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '@/lib/api';

export function CreateProductForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleSubmit = (data: CreateProductRequest) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```
{%- endif %}

{%- if values.dataFetching == "swr" %}

### Data Fetching with SWR

```tsx
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProductList() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <ul>
      {data?.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```
{%- endif %}

### Server Actions

```tsx
// src/app/products/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);

  const response = await fetch(`${process.env.API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price }),
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  revalidatePath('/products');
  return response.json();
}
```

---

## Forms

{%- if values.formLibrary == "react-hook-form" %}

### React Hook Form with Zod

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
{%- if values.uiLibrary == "shadcn" %}
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
{%- endif %}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  price: z.coerce.number().positive('Price must be positive'),
});

type FormData = z.infer<typeof formSchema>;

export function ProductForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      price: 0,
    },
  });

  return (
    {%- if values.uiLibrary == "shadcn" %}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
    {%- else %}
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input {...form.register('name')} />
        {form.formState.errors.name && (
          <span>{form.formState.errors.name.message}</span>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
    {%- endif %}
  );
}
```
{%- endif %}

---

## State Management

{%- if values.stateManagement == "zustand" %}

### Zustand Store

```tsx
// src/stores/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
```

### Using the Store

```tsx
'use client';

import { useCartStore } from '@/stores/cart';

export function CartSummary() {
  const { items, total, removeItem } = useCartStore();

  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} - ${item.price * item.quantity}
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p className="font-bold">Total: ${total()}</p>
    </div>
  );
}
```
{%- endif %}

{%- if values.stateManagement == "jotai" %}

### Jotai Atoms

```tsx
// src/stores/atoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const userAtom = atom<User | null>(null);
export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'light');

// Derived atom
export const isLoggedInAtom = atom((get) => get(userAtom) !== null);
```

### Using Atoms

```tsx
'use client';

import { useAtom, useAtomValue } from 'jotai';
import { userAtom, isLoggedInAtom } from '@/stores/atoms';

export function UserMenu() {
  const [user, setUser] = useAtom(userAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  if (!isLoggedIn) {
    return <button>Sign In</button>;
  }

  return (
    <div>
      <span>{user?.name}</span>
      <button onClick={() => setUser(null)}>Sign Out</button>
    </div>
  );
}
```
{%- endif %}

---

## API Integration

### API Client

```tsx
// src/lib/api.ts
import { logger } from '@/lib/datadog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    logger.error('API request failed', {
      url,
      status: response.status,
    });
    throw new ApiError(
      response.status,
      response.statusText,
      `API error: ${response.statusText}`
    );
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
```

---

## Testing

{%- if values.testRunner == "vitest" %}

### Unit Test with Vitest

```tsx
// src/components/__tests__/product-card.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../product-card';

describe('ProductCard', () => {
  const product = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    description: 'A great product',
  };

  it('renders product information', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledWith(product);
  });
});
```
{%- endif %}

{%- if values.e2eTesting == "playwright" %}

### E2E Test with Playwright

```tsx
// e2e/products.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test('displays product list', async ({ page }) => {
    await page.goto('/products');

    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('can add product to cart', async ({ page }) => {
    await page.goto('/products');

    await page.getByRole('button', { name: /add to cart/i }).first().click();

    await expect(page.getByTestId('cart-count')).toHaveText('1');
  });

  test('can complete checkout', async ({ page }) => {
    await page.goto('/cart');

    await page.getByRole('button', { name: /checkout/i }).click();
    await page.fill('[name="email"]', 'test@example.com');
    await page.getByRole('button', { name: /place order/i }).click();

    await expect(page.getByText(/order confirmed/i)).toBeVisible();
  });
});
```
{%- endif %}

---

## Common Customizations

### Add Route Group

```
src/app/
├── (marketing)/        # Public pages
│   ├── page.tsx        # Home
│   ├── about/
│   └── pricing/
├── (dashboard)/        # Authenticated pages
│   ├── layout.tsx      # With auth check
│   ├── dashboard/
│   └── settings/
└── (auth)/             # Auth pages
    ├── login/
    └── register/
```

### Custom Hook

```tsx
// src/hooks/use-debounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### Environment-Specific Config

```tsx
// src/lib/config.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  ddApplicationId: process.env.NEXT_PUBLIC_DD_APPLICATION_ID!,
  ddClientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN!,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};
```
