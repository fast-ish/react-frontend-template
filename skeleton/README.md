# ${{values.name}}

${{values.description}}

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run e2e` | Run E2E tests |
| `npm run validate` | Run all checks |

## Project Structure

```
src/
├── app/           # Next.js App Router
├── components/    # React components
├── hooks/         # Custom hooks
├── lib/           # Utilities
└── providers/     # Context providers
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values.

## Documentation

- [Getting Started](./docs/GETTING_STARTED.md)
- [Patterns](./docs/PATTERNS.md)

## Deployment

### Docker

```bash
docker build -t ${{values.name}} .
docker run -p 3000:3000 ${{values.name}}
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

---

🤘 ${{values.owner}}
