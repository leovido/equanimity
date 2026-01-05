---
name: Biome CI/CD Lefthook
overview: Set up Biome (replacing ESLint), Lefthook for git hooks, GitHub Actions CI/CD with SonarCloud integration, and Vitest for testing.
todos:
  - id: biome-setup
    content: Install Biome, create biome.json config, replace ESLint dependencies and config, update package.json scripts
    status: pending
  - id: lefthook-setup
    content: Install Lefthook, create .lefthook.yml with pre-commit and pre-push hooks, add prepare script to package.json
    status: pending
    dependencies:
      - biome-setup
  - id: vitest-setup
    content: Install Vitest and testing dependencies, create vitest.config.ts and setup file, add test scripts to package.json
    status: pending
  - id: github-actions
    content: Create .github/workflows/ci.yml with steps for lint, type-check, test, build, and SonarCloud integration
    status: pending
    dependencies:
      - biome-setup
      - vitest-setup
  - id: sonarcloud-config
    content: Create sonar-project.properties file with project configuration and exclusions
    status: pending
---

# Setup Biome, CI/CD, and Lefthook

This plan sets up a complete development workflow with Biome for linting/formatting, Lefthook for git hooks, GitHub Actions CI/CD with SonarCloud integration, and Vitest for testing.

## Architecture Overview

```javascript
Developer Workflow:
  ┌─────────────┐
  │ Git Commit  │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Lefthook   │ ◄─── Pre-commit hooks
  │  (Local)    │      - Biome check
  └──────┬──────┘      - Type check
         │             - Tests
         ▼
  ┌─────────────┐
  │   GitHub    │ ◄─── CI/CD Pipeline
  │   Actions   │      - Lint/Format
  └──────┬──────┘      - Type check
         │             - Tests
         │             - Build
         │             - SonarCloud
         ▼
  ┌─────────────┐
  │ SonarCloud  │
  └─────────────┘
```



## Implementation Details

### 1. Biome Setup

**Files to create/modify:**

- `biome.json` - Biome configuration
- `package.json` - Add Biome dependencies and scripts
- Remove `.eslintrc.json` and ESLint dependencies

**Configuration:**

- Replace ESLint with Biome for linting and formatting
- Configure for Next.js, TypeScript, and React
- Set up import sorting and code organization rules
- Add scripts: `biome:check`, `biome:format`, `biome:fix`

### 2. Lefthook Setup

**Files to create:**

- `.lefthook.yml` - Git hooks configuration
- `.lefthook/` directory (if needed for custom scripts)

**Hooks to configure:**

- **pre-commit**: Run Biome check and format staged files
- **pre-push**: Run type check and tests

**Benefits:**

- Prevents bad code from being committed
- Ensures consistency before pushing
- Fast local feedback

### 3. CI/CD with GitHub Actions

**Files to create:**

- `.github/workflows/ci.yml` - Main CI/CD workflow

**Workflow steps:**

1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run Biome check (lint + format)
5. Run TypeScript type check
6. Run tests with Vitest
7. Build Next.js application
8. Run SonarCloud analysis

**Triggers:**

- On push to `main` branch
- On pull requests
- Manual workflow dispatch

### 4. SonarCloud Integration

**Configuration:**

- Add `sonar-project.properties` file
- Configure GitHub Actions with SonarCloud token (secret)
- Set up quality gates and coverage reporting
- Exclude `node_modules`, `.next`, and other build artifacts

**Files to create:**

- `sonar-project.properties` - SonarCloud project configuration

### 5. Vitest Testing Setup

**Files to create:**

- `vitest.config.ts` - Vitest configuration
- `vitest.setup.ts` - Test setup file (if needed)
- Example test structure in `__tests__/` or co-located with components

**Configuration:**

- Configure for Next.js and React Testing Library
- Set up coverage reporting
- Add test scripts to `package.json`

**Dependencies to add:**

- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `jsdom` (for DOM testing)

## File Structure

```javascript
build-a-life/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions workflow
├── .lefthook.yml                     # Lefthook configuration
├── biome.json                        # Biome configuration
├── sonar-project.properties          # SonarCloud configuration
├── vitest.config.ts                  # Vitest configuration
├── vitest.setup.ts                   # Test setup (optional)
├── package.json                      # Updated with new scripts/deps
└── __tests__/                        # Test directory (optional)
```



## Migration Strategy

1. **Phase 1**: Install and configure Biome, remove ESLint
2. **Phase 2**: Set up Lefthook with basic hooks
3. **Phase 3**: Configure Vitest and create initial test structure
4. **Phase 4**: Set up GitHub Actions workflow
5. **Phase 5**: Integrate SonarCloud

## Scripts to Add

```json
{
  "scripts": {
    "biome:check": "biome check .",
    "biome:format": "biome format --write .",
    "biome:fix": "biome check --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "prepare": "lefthook install"
  }
}
```



## Environment Variables / Secrets

**GitHub Secrets needed:**

- `SONAR_TOKEN` - SonarCloud authentication token

## Notes

- Biome will handle both linting and formatting, replacing ESLint and Prettier
- Lefthook will run automatically on git operations after `npm install` (via prepare script)