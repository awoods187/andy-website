# MarkdownDocument Component

A reusable Astro component that renders markdown content in a dark, Claude
artifact-style container with copy-to-clipboard functionality.

## Features

- 🎨 **Dark Theme**: Professional dark background (#1e1e1e) with light text for
  high contrast
- 📋 **Copy Functionality**: Copy entire document or individual code blocks to
  clipboard
- 🎯 **Syntax Highlighting**: Built-in support via Astro's Shiki integration
- ♿ **Accessible**: WCAG AA compliant with keyboard navigation and screen
  reader support
- 📱 **Responsive**: Mobile-friendly with proper touch targets
- 🔧 **Easy to Use**: Works in MDX files with simple component syntax

## Installation

The component is already installed and configured in this project. No additional
setup required!

## Usage

### Basic Usage

Create or edit an `.mdx` file in `src/content/blog/`:

````mdx
---
title: 'My Blog Post'
date: 2025-11-05
excerpt: 'Example post'
tags: ['example']
---

import MarkdownDocument from '../../components/MarkdownDocument.astro';

Regular blog content goes here...

<MarkdownDocument title="Implementation Guide">

# Your Markdown Content

This content will be rendered in a dark container.

## Features

- Supports all markdown syntax
- Code blocks with syntax highlighting
- Lists, tables, images, etc.

```typescript
const example = 'with code blocks';
```
````

</MarkdownDocument>

More regular blog content...

````

### Without Title

You can omit the title attribute for a simpler header:

```mdx
<MarkdownDocument>

# Just the Content

No header bar, just the dark container.

</MarkdownDocument>
````

## Supported Markdown Features

### Headings

```markdown
# Heading 1

## Heading 2

### Heading 3

#### Heading 4
```

All headings use the Space Grotesk font and appear in white with opacity
variations for hierarchy.

### Text Formatting

```markdown
**Bold text** - appears in white _Italic text_ - appears in light gray
`inline code` - has dark background with syntax highlighting
[Links](https://example.com) - appear in blue (#58a6ff)
```

### Lists

```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
```

### Code Blocks

````markdown
```javascript
function example() {
  return 'Syntax highlighted!';
}
```

```python
def example():
    return "Supports many languages"
```

```sql
SELECT * FROM users WHERE active = true;
```
````

Each code block gets:

- Darker background (#0d1117) than the container
- Copy button in top-right corner
- Syntax highlighting for 100+ languages

### Blockquotes

```markdown
> Important note or quote Appears with blue left border
```

### Tables

```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### Task Lists

```markdown
- [x] Completed task
- [ ] Incomplete task
```

## Copy Functionality

### Copy Individual Code Blocks

Hover over any code block to reveal a copy button in the top-right corner. Click
to copy that specific code block.

### Copy Entire Document

If the document has a title, a copy button appears in the header. Click to copy
all the text content from the document.

**Keyboard Accessibility:**

- Tab to navigate to copy buttons
- Enter or Space to activate

**Screen Reader Support:**

- Buttons announce their purpose
- Success/failure states are announced
- Proper ARIA labels throughout

## Styling Details

### Color Palette

- **Container Background**: `#1e1e1e`
- **Code Block Background**: `#0d1117`
- **Text Color**: `#e6edf3` (light gray-blue)
- **Headings**: `#ffffff` (white with opacity)
- **Links**: `#58a6ff` (GitHub blue)
- **Borders**: `rgba(255, 255, 255, 0.1)`

### Typography

- **Headings**: Space Grotesk (sans-serif)
- **Body Text**: ui-monospace, SF Mono, Monaco (monospace)
- **Code**: Same as body, slightly smaller

### Spacing

- **Container Margin**: 2rem top/bottom
- **Content Padding**: 1.5rem (1rem on mobile)
- **Code Block Margin**: 1rem top/bottom
- **Heading Spacing**: Varies by level (1.5rem to 1rem top margin)

## Examples

### Example 1: Implementation Task

````mdx
<MarkdownDocument title="Phase 1: Setup">

# Task: Configure Database

## Objective

Set up PostgreSQL database with proper schema and indexes.

## Steps

1. Install PostgreSQL 15+
2. Create database and user
3. Run migration scripts
4. Verify connection

## Migration Script

```sql
CREATE DATABASE myapp;
CREATE USER myapp_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;
```
````

## Success Criteria

- ✅ Database accessible
- ✅ All tables created
- ✅ Indexes optimized

</MarkdownDocument>
```

### Example 2: Code Review Notes

````mdx
<MarkdownDocument title="Code Review - PR #123">

# Review: User Authentication Feature

## Strengths

- Clean separation of concerns
- Good test coverage (87%)
- Proper error handling

## Issues Found

### Security Concern

```javascript
// BEFORE (insecure)
const password = req.body.password;
db.query(`SELECT * FROM users WHERE password = '${password}'`);

// AFTER (secure)
const password = req.body.password;
db.query('SELECT * FROM users WHERE password = $1', [password]);
```
````

### Performance Issue

Consider adding index:

```sql
CREATE INDEX idx_users_email ON users(email);
```

## Action Items

- [ ] Fix SQL injection vulnerability
- [ ] Add database index
- [ ] Update tests

</MarkdownDocument>
```

### Example 3: API Documentation

````mdx
<MarkdownDocument title="API Endpoint Documentation">

# POST /api/users

Create a new user account.

## Request Body

```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```
````

## Response (200 OK)

```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-11-05T12:00:00Z"
}
```

## Error Responses

**400 Bad Request** - Invalid input **409 Conflict** - Email already exists
**500 Server Error** - Internal error

</MarkdownDocument>
```

## Technical Details

### File Structure

```
src/
├── components/
│   └── MarkdownDocument.astro    # Component definition
├── scripts/
│   └── copy-code.ts               # Copy functionality
└── styles/
    └── global.css                 # Component styles
```

### How It Works

1. **Component**: `MarkdownDocument.astro` renders a dark container with
   optional header
2. **Styling**: `.markdown-document` CSS classes in `global.css` override
   default `.prose` styles
3. **Copy Script**: `copy-code.ts` handles both code block and document copying
4. **MDX Integration**: Astro's MDX plugin allows component usage in markdown
   files

### Browser Support

- Modern browsers with ES6+ support
- Clipboard API support (with fallback for older browsers)
- Tested on: Chrome, Firefox, Safari, Edge

### Performance

- Zero external dependencies (uses Astro built-ins)
- Minimal CSS (added to existing global.css)
- No runtime JavaScript overhead (copy script only loads when needed)
- Build-time processing via Astro

## Troubleshooting

### Component not appearing

**Issue**: Component doesn't render in blog post.

**Solution**: Ensure you're using an `.mdx` file (not `.md`) and importing the
component:

```mdx
import MarkdownDocument from '../../components/MarkdownDocument.astro';

;
```

### Copy button not working

**Issue**: Copy buttons don't respond to clicks.

**Solution**: Check browser console for errors. Ensure `copy-code.ts` is
imported in the blog layout (`src/pages/blog/[slug].astro`).

### Styling looks wrong

**Issue**: Dark theme not applying correctly.

**Solution**: Check that `global.css` includes `.markdown-document` styles.
Clear browser cache and rebuild:

```bash
npm run build
```

### Import path issues

**Issue**: Can't import MarkdownDocument component.

**Solution**: Use the correct relative path from your blog post location:

```mdx
# From: src/content/blog/my-post.mdx

import MarkdownDocument from '../../components/MarkdownDocument.astro';

;
```

## Accessibility Checklist

- ✅ Semantic HTML structure (`<div role="region">`)
- ✅ Proper heading hierarchy preserved
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support (Tab, Enter, Space)
- ✅ Screen reader announcements for copy actions
- ✅ High contrast text (WCAG AA: 4.5:1 minimum)
- ✅ Touch targets 44x44px minimum
- ✅ Focus indicators on all interactive elements

## Future Enhancements

Potential improvements for future versions:

- [ ] Line numbers for code blocks (optional)
- [ ] Collapsible sections
- [ ] Multiple theme variants (light/dark toggle)
- [ ] Language badges on code blocks
- [ ] Diff highlighting for code changes
- [ ] Export to PDF functionality

## Credits

- Inspired by Claude's artifact presentation style
- Built with Astro and Tailwind CSS
- Syntax highlighting powered by Shiki
- Developed for Andy Woods' personal blog

---

**Last Updated**: 2025-11-05 **Version**: 1.0.0
