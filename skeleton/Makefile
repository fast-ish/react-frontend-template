.PHONY: help install dev build start lint format test e2e docker clean

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install    Install dependencies"
	@echo "  make dev        Start development server"
	@echo "  make build      Build for production"
	@echo "  make start      Start production server"
	@echo ""
	@echo "Quality:"
	@echo "  make lint       Run ESLint"
	@echo "  make format     Format with Prettier"
	@echo "  make typecheck  Run TypeScript checks"
	@echo "  make test       Run unit tests"
	@echo "  make e2e        Run E2E tests"
	@echo "  make validate   Run all checks"
	@echo ""
	@echo "Docker:"
	@echo "  make docker     Build Docker image"
	@echo "  make run        Run Docker container"
	@echo ""
	@echo "Misc:"
	@echo "  make clean      Clean build artifacts"

# Development
install:
	npm ci

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

# Quality
lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

format-check:
	npm run format:check

typecheck:
	npm run typecheck

test:
	npm run test

test-coverage:
	npm run test:coverage

e2e:
	npm run e2e

e2e-ui:
	npm run e2e:ui

validate:
	npm run validate

# Docker
docker:
	docker build -t ${{values.name}}:latest .

run:
	docker run -p 3000:3000 ${{values.name}}:latest

# Cleanup
clean:
	rm -rf .next node_modules coverage playwright-report test-results
