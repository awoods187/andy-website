# CI/CD Setup Guide

## Overview

This guide will help you set up and activate the comprehensive CI/CD pipeline for your Astro website. The pipeline includes code quality checks, testing, security scanning, and automated dependency management.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration Files](#configuration-files)
3. [Local Setup](#local-setup)
4. [GitHub Repository Settings](#github-repository-settings)
5. [Running Checks Locally](#running-checks-locally)
6. [CI/CD Pipeline Overview](#cicd-pipeline-overview)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Step 1: Install Dependencies

```bash
# Install all npm dependencies (including new dev dependencies)
npm install

# Install pre-commit (Python tool for git hooks)
# Option 1: Using pip
pip install pre-commit

# Option 2: Using pipx (recommended for isolated installation)
pipx install pre-commit

# Option 3: Using Homebrew (macOS)
brew install pre-commit
```

### Step 2: Set Up Pre-commit Hooks

```bash
# Install the git hooks
pre-commit install

# Test that hooks are working
pre-commit run --all-files
```

### Step 3: Push to GitHub

```bash
# Stage all the new configuration files
git add .

# Commit the CI/CD setup
git commit -m "feat(ci): Add comprehensive CI/CD pipeline with testing and quality gates"

# Push to your branch
git push
```

The CI pipeline will automatically run when you push or create a PR!

---

## Configuration Files

### Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Main CI pipeline (format, lint, test, security, build) |
| `.github/dependabot.yml` | Automated dependency updates |
| `.github/pull_request_template.md` | Standardized PR template with checklist |
| `.github/CODEOWNERS` | Automatic review assignment |
| `.pre-commit-config.yaml` | Git hooks for local quality checks |
| `.eslintrc.json` | ESLint configuration for TypeScript/Astro |
| `.prettierrc.json` | Code formatting rules |
| `.prettierignore` | Files to exclude from formatting |
| `vitest.config.ts` | Updated with coverage thresholds (80%) |
| `package.json` | Updated with new scripts and dev dependencies |

---

## Local Setup

### Prerequisites

- **Node.js**: 18, 20, or 22 (the CI tests all three)
- **npm**: Comes with Node.js
- **Python 3.8+**: Required for pre-commit hooks
- **Git**: For version control

### Development Workflow

```bash
# Start development server
npm run dev

# Run all quality checks (same as CI)
npm run validate

# Individual checks
npm run format:check   # Check code formatting
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
npm run test           # Run tests
npm run test:coverage  # Run tests with coverage report

# Auto-fix issues
npm run format         # Auto-format code with Prettier
npm run lint:fix       # Auto-fix ESLint issues
```

### Recommended VS Code Extensions

Add to `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "astro-build.astro-vscode"
  ]
}
```

Enable format on save in `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## GitHub Repository Settings

### Branch Protection Rules

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Configure:
   - ✅ Require a pull request before merging
     - Required approvals: 1 (or 0 for solo projects)
   - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - Add status checks:
       - `Format Check (Prettier)`
       - `Lint & Type Check`
       - `Test (Node 18)`
       - `Test (Node 20)`
       - `Test (Node 22)`
       - `Security Scan`
       - `Build Verification`
       - `Astro Check`
       - `All Checks Passed`
   - ✅ Require conversation resolution before merging
   - ✅ Include administrators (optional but recommended)

### Enable Dependabot

1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates

### Secrets Configuration

No secrets are required for the basic CI pipeline. If you add deployment or external services later:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add secrets as needed (e.g., `VERCEL_TOKEN`, `NPM_TOKEN`)

---

## Running Checks Locally

### Before Committing

Pre-commit hooks will automatically run. To manually test:

```bash
# Run all pre-commit hooks
pre-commit run --all-files

# Run specific hook
pre-commit run prettier --all-files
pre-commit run eslint --all-files
```

### Before Pushing

Run the full validation suite:

```bash
npm run validate
```

This runs:
1. Format check (Prettier)
2. Lint (ESLint)
3. Type check (TypeScript)
4. Tests with coverage

### View Coverage Report

```bash
npm run test:coverage
open coverage/index.html
```

---

## CI/CD Pipeline Overview

### Workflow: `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` branch
- All pull requests
- Manual dispatch (via GitHub UI)

**Jobs:**

1. **Format Check** (~30s)
   - Runs Prettier to ensure consistent code formatting
   - Fails if any files need formatting

2. **Lint & Type Check** (~45s)
   - ESLint checks code quality and catches potential bugs
   - TypeScript compiler validates types
   - Enforces zero warnings

3. **Test (Matrix)** (~1-2 min)
   - Runs on Node.js 18, 20, 22
   - Executes Vitest test suite
   - Enforces 80% coverage threshold
   - Uploads coverage reports

4. **Security Scan** (~1 min)
   - `npm audit` for known vulnerabilities
   - Fails on high/critical issues in production deps
   - Uploads audit results as artifacts

5. **Build Verification** (~1 min)
   - Builds production bundle
   - Verifies output directory
   - Reports bundle size
   - Uploads build artifacts

6. **Astro Check** (~30s)
   - Astro-specific validation
   - Checks component syntax and imports

7. **All Checks Passed** (gate)
   - Meta-job that ensures all checks succeeded
   - Use this as your required status check

**Total Pipeline Time:** ~3-5 minutes (with cache)

### Dependabot Configuration

**Schedule:** Weekly on Monday at 9 AM ET

**Grouping:**
- Development dependencies: Minor + Patch updates grouped
- Production dependencies: Minor + Patch updates grouped
- Security updates: Always separate, immediate

**Limits:**
- Max 5 open PRs for npm dependencies
- Max 3 open PRs for GitHub Actions

---

## Troubleshooting

### Pre-commit Hooks Fail

**Issue:** Hooks fail with "command not found"

**Solution:**
```bash
# Ensure pre-commit is installed
pip install pre-commit
# Or
pipx install pre-commit

# Reinstall hooks
pre-commit uninstall
pre-commit install
```

### ESLint Errors

**Issue:** ESLint reports errors that aren't in your editor

**Solution:**
```bash
# Ensure VS Code is using the right ESLint config
# Install the ESLint extension
# Reload VS Code

# Check ESLint output
npm run lint

# Auto-fix what you can
npm run lint:fix
```

### Coverage Below Threshold

**Issue:** Tests pass but coverage is below 80%

**Solution:**
```bash
# View detailed coverage report
npm run test:coverage
open coverage/index.html

# Identify uncovered lines (shown in red)
# Add tests for uncovered code
# Or adjust threshold in vitest.config.ts (not recommended)
```

### GitHub Actions Failing Locally Works

**Issue:** CI fails but all checks pass locally

**Common causes:**
1. **Node version mismatch:** CI tests Node 18, 20, 22
   ```bash
   # Test with different Node versions using nvm
   nvm install 18
   nvm use 18
   npm ci
   npm run validate
   ```

2. **Outdated dependencies:** Local uses `package-lock.json`, CI uses `npm ci`
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   npm run validate
   ```

3. **Environment differences:** Check CI logs for specific errors
   - View workflow run in GitHub Actions tab
   - Download artifacts for detailed reports

### Pre-commit Too Slow

**Issue:** Pre-commit hooks take too long

**Solution:**
```bash
# Run hooks only on staged files (default behavior)
git add <files>
git commit

# Skip hooks temporarily (not recommended)
git commit --no-verify

# Update hooks for faster execution
pre-commit autoupdate
```

### TypeScript Errors

**Issue:** `type-check` script fails

**Solution:**
```bash
# Run TypeScript compiler directly
npx tsc --noEmit

# Check tsconfig.json is correct
# Ensure all .ts/.astro files are included
```

---

## Next Steps

### Recommended Additions

1. **Code Coverage Reporting**
   - Set up Codecov or Coveralls
   - Add coverage badge to README

2. **Performance Monitoring**
   - Integrate Lighthouse CI
   - Track Core Web Vitals over time

3. **Visual Regression Testing**
   - Add Percy or Chromatic
   - Catch unintended UI changes

4. **Deployment Automation**
   - Vercel auto-deploys are already set up
   - Consider preview deployments for PRs

5. **Release Automation**
   - Conventional commits → Semantic versioning
   - Auto-generate changelog
   - GitHub releases on version tags

### Maintenance

**Weekly:**
- Review Dependabot PRs
- Merge automated dependency updates

**Monthly:**
- Review coverage trends
- Update CI dependencies
- Check for new ESLint/Prettier rules

**Quarterly:**
- Audit security settings
- Review and update branch protection rules
- Evaluate CI performance and optimization

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Pre-commit Documentation](https://pre-commit.com/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Astro Documentation](https://docs.astro.build/)

---

## Status Badges

Add to your README.md:

```markdown
![CI](https://github.com/awoods187/andy-website/workflows/CI/badge.svg)
![Node Version](https://img.shields.io/badge/node-18%20%7C%2020%20%7C%2022-brightgreen)
![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
```

---

**Questions or Issues?**

- Check the [Troubleshooting](#troubleshooting) section
- Review GitHub Actions logs for detailed error messages
- Run checks locally to debug faster
