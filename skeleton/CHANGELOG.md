# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project creation from Golden Path template

### Changed

### Fixed

---

## [0.1.0] - ${{ '$now' | date('YYYY-MM-DD') }}

### Added
- Initial project structure
- Next.js 15 with App Router
- TypeScript configuration
- Health check endpoint
{%- if values.styling == "tailwind" %}
- Tailwind CSS styling
{%- endif %}
{%- if values.uiLibrary == "shadcn" %}
- shadcn/ui components
{%- endif %}
- Datadog RUM integration
{%- if values.authentication != "none" %}
- Authentication setup
{%- endif %}
- Docker containerization
- Kubernetes manifests
- CI/CD pipeline (GitHub Actions)
- Code quality tools (ESLint, Prettier)
- Testing setup

---

[Unreleased]: https://github.com/${{values.owner}}/${{values.name}}/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/${{values.owner}}/${{values.name}}/releases/tag/v0.1.0
