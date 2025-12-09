# Architecture Overview

## Application Architecture

```mermaid
flowchart TB
    subgraph External
        User[User Browser]
        DD[Datadog]
    end

    subgraph Edge
        CDN[CloudFront CDN]
    end

    subgraph Kubernetes
        subgraph Frontend["${{values.name}}"]
            Next[Next.js Server]
            Static[Static Assets]
        end
    end

    subgraph Backend
        API[API Services]
    end

    User --> CDN
    CDN --> Next
    CDN --> Static
    Next --> API
    User --> DD
```

## Request Flow (Server Components)

```mermaid
sequenceDiagram
    participant B as Browser
    participant E as Edge/CDN
    participant N as Next.js Server
    participant A as API Server
    participant DD as Datadog

    B->>E: Request Page
    E->>N: Cache Miss
    N->>A: Fetch Data (Server)
    A-->>N: JSON Response
    N-->>E: Rendered HTML
    E-->>B: Response + Cache
    B--)DD: RUM Event
```

## Request Flow (Client Components)

```mermaid
sequenceDiagram
    participant B as Browser
    participant N as Next.js
    participant A as API Server
    participant DD as Datadog

    B->>N: Navigate (Client)
    Note over B: React Hydration
    B->>A: API Request
    A-->>B: JSON Response
    Note over B: State Update
    B--)DD: RUM + Trace
```

## Component Architecture

```mermaid
graph TB
    subgraph Pages["App Router"]
        Layout[layout.tsx]
        Page[page.tsx]
        Loading[loading.tsx]
        Error[error.tsx]
    end

    subgraph Components
        UI[UI Components]
        Feature[Feature Components]
        Forms[Form Components]
    end

    subgraph State
        {%- if values.stateManagement == "zustand" %}
        Store[Zustand Store]
        {%- elif values.stateManagement == "jotai" %}
        Atoms[Jotai Atoms]
        {%- elif values.stateManagement == "redux" %}
        Redux[Redux Store]
        {%- else %}
        Context[React Context]
        {%- endif %}
    end

    subgraph Data
        {%- if values.dataFetching == "tanstack-query" %}
        Query[TanStack Query]
        {%- elif values.dataFetching == "swr" %}
        SWR[SWR]
        {%- else %}
        Fetch[Server Actions]
        {%- endif %}
        API[API Client]
    end

    Layout --> Page
    Page --> Feature
    Feature --> UI
    {%- if values.formLibrary == "react-hook-form" %}
    Forms --> UI
    {%- endif %}
    Feature --> State
    Feature --> Data
    Data --> API
```

## Provider Stack

```mermaid
flowchart TB
    subgraph Providers
        Root[RootLayout]
        Theme[ThemeProvider]
        {%- if values.dataFetching == "tanstack-query" %}
        Query[QueryClientProvider]
        {%- endif %}
        {%- if values.stateManagement == "redux" %}
        Redux[ReduxProvider]
        {%- endif %}
        {%- if values.authentication != "none" %}
        Auth[AuthProvider]
        {%- endif %}
        App[Application]
    end

    Root --> Theme
    {%- if values.dataFetching == "tanstack-query" %}
    Theme --> Query
    Query --> App
    {%- else %}
    Theme --> App
    {%- endif %}
```

## Data Flow

```mermaid
flowchart LR
    subgraph Client
        UI[UI Component]
        Hook[Custom Hook]
        {%- if values.dataFetching == "tanstack-query" %}
        Cache[Query Cache]
        {%- endif %}
    end

    subgraph Server
        Action[Server Action]
        Route[API Route]
    end

    subgraph External
        API[Backend API]
    end

    UI --> Hook
    {%- if values.dataFetching == "tanstack-query" %}
    Hook --> Cache
    Cache --> Route
    {%- else %}
    Hook --> Route
    {%- endif %}
    Route --> API
    Action --> API
```

## Build & Deploy

```mermaid
flowchart TB
    subgraph GitHub
        Repo[Repository]
        Actions[GitHub Actions]
    end

    subgraph Build
        Lint[ESLint + TypeScript]
        Test[Unit + E2E Tests]
        Build[Next.js Build]
    end

    subgraph Registry
        ECR[Container Registry]
    end

    subgraph Kubernetes
        Deploy[Deployment]
        SVC[Service]
        HPA[HPA]
        Ingress[Ingress]
    end

    subgraph CDN
        CF[CloudFront]
        S3[S3 Static]
    end

    Repo --> Actions
    Actions --> Lint
    Lint --> Test
    Test --> Build
    Build --> ECR
    Build --> S3
    ECR --> Deploy
    Deploy --> SVC
    SVC --> Ingress
    Ingress --> CF
    S3 --> CF
```

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   ├── loading.tsx         # Loading UI
│   └── api/                # API routes
│       └── health/         # Health endpoint
├── components/             # React components
│   ├── ui/                 # UI primitives (shadcn)
│   └── [feature]/          # Feature components
├── hooks/                  # Custom React hooks
│   └── use-[name].ts
├── lib/                    # Utilities
│   ├── api.ts              # API client
│   ├── datadog.tsx         # Datadog RUM
│   └── utils.ts            # Helpers
├── providers/              # Context providers
│   └── index.tsx           # Combined providers
├── stores/                 # State management
│   └── [name].ts
└── types/                  # TypeScript types
    └── index.ts
```

## Security Model

```mermaid
flowchart TB
    subgraph Browser
        User[User]
        RUM[Datadog RUM]
    end

    subgraph Edge
        WAF[WAF]
        CDN[CloudFront]
    end

    subgraph Next.js
        Headers[Security Headers]
        CSP[Content Security Policy]
        {%- if values.authentication != "none" %}
        Auth[Auth Middleware]
        {%- endif %}
        App[Application]
    end

    User --> WAF
    WAF --> CDN
    CDN --> Headers
    Headers --> CSP
    {%- if values.authentication != "none" %}
    CSP --> Auth
    Auth --> App
    {%- else %}
    CSP --> App
    {%- endif %}
```

## Observability

```mermaid
flowchart LR
    subgraph Browser
        App[Next.js App]
        RUM[Datadog RUM]
        Logs[Browser Logs]
    end

    subgraph Datadog
        APM[APM Traces]
        RUMDash[RUM Dashboard]
        LogsUI[Log Explorer]
        Alerts[Alerts]
    end

    App --> RUM
    RUM --> RUMDash
    RUM --> APM
    Logs --> LogsUI
    RUMDash --> Alerts
```
