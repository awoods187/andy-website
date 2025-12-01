# Blog Post License Header Template

Use this template in the frontmatter of all new blog posts to clearly indicate
licensing.

---

## Template for Frontmatter

Add this to the frontmatter (YAML front matter) of your blog posts:

```yaml
---
title: 'Your Post Title'
date: 2025-10-22
excerpt: 'Brief summary of your post'
tags: ['ai', 'databases', 'product-management']
image: '/images/your-image.jpg'
draft: false

# License Information
license: 'CC BY-NC 4.0'
copyright: '© 2025 Andy Woods'
attribution:
  'If you quote or translate this post, please provide attribution with a link
  back to the original at andywoods.me'
---
```

---

## Field Descriptions

| Field         | Value                 | Purpose                                                                        |
| ------------- | --------------------- | ------------------------------------------------------------------------------ |
| `license`     | `"CC BY-NC 4.0"`      | Indicates Creative Commons Attribution-NonCommercial 4.0 International License |
| `copyright`   | `"© YYYY Andy Woods"` | Copyright notice (update YYYY to current year)                                 |
| `attribution` | Instruction text      | Tells readers how to properly attribute when quoting                           |

---

## Complete Example Blog Post

Here's a full example of a blog post with proper licensing:

```markdown
---
title: 'Building Resilient Distributed Systems'
date: 2025-10-22
excerpt:
  'A deep dive into designing systems that survive failures, with lessons from
  scaling CockroachDB to enterprise production.'
tags: ['databases', 'distributed-systems', 'reliability', 'architecture']
image: '/images/blog/distributed-systems.png'
draft: false

# License Information
license: 'CC BY-NC 4.0'
copyright: '© 2025 Andy Woods'
attribution:
  'If you quote or translate this post, please provide attribution with a link
  back to the original at andywoods.me'
---

# Building Resilient Distributed Systems

Distributed systems are notoriously difficult to build correctly. After helping
scale CockroachDB to handle mission-critical workloads at enterprises worldwide,
I've learned a few hard-won lessons...

[Your content here...]

---

## License

_This post is licensed under
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). You may quote
or translate with attribution. For commercial republishing, please contact me
via [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/)._
```

---

## Footer Template

Add this license footer at the end of every blog post:

```markdown
---

## License

_This post is licensed under
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). You may quote
or translate with attribution. For commercial republishing, please contact me
via [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/)._
```

---

## Why These License Fields?

### Frontmatter License Metadata

The frontmatter fields (`license`, `copyright`, `attribution`) serve multiple
purposes:

1. **Machine-Readable**: Can be parsed by scripts, AI crawlers, and content
   management systems
2. **Discoverable**: Shows up in metadata, making licensing clear to automated
   systems
3. **Type-Safe**: Can be validated by Astro's content collection schema (Zod)
4. **Programmatic**: Can be displayed automatically in post templates

### Footer License Notice

The footer serves human readers:

1. **Human-Readable**: Clear, plain-language explanation of rights
2. **Visible**: Appears at the end of every post
3. **Actionable**: Includes links to license and contact info
4. **Consistent**: Same format across all posts

---

## Updating Existing Blog Posts

To add licensing to existing posts:

1. **Add frontmatter fields** (license, copyright, attribution)
2. **Add footer** (license notice at bottom)
3. **Update year** in copyright to post's original publication year
4. **Verify** by building the site and checking the output

---

## Astro Content Collection Schema

To enforce these license fields, update your `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    draft: z.boolean().optional(),

    // License fields (optional but recommended)
    license: z.string().optional().default('CC BY-NC 4.0'),
    copyright: z.string().optional(),
    attribution: z.string().optional(),
  }),
});

export const collections = { blog };
```

---

## Displaying License in Post Template

To automatically display license information from frontmatter:

```astro
---
// In src/pages/blog/[slug].astro
const { Content, data } = await entry.render();
const { title, date, license, copyright, attribution } = data;
---

<article>
  <h1>{title}</h1>
  <time>{date}</time>

  <Content />

  {
    license && (
      <footer class="license-notice">
        <h2>License</h2>
        <p>
          This post is licensed under
          <a href="https://creativecommons.org/licenses/by-nc/4.0/">
            {license}
          </a>
          .{copyright && <span>{copyright}</span>}
        </p>
        {attribution && (
          <p>
            <em>{attribution}</em>
          </p>
        )}
        <p>
          For commercial republishing, please contact me via
          <a href="https://www.linkedin.com/in/andrewscottwoods/">LinkedIn</a>.
        </p>
      </footer>
    )
  }
</article>
```

---

## Common Questions

### Q: Do I need to add this to every post?

**A**: Yes, for clarity. While the repository LICENSE-CONTENT.md covers all
content, individual posts should have explicit licensing for:

- Clarity for readers
- Machine-readable metadata
- Syndication/republishing clarity
- SEO and discoverability

### Q: What year should I use in copyright?

**A**: Use the year the post was **originally published**, not the current year.
For example:

- Post published in 2024: `© 2024 Andy Woods`
- Post published in 2025: `© 2025 Andy Woods`

### Q: Can I use a different license for some posts?

**A**: Yes, but be explicit. If you want to use a different license (e.g., MIT
for a code-heavy tutorial), clearly state it in both frontmatter and footer.

### Q: What about posts written for other companies?

**A**: If you wrote a post for Cockroach Labs or another company:

- That post is **© Company Name**
- Do NOT add CC BY-NC 4.0 license to their posts
- Link to the original source and note their copyright

---

## Checklist for New Blog Posts

When creating a new blog post:

- [ ] Add `license: "CC BY-NC 4.0"` to frontmatter
- [ ] Add `copyright: "© YYYY Andy Woods"` with correct year
- [ ] Add `attribution` instruction to frontmatter
- [ ] Add license footer at end of post content
- [ ] Verify license links work (CC BY-NC 4.0 link, LinkedIn link)
- [ ] Build site and check that license displays correctly
- [ ] Commit and push changes

---

## Example Script to Add Licenses to All Posts

If you need to batch-add licenses to multiple existing posts:

```bash
# Python script to add license footers
python3 scripts/add_license_footers.py
```

(Create this script if needed to automate adding footers to existing posts)

---

**Last Updated**: October 22, 2025 **Maintained By**: Andy Woods

For questions about licensing, see:

- [LICENSE-CONTENT.md](../LICENSE-CONTENT.md) - Full content license
- [LICENSE.md](../LICENSE.md) - Dual licensing guide
- [README.md](../README.md) - Project documentation
