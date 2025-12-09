# React Frontend Golden Path Template

> The recommended way to build React frontends at our organization.

[![Backstage](https://img.shields.io/badge/Backstage-Template-blue)](https://backstage.io)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Internal-red)]()

## What's Included

| Category | Features |
|----------|----------|
| **Core** | Next.js 15, React 19, TypeScript 5.7, App Router |
| **Styling** | Tailwind CSS, shadcn/ui, CSS Modules, Styled Components |
| **State** | Zustand, Jotai, Redux Toolkit |
| **Data** | TanStack Query, SWR |
| **Auth** | Cognito, Auth0, NextAuth.js |
| **Observability** | Grafana Faro (RUM + Traces + Logs) |
| **Testing** | Vitest, Jest, Playwright, Cypress |
| **DevEx** | ESLint, Prettier, Husky, VS Code config |

## Quick Start

1. Go to [Backstage Software Catalog](https://backstage.yourcompany.com/create)
2. Select "React Frontend (Golden Path)"
3. Fill in the form
4. Click "Create"
5. Clone and start building

## What You'll Get

```
your-frontend/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   └── providers/        # Context providers
├── k8s/                  # Kubernetes manifests
├── .github/              # CI/CD workflows
├── docs/                 # Documentation
├── Dockerfile            # Multi-stage build
├── Makefile              # Developer commands
└── README.md             # Service docs
```

## Documentation

| Document | Description |
|----------|-------------|
| [Decision Guide](./docs/DECISIONS.md) | How to choose template options |
| [Golden Path Overview](./docs/index.md) | What and why |
| [Getting Started](./skeleton/docs/GETTING_STARTED.md) | First steps |
| [Patterns Guide](./skeleton/docs/PATTERNS.md) | Frontend patterns |

## Support

- **Slack**: #platform-help
- **Office Hours**: Thursdays 2-3pm

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12 | Initial release |

---

🤘 Platform Team
