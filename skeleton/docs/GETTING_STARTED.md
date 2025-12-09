# Getting Started

Your first 5 minutes with ${{values.name}}.

## Prerequisites

- Node.js ${{values.nodeVersion}}+
- npm 10+
- Docker (for containerized development)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run unit tests |
{%- if values.e2eTesting == "playwright" %}
| `npm run e2e` | Run E2E tests |
{%- endif %}
| `npm run validate` | Run all checks |

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── error.tsx        # Error boundary
│   ├── not-found.tsx    # 404 page
│   └── api/             # API routes
├── components/          # React components
│   └── ui/              # UI primitives
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
├── providers/           # Context providers
└── types/               # TypeScript types
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Application URL |
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_DD_APPLICATION_ID` | Datadog RUM Application ID |
| `NEXT_PUBLIC_DD_CLIENT_TOKEN` | Datadog RUM Client Token |

## Development Workflow

### Adding a New Page

Create a new file in `src/app/`:

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return <h1>About</h1>;
}
```

### Adding a Component

{%- if values.uiLibrary == "shadcn" %}
Use shadcn/ui CLI to add components:

```bash
npx shadcn-ui@latest add button
```

Or create custom components in `src/components/`.
{%- else %}
Create components in `src/components/`:

```tsx
// src/components/my-component.tsx
export function MyComponent() {
  return <div>Hello</div>;
}
```
{%- endif %}

### Using the API Client

```tsx
import { api } from '@/lib/api';

// GET request
const data = await api.get<User[]>('/users');

// POST request
const user = await api.post<User>('/users', { name: 'John' });
```

{%- if values.dataFetching == "tanstack-query" %}
### Data Fetching with TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/users'),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```
{%- endif %}

## Testing

### Unit Tests

```bash
npm run test
```

{%- if values.e2eTesting == "playwright" %}
### E2E Tests

```bash
# Run all tests
npm run e2e

# Run with UI
npm run e2e:ui

# Generate tests
npm run e2e:codegen
```
{%- endif %}

## Deployment

### Docker

```bash
# Build image
docker build -t ${{values.name}} .

# Run container
docker run -p 3000:3000 ${{values.name}}
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

## Next Steps

1. Update `src/app/page.tsx` with your content
2. Configure environment variables
3. Add your API endpoints
4. Write tests
5. Deploy to staging
