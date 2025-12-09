# Troubleshooting Guide

Quick solutions to common issues.

## Build Issues

### "Node version mismatch"

```
Error: The engine "node" is incompatible with this module
```

**Solution**: Install the correct Node.js version:
```bash
# With nvm
nvm install ${{values.nodeVersion}}
nvm use ${{values.nodeVersion}}

# Verify
node --version
```

### "npm install fails"

```
Error: ERESOLVE unable to resolve dependency tree
```

**Solution**: Clear cache and retry:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### "TypeScript errors during build"

```
Error: Type error: Property 'x' does not exist on type 'y'
```

**Solution**: Check and fix type errors:
```bash
# Run type check
npm run typecheck

# Auto-fix some issues
npx tsc --noEmit
```

### "ESLint errors blocking build"

**Solution**: Fix lint errors:
```bash
# Check errors
npm run lint

# Auto-fix
npm run lint:fix
```

---

## Runtime Issues

### "Port 3000 already in use"

```
Error: Port 3000 is already in use
```

**Solution**: Find and kill the process or use a different port:
```bash
# Find what's using the port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### "Hydration mismatch"

```
Error: Hydration failed because the initial UI does not match
```

**Solution**: Common causes and fixes:

1. **Date/time rendering**: Use client-only rendering
```tsx
'use client';
import { useEffect, useState } from 'react';

function DateTime() {
  const [date, setDate] = useState<string>();

  useEffect(() => {
    setDate(new Date().toLocaleString());
  }, []);

  return <span>{date}</span>;
}
```

2. **Browser-only APIs**: Check for window
```tsx
const isBrowser = typeof window !== 'undefined';
```

3. **Random values**: Use consistent seeds or client-only

### "Module not found"

```
Error: Cannot find module '@/components/xyz'
```

**Solution**: Check path aliases in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### "Datadog RUM not loading"

**Solution**: Check configuration:
```bash
# Verify environment variables
echo $NEXT_PUBLIC_DD_APPLICATION_ID
echo $NEXT_PUBLIC_DD_CLIENT_TOKEN

# Check browser console for errors
# Ensure credentials are set in .env.local
```

### "API calls failing in development"

```
Error: Failed to fetch
```

**Solution**: Check CORS and API URL:
```bash
# Verify API URL
echo $NEXT_PUBLIC_API_URL

# Check if API is running
curl http://localhost:8080/health

# Check browser Network tab for details
```

---

## Docker Issues

### "Docker build fails"

```
Error: Cannot find module 'next'
```

**Solution**: Check Dockerfile multi-stage build:
```dockerfile
# Ensure dependencies are copied correctly
COPY --from=deps /app/node_modules ./node_modules
```

### "Container exits with code 137"

**Solution**: Increase memory limit:
```bash
docker run -m 2g your-image
```

### "Static files not loading"

**Solution**: Check output configuration:
```ts
// next.config.ts
const nextConfig = {
  output: 'standalone', // For Docker
};
```

---

## Test Issues

{%- if values.testRunner == "vitest" %}

### "Vitest not finding tests"

```
Error: No test files found
```

**Solution**: Check vitest config:
```ts
// vitest.config.ts
export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    environment: 'jsdom',
  },
});
```

### "React Testing Library errors"

```
Error: Unable to find role="button"
```

**Solution**: Debug with screen:
```tsx
import { screen } from '@testing-library/react';

// Add this to see what's rendered
screen.debug();

// Use more specific queries
screen.getByRole('button', { name: /submit/i });
```
{%- endif %}

{%- if values.e2eTesting == "playwright" %}

### "Playwright tests timing out"

**Solution**: Increase timeout or wait for elements:
```ts
// playwright.config.ts
export default defineConfig({
  timeout: 60000,
  expect: { timeout: 10000 },
});

// In tests
await page.waitForSelector('[data-testid="content"]');
```

### "Playwright can't find elements"

**Solution**: Use recommended locators:
```ts
// Prefer these
await page.getByRole('button', { name: 'Submit' });
await page.getByTestId('product-card');
await page.getByText('Welcome');

// Avoid
await page.locator('.btn-primary');
```
{%- endif %}

---

## Styling Issues

{%- if values.styling == "tailwind" %}

### "Tailwind classes not working"

**Solution**: Check content configuration:
```ts
// tailwind.config.ts
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
```

### "CSS not updating"

**Solution**: Restart dev server and clear cache:
```bash
rm -rf .next
npm run dev
```

{%- if values.uiLibrary == "shadcn" %}

### "shadcn components not styled"

**Solution**: Ensure globals.css is imported:
```tsx
// src/app/layout.tsx
import './globals.css';
```

Check CSS variables are defined:
```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... */
  }
}
```
{%- endif %}
{%- endif %}

---

## Authentication Issues

{%- if values.authentication == "nextauth" %}

### "NextAuth session not persisting"

**Solution**: Check secret configuration:
```bash
# Generate secret
openssl rand -base64 32

# Set in .env.local
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
```
{%- endif %}

{%- if values.authentication == "cognito" %}

### "Cognito authentication failing"

**Solution**: Verify Cognito configuration:
```bash
# Check environment variables
echo $NEXT_PUBLIC_COGNITO_USER_POOL_ID
echo $NEXT_PUBLIC_COGNITO_CLIENT_ID

# Ensure callback URLs are configured in Cognito console
```
{%- endif %}

---

## Kubernetes Issues

### "Pod stuck in CrashLoopBackOff"

**Solution**: Check pod logs:
```bash
kubectl logs deployment/your-frontend
kubectl describe pod <pod-name>
```

### "Health check failing"

**Solution**: Verify health endpoint:
```bash
# Check endpoint exists
curl http://localhost:3000/api/health

# Check probe configuration
kubectl get deployment your-frontend -o yaml | grep -A10 livenessProbe
```

### "Static assets not loading"

**Solution**: Check CDN/Ingress configuration:
```bash
# Verify ingress
kubectl get ingress

# Check CDN cache headers
curl -I https://your-app.com/_next/static/...
```

---

## Performance Issues

### "Slow initial page load"

**Solution**: Analyze bundle:
```bash
npm run build
# Check .next/analyze/ if bundle analyzer is configured

# Or use built-in
ANALYZE=true npm run build
```

### "Large JavaScript bundle"

**Solution**: Use dynamic imports:
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

### "Images loading slowly"

**Solution**: Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={800}
  height={400}
  alt="Hero"
  priority // For above-the-fold images
/>
```

---

## Still Stuck?

1. **Check the console**: Browser DevTools console and Network tab
2. **Check server logs**: `npm run dev` terminal output
3. **Search existing issues**: Check the template repository
4. **Ask in Slack**: #platform-help
5. **Office hours**: Thursdays 2-3pm

When asking for help, include:
- Error message (full stack trace)
- Browser and version
- Steps to reproduce
- What you've already tried
- Screenshots if UI-related
