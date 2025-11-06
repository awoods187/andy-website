# The Architect-Builder Pattern: Adding a Copy to Clipboard Feature

## Original Prompt

Add copy-to-clipboard functionality to all code blocks and formatted text boxes
on my personal blog.

Requirements:

**Target Elements:** Add copy buttons to all `<pre>`, `<code>`, and any elements
with class `.copyable` or `.snippet`

**Button Design:**

- Position: Top-right corner of each block
- Initial state: Small button with copy icon (SVG) or "Copy" text
- Hover state: Subtle background color change
- Click feedback: Change to checkmark icon or "Copied!" text for 2 seconds, then
  revert

**Styling Preferences:**

- Match existing blog theme colors (inspect current CSS variables/colors)
- Button should be subtle but discoverable (semi-transparent background)
- Smooth transitions for hover and click states
- Mobile-friendly (large enough touch target, at least 44x44px)

**JavaScript Implementation:**

- Use modern Clipboard API (`navigator.clipboard.writeText()`)
- Include fallback for older browsers
- Handle errors gracefully (show "Failed to copy" if needed)
- Preserve formatting and indentation when copying code
- Strip out line numbers if they exist

**Additional Features:**

- Only show button on hover for desktop (always visible on mobile)
- Keyboard accessible (can tab to button and activate with Enter/Space)
- Add appropriate ARIA labels for screen readers

Please scan my existing blog files to understand the current structure and
styling, then implement this feature in a way that integrates seamlessly. Create
any new files needed (e.g., copy-button.js, additional CSS) and update existing
files as necessary. Test the implementation across different code blocks on the
site.

## Phase 2: Refined Prompt

> **Meta-instruction given to AI:** Don't implement this prompt, instead refine
> it for my website architecture. Make sure it would apply to this blog, the
> previous one, and all new blogs.

[Copy and Paste the Prompt Above]

## Phase 3: Refined Prompt (Validated Against Codebase)

### Refined Prompt: Add Copy-to-Clipboard Functionality to Blog Code Blocks

#### Context

This is an Astro-based personal blog with the following architecture:

- **Framework**: Astro with TypeScript
- **Styling**: Tailwind CSS with custom prose styles in `src/styles/global.css`
- **Blog Template**: `src/pages/blog/[slug].astro` (renders markdown content via
  `<Content />` component)
- **Content**: Markdown files in `src/content/blog/` rendered with `.prose`
  wrapper
- **Layout**: `BaseLayout.astro` provides global structure
- **Color Scheme**: Minimalist black (#1a1a1a) on white with gray accents
  (#d1d5db, #e5e7eb, #f3f4f6)
- **Fonts**: Space Grotesk (sans) for headings/UI, Merriweather (serif) for body

#### Objective

Add copy-to-clipboard functionality to all code blocks that:

1. Works across all existing and future blog posts automatically
2. Matches the existing minimalist design aesthetic
3. Is accessible and mobile-friendly
4. Handles both inline `<code>` and block `<pre><code>` elements

#### Requirements

**Target Elements**

- **Primary**: All `<pre>` elements within `.prose` (markdown code blocks)
- **Note**: Inline `<code>` elements should NOT have copy buttons (too small,
  breaks flow)

**Button Design**

_Position & Visibility:_

- Top-right corner of each `<pre>` block
- Desktop: Show only on hover (`:hover` state on `<pre>`)
- Mobile: Always visible (touch devices can't hover)
- z-index to appear above code content

_Visual Design:_

- **Icon**: Use SVG copy icon (clipboard or document icon)
- **Size**: 32x32px container, 44x44px touch target (WCAG minimum)
- **Colors**:
  - Background: `rgba(0, 0, 0, 0.05)` default, `rgba(0, 0, 0, 0.1)` on hover
  - Icon: `#1a1a1a` (match text color)
  - Success state: Green checkmark or change to `#059669`
- **Border radius**: `0.25rem` (match existing code block style)
- **Transitions**: 200ms ease for opacity and background changes

_States:_

1. **Default**: Copy icon, semi-transparent
2. **Hover**: Slightly darker background
3. **Copied** (2 seconds): Checkmark icon + "Copied!" tooltip or text
4. **Error** (2 seconds): Error icon + "Failed" message

**Implementation Structure**

_File Organization:_

```
src/
├── components/
│   └── CopyCodeButton.astro      # Astro component for button HTML/CSS
├── scripts/
│   └── copy-code.ts               # TypeScript for copy logic
├── styles/
│   └── global.css                 # Add .prose pre styles here
└── pages/blog/
    └── [slug].astro               # Add script import here
```

**JavaScript Implementation**

_Core Functionality:_

```typescript
// src/scripts/copy-code.ts
- Use modern Clipboard API: navigator.clipboard.writeText()
- Fallback for older browsers: document.execCommand('copy')
- Error handling: Show "Failed to copy" if clipboard access denied
- Preserve code formatting: Use textContent (not innerHTML)
- Strip line numbers if present (check for `.line-number` class)
```

_Lifecycle:_

- Run on DOMContentLoaded
- Re-run on client-side navigation (Astro transitions if enabled)
- Use event delegation for performance (don't add listener per button)

**Styling Integration**

_CSS Structure (add to `global.css`):_

```css
/* Code block container positioning */
.prose pre {
  position: relative; /* Enable absolute positioning for button */
}

/* Copy button base styles */
.copy-code-button {
  /* Position, size, colors matching spec above */
  /* Opacity transitions */
  /* Mobile-specific styles via @media */
}

/* Desktop-only hover behavior */
@media (pointer: fine) {
  .copy-code-button {
    opacity: 0;
  }
  .prose pre:hover .copy-code-button {
    opacity: 1;
  }
}
```

**Accessibility**

_ARIA Labels:_

- `aria-label="Copy code to clipboard"`
- `aria-live="polite"` region for status announcements
- Update label to "Code copied!" after successful copy

_Keyboard Support:_

- Focusable via Tab key
- Activate with Enter or Space
- Visual focus indicator (outline matching site style)

_Screen Reader:_

- Announce copy success/failure
- Don't interfere with code reading

**Testing Checklist**

Test across:

1. **Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
2. **Code Block Types**:
   - Plain text (```plaintext)
   - Syntax highlighted (`python, `javascript, etc.)
   - Markdown blocks (```markdown)
   - Very long blocks (test scroll + button position)
   - Multiple blocks on same page
3. **Devices**:
   - Desktop (hover behavior)
   - Mobile (always visible)
   - Tablet (touch targets)
4. **Edge Cases**:
   - Empty code blocks
   - Code blocks with line numbers
   - Nested code structures
   - Clipboard permissions denied

#### Implementation Approach

**Phase 1: Core Functionality**

1. Create `copy-code.ts` with Clipboard API logic
2. Add minimal button HTML to each `<pre>` via JavaScript
3. Test basic copy functionality

**Phase 2: Styling & UX** 4. Add CSS to `global.css` for button appearance 5.
Implement hover states (desktop) and mobile visibility 6. Add success/error
feedback animations

**Phase 3: Accessibility & Polish** 7. Add ARIA labels and keyboard support 8.
Test with screen readers (VoiceOver, NVDA) 9. Cross-browser testing 10.
Performance optimization (event delegation)

#### Integration Points

_Where to add script import:_

```astro
// src/pages/blog/[slug].astro // ... existing imports

<BaseLayout title={post.data.title} description={post.data.excerpt}>
  <article>
    <!-- existing content -->
    <div class="prose prose-lg max-w-none mb-12">
      <Content />
    </div>
  </article>

  <!-- Add copy button script at end of layout -->
  <script>
    import '../scripts/copy-code.ts';
  </script>
</BaseLayout>
```

#### Success Criteria

✅ Copy button appears on all code blocks in all blog posts ✅ Clicking copies
exact code text (preserving formatting) ✅ Desktop: Button hidden until hover ✅
Mobile: Button always visible with proper touch target ✅ Visual feedback on
copy (checkmark/text change) ✅ Keyboard accessible (tab + enter/space) ✅
Screen reader announces copy action ✅ No impact on page load performance
(<50ms) ✅ Works in all major browsers ✅ Matches existing site aesthetic
(colors, fonts, spacing)

#### Out of Scope

❌ Copy buttons on inline `<code>` elements ❌ Syntax highlighting modifications
❌ Line numbering system ❌ Code execution/playground features ❌ Multiple
clipboard formats (HTML, RTF)

#### Design Principles to Follow

- **Minimalism**: Button should be discoverable but not distracting
- **Consistency**: Match existing prose styles and color palette
- **Progressive Enhancement**: Site works without JavaScript
- **Performance**: Use event delegation, avoid unnecessary DOM manipulation
- **Accessibility**: WCAG AA compliant minimum

---

**After implementation, verify the feature works on both:**

1. "The Architect-Builder Pattern" blog post (lots of code blocks)
2. "How I Built My Blog" post (fewer code blocks, different types)
