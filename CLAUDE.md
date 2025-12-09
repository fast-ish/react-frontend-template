# React Frontend Golden Path Template

Backstage software template for generating production-ready Next.js 15 frontends with Grafana Faro observability.

## Structure

```
/template.yaml          # Backstage scaffolder definition (all parameters here)
/skeleton/              # Generated frontend template (Jinja2 templated)
/docs/                  # Template-level documentation
```

## Key Files

- `template.yaml` - Template parameters and steps (scaffolder.backstage.io/v1beta3)
- `skeleton/package.json` - Dependencies with conditional inclusions
- `skeleton/src/app/layout.tsx` - Root layout with providers
- `skeleton/src/lib/grafana-faro.tsx` - RUM, tracing, and logging setup

## Template Syntax

Uses Jinja2 via Backstage:
- Variables: `${{values.name}}`, `${{values.owner}}`
- Conditionals: `{%- if values.styling == "tailwind" %}...{%- endif %}`

## Testing Template Changes

```bash
cd skeleton
npm install
npm run dev                # Start dev server
npm run lint               # ESLint
npm run typecheck          # TypeScript
npm run test               # Unit tests
docker build -t test .     # Container build
```

## Template Options

| Parameter | Values |
|-----------|--------|
| styling | tailwind, css-modules, styled-components |
| uiLibrary | shadcn, radix, none |
| stateManagement | zustand, jotai, redux, none |
| dataFetching | tanstack-query, swr, none |
| authentication | cognito, auth0, nextauth, none |
| testRunner | vitest, jest |
| e2eTesting | playwright, cypress, none |

## Conventions

- App Router (not Pages Router)
- TypeScript strict mode
- Path alias: `@/*` → `src/*`
- Components in `src/components/ui/` for primitives
- Hooks in `src/hooks/`
- shadcn/ui pattern: copy components, don't install

## Version Pinning

Keep these current:
- Next.js: 15.0.3
- React: 19.0.0
- Tailwind: 3.4.15
- TypeScript: 5.7.2

## Don't

- Use Pages Router (App Router only)
- Add backwards-compatibility shims
- Create files when editing existing ones works
- Use placeholder versions - verify on npm
