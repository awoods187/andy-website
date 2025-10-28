# YAML Frontmatter Guide

This guide explains the YAML frontmatter requirements for blog posts and how to
avoid common parsing errors.

## Overview

All blog posts in `src/content/blog/` must have valid YAML frontmatter. The
frontmatter is parsed by:

1. **Astro build process** (using js-yaml library)
2. **Our test suite** (using js-yaml library)
3. **CI/CD pipeline** (automated validation)

Invalid YAML will cause build failures with errors like:

```
YAMLException: bad indentation of a mapping entry
```

## Required Fields

Every blog post must include these fields:

```yaml
---
title: 'Post Title'
date: 2025-10-21
excerpt: 'Brief description of the post'
tags: [tag1, tag2, tag3]
image: /images/blog/post-slug-hero.jpg
---
```

### Field Requirements

| Field         | Type   | Required | Max Length | Notes                          |
| ------------- | ------ | -------- | ---------- | ------------------------------ |
| `title`       | string | ✅ Yes   | 100 chars  | Must be quoted if contains `:` |
| `date`        | date   | ✅ Yes   | -          | Format: `YYYY-MM-DD`           |
| `excerpt`     | string | ✅ Yes   | 200 chars  | Must be quoted if contains `:` |
| `tags`        | array  | ✅ Yes   | -          | At least one tag required      |
| `image`       | string | ❌ No    | -          | Path to hero image             |
| `imageSource` | string | ❌ No    | -          | Attribution for image          |
| `license`     | string | ❌ No    | -          | Content license                |
| `copyright`   | string | ❌ No    | -          | Copyright notice               |
| `attribution` | string | ❌ No    | -          | Attribution requirements       |

## Common Pitfalls and Solutions

### 1. Unquoted Values with Colons ❌

**Problem:** Colons have special meaning in YAML (key-value separator)

```yaml
# ❌ WRONG - Will cause YAMLException
title: How I Built My Blog: Why I Use Different AI Models
```

**Solution:** Always quote values containing colons

```yaml
# ✅ CORRECT
title: 'How I Built My Blog: Why I Use Different AI Models'
```

### 2. Multi-line Values Without Indicators ❌

**Problem:** Multi-line values need proper YAML syntax

```yaml
# ❌ WRONG - Parser will fail
excerpt:
  This is a very long excerpt that spans multiple lines without proper
  indicators
```

**Solution:** Use single-line with quotes (recommended)

```yaml
# ✅ CORRECT
excerpt:
  'This is a very long excerpt that stays on one line but wraps in your editor'
```

Or use YAML block scalar indicators:

```yaml
# ✅ ALSO CORRECT (but not recommended for simplicity)
excerpt: |
  This is a multi-line excerpt
  using the pipe indicator
```

### 3. Inconsistent Indentation ❌

**Problem:** YAML requires consistent 2-space indentation

```yaml
# ❌ WRONG - Mixed indentation
tags:
  - web-development - astro # Wrong indentation
```

**Solution:** Always use 2 spaces

```yaml
# ✅ CORRECT
tags:
  - web-development
  - astro
```

Or use inline array format (recommended):

```yaml
# ✅ ALSO CORRECT (simpler)
tags: [web-development, astro, python]
```

### 4. Special Characters Without Quotes ❌

**Problem:** Special characters can break YAML parsing

```yaml
# ❌ WRONG - Special characters
title: Build & Deploy: A Guide
excerpt: Here's how to do it!
```

**Solution:** Quote values with special characters

```yaml
# ✅ CORRECT
title: 'Build & Deploy: A Guide'
excerpt: "Here's how to do it!"
```

## Recommended Format

For consistency and to avoid parsing errors, use this format:

```yaml
---
title: 'Your Post Title: With Colons if Needed'
date: 2025-10-21
excerpt: 'A brief summary of your post (under 200 characters)'
tags: [web-development, astro, python, testing]
image: /images/blog/post-slug-hero.jpg
imageSource: 'AI-generated using Stable Diffusion'
license: 'CC BY-NC 4.0'
copyright: '© 2025 Your Name'
attribution:
  'If you quote or translate this post, please provide attribution with a link
  back to the original'
---
```

**Key points:**

- ✅ Single-line format for simple values
- ✅ Quotes around `title` and `excerpt` (defensive coding)
- ✅ Inline array format for `tags`
- ✅ Consistent 2-space indentation
- ✅ No trailing spaces

## Validation Tools

### Local Validation

Run validation before committing:

```bash
# Validate YAML frontmatter
npm run validate:yaml

# Run all tests (includes YAML validation)
npm test

# Full validation (format, lint, type-check, yaml, tests)
npm run validate
```

### CI/CD Validation

The CI pipeline automatically validates all YAML frontmatter on every push and
PR.

**Pipeline jobs:**

1. ✅ Format Check (Prettier)
2. ✅ **YAML Frontmatter Validation** ← Catches errors early
3. ✅ Lint & Type Check
4. ✅ Tests
5. ✅ Security Scan
6. ✅ Build Verification
7. ✅ Astro Check

### Pre-commit Hook

Install pre-commit hooks to catch errors before commit:

```bash
pip install pre-commit
pre-commit install
```

The hook will automatically:

- Format code with Prettier
- Run ESLint
- Validate YAML frontmatter

## Troubleshooting

### Error: "YAMLException: bad indentation of a mapping entry"

**Cause:** Value with colon is not quoted

**Fix:**

```yaml
# Before (broken)
title: My Post: A Guide

# After (fixed)
title: "My Post: A Guide"
```

### Error: "YAML parsing failed"

**Cause:** Invalid YAML syntax

**Fix:** Run the validation script for detailed error:

```bash
npm run validate:yaml
```

The script will show:

- Which file has the error
- Line number
- Specific error message
- Suggested fixes

### Error: "expected null to be truthy" (in tests)

**Cause:** Missing required frontmatter field

**Fix:** Ensure all required fields are present:

- `title`
- `date`
- `excerpt`
- `tags`

## Testing Your Frontmatter

### Quick Test

Create a test file and run:

```bash
node -e "const yaml = require('js-yaml'); const fs = require('fs'); const content = fs.readFileSync('src/content/blog/your-post.md', 'utf-8'); const fm = content.match(/^---\n([\s\S]*?)\n---/); console.log(yaml.load(fm[1]));"
```

If this outputs your frontmatter object, it's valid!

### Automated Tests

The test suite includes comprehensive YAML validation:

```bash
# Run only YAML validation tests
npm test -- tests/yaml-frontmatter-validation.test.ts

# Run all tests
npm test
```

Tests verify:

- ✅ Valid YAML syntax
- ✅ Required fields present
- ✅ Field types correct
- ✅ No common pitfalls
- ✅ Astro build compatibility

## Best Practices

1. **Always quote strings with special characters**: Especially `:`, `#`, `@`,
   `&`, `!`
2. **Use single-line format**: Simpler and less error-prone
3. **Keep excerpts under 200 characters**: For SEO and consistency
4. **Use inline array syntax**: `[tag1, tag2]` instead of multi-line
5. **Test locally before pushing**: Run `npm run validate:yaml`
6. **Don't edit YAML manually in production**: Use local development
7. **Be consistent**: Follow the recommended format above

## Editor Support

### VS Code

Install these extensions for YAML validation:

- **YAML** by Red Hat - Syntax highlighting and validation
- **Prettier** - Auto-formatting

Add to your VS Code `settings.json`:

```json
{
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

### Other Editors

- **Vim/Neovim**: Use `ale` or `coc-yaml`
- **Sublime Text**: Use `YAMLLint`
- **Atom**: Use `linter-js-yaml`

## Additional Resources

- [YAML Specification](https://yaml.org/spec/1.2/spec.html)
- [js-yaml Documentation](https://github.com/nodeca/js-yaml)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Our CI/CD Pipeline](../.github/workflows/ci.yml)

## Questions?

If you encounter YAML parsing errors:

1. Run `npm run validate:yaml` for specific error details
2. Check this guide for common solutions
3. Test your YAML with the quick test above
4. Review the error in CI/CD logs for line numbers

---

**Last Updated:** 2025-10-28 **Maintained By:** CI/CD Team
