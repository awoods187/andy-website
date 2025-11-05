# Contributing to Andy Woods Personal Website

Thank you for your interest in contributing! This document explains the project
structure and development workflow.

---

## Project Structure

### Directory Organization

```
andy-website/
├── src/                  # Source code (Astro project)
├── docs/                 # Project documentation
├── config/               # Configuration files (non-root)
├── scripts/              # Utility scripts
├── tests/                # Test files
├── public/               # Static assets served directly
├── reports/              # Generated reports (not in version control)
└── [root configs]        # Astro, TypeScript, Vitest configs
```

### Source Code (`src/`)

- **`components/`**: Reusable Astro components (Header, Footer, PostCard, etc.)
- **`content/`**: Content collections (blog posts in Markdown)
- **`data/`**: Static data files (external blog posts)
- **`layouts/`**: Page layout templates (BaseLayout, etc.)
- **`pages/`**: Route pages (generates URLs)
- **`styles/`**: Global CSS and Tailwind configuration

### Documentation (`docs/`)

- **`setup/`**: Setup guides (Buttondown, CI, subscriptions)
- **`licenses/`**: License details (CODE, CONTENT, OVERVIEW)
- **Core docs**: CONTENT-GUIDE, DEPLOYMENT, MAINTENANCE, TROUBLESHOOTING
- **Style guides**: VISUAL_STYLE_GUIDE, README-AI-POLICY

### Configuration (`config/`)

- **`vercel.json`**: Vercel deployment configuration

**Note**: Core tool configs (Astro, ESLint, TypeScript, Vitest) remain at root
per framework conventions and tooling compatibility.

### Scripts (`scripts/`)

- **`scrape-crl-posts.py`**: Scrapes external blog posts from Cockroach Labs
- **`validate-yaml-frontmatter.mjs`**: Validates blog post frontmatter

### Tests (`tests/`)

- **`build.test.ts`**: Build output validation
- **`content.test.ts`**: Content schema validation
- **`external-posts.test.ts`**: External posts validation

---

## Development Workflow

### Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+ (optional, for blog scraping)

### Installation

```bash
git clone https://github.com/awoods187/andy-website.git
cd andy-website
npm install

# Optional: Install Python dependencies
pip install -r requirements.txt
```

### Development Commands

| Command                   | Purpose                           |
| ------------------------- | --------------------------------- |
| `npm run dev`             | Start dev server (localhost:4321) |
| `npm run build`           | Production build → `./dist/`      |
| `npm run preview`         | Preview production build          |
| `npm test`                | Run test suite                    |
| `npm run test:watch`      | Watch mode for tests              |
| `npm run lint`            | Run ESLint                        |
| `npm run lint:fix`        | Auto-fix ESLint issues            |
| `npm run format`          | Format with Prettier              |
| `npm run format:check`    | Check formatting                  |
| `npm run type-check`      | TypeScript type checking          |
| `npm run validate`        | Run all validation checks         |
| `npm run lighthouse`      | Run Lighthouse audit              |
| `npm run lighthouse:view` | View Lighthouse report            |

### Making Changes

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the project structure

3. **Test your changes**:

   ```bash
   npm run build
   npm test
   npm run validate
   ```

4. **Commit with conventional commits**:

   ```bash
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue"
   # or
   git commit -m "docs: update documentation"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Adding Content

### Personal Blog Posts

1. Create a new Markdown file in `src/content/blog/`:

   ```bash
   touch src/content/blog/my-new-post.md
   ```

2. Add frontmatter and content (see `docs/CONTENT-GUIDE.md` for details)

3. Preview: `npm run dev` and visit `http://localhost:4321/blog/my-new-post`

4. Commit when ready

### External Blog Posts

**Option 1 - Manual**: Edit `src/data/crl-posts.ts` and add entry.

**Option 2 - Automated**:

```bash
python3 scripts/scrape-crl-posts.py
```

See `docs/CONTENT-GUIDE.md` for complete details.

---

## Code Style

### TypeScript

- **Strict mode enabled**: All type checks enforced
- **Explicit return types**: For all functions
- **No `any`**: Use specific types or `unknown`

### React/Astro

- **Functional components**: No class components
- **Component per file**: Collocate tests with source
- **Props interface**: Define explicit prop types

### Naming Conventions

- **Components**: PascalCase (`BlogPostCard.astro`)
- **Functions/variables**: camelCase (`formatDate`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_POSTS_PER_PAGE`)
- **Files**: kebab-case for pages (`getting-started.md`)

### File Organization

- Keep files under 300 lines
- Extract reusable logic to `src/lib/utils/`
- Group related components in subdirectories

---

## Testing

### Running Tests

```bash
npm test              # All tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Test Structure

- **Build tests**: Validate generated output
- **Content tests**: Schema validation
- **Integration tests**: Component behavior

### Writing Tests

See existing tests in `tests/` for patterns. Focus on:

- User-facing behavior over implementation
- Integration over isolated units
- Critical paths and edge cases

---

## Documentation

When making changes that affect:

- **Project structure**: Update this file and README
- **Configuration**: Update relevant setup guides in `docs/setup/`
- **Content workflow**: Update `docs/CONTENT-GUIDE.md`
- **Deployment**: Update `docs/DEPLOYMENT.md`
- **Troubleshooting**: Add to `docs/TROUBLESHOOTING.md`

---

## Pre-commit Hooks

This project uses pre-commit hooks for:

- Trailing whitespace removal
- End-of-file fixing
- YAML/JSON validation
- Prettier formatting
- ESLint linting

Hooks run automatically on `git commit`. To bypass (not recommended):

```bash
git commit --no-verify
```

---

## Deployment

**Production**: Automatic on push to `main` via Vercel

**Preview**: Automatic for all branches and PRs

See `docs/DEPLOYMENT.md` for full deployment guide.

---

## Questions?

- **Issues**: [GitHub Issues](https://github.com/awoods187/andy-website/issues)
- **Contact**: [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/)
- **Discussions**: Use GitHub Discussions for questions

---

## License

- **Code**: MIT License (see `LICENSE`)
- **Content**: CC BY-NC 4.0 (see `docs/licenses/LICENSE-CONTENT.md`)

See `docs/licenses/LICENSE-OVERVIEW.md` for complete dual licensing explanation.
