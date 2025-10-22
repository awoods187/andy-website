# License

This repository uses a **dual licensing structure** to maximize code reusability while protecting original written content.

---

## Quick Summary

| What | License | Details |
|------|---------|---------|
| **Code & Technical Files** | MIT License | Use freely, even commercially. See [LICENSE-CODE.md](LICENSE-CODE.md) |
| **Blog Posts & Articles** | CC BY-NC 4.0 | Quote with attribution. Commercial republishing requires permission. See [LICENSE-CONTENT.md](LICENSE-CONTENT.md) |
| **Images & Media (by me)** | CC BY-NC 4.0 | Same as content. See [LICENSE-CONTENT.md](LICENSE-CONTENT.md) |
| **Third-Party Content** | Original Copyright | External posts and images retain their original copyright |

---

## Dual Licensing Explained

### 🔧 Code: MIT License

**All source code, build scripts, and configuration files** are licensed under the **MIT License**.

This includes:
- Astro components (`*.astro`)
- React components (`*.tsx`)
- TypeScript/JavaScript files (`*.ts`, `*.js`)
- CSS and styling files
- Build scripts (`scripts/*.py`)
- Configuration files (`*.config.*`, `package.json`, etc.)
- GitHub workflows and automation
- Data schemas and type definitions

**What this means**: You can use, modify, and redistribute the code for any purpose, including commercial projects, without asking permission.

**Full details**: [LICENSE-CODE.md](LICENSE-CODE.md)

---

### ✍️ Content: Creative Commons BY-NC 4.0

**All blog posts, articles, and original media** are licensed under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

This includes:
- Blog posts (`src/content/blog/*.md`)
- Articles and essays
- Tutorials and guides (written content, not code)
- About pages and biographical content
- Original images, diagrams, and media I created

**What this means**:
- ✅ You can quote with attribution
- ✅ You can translate with attribution
- ✅ You can share on social media with credit
- ✅ You can use in educational settings
- ⚠️ Commercial republishing requires written permission

**Full details**: [LICENSE-CONTENT.md](LICENSE-CONTENT.md)

---

### 🔗 Third-Party Content: Original Copyright

**External content linked or referenced on this site retains its original copyright.**

This includes:
- **Cockroach Labs blog posts** (linked, not republished) - © Cockroach Labs
- **SIGMOD publications** (linked to ACM Digital Library) - © ACM
- **Third-party images** - Original copyright holders
- **Quoted material** - Original authors

**What this means**: If you want to use content I wrote for Cockroach Labs or ACM publications, contact them for licensing. My license only covers content I created specifically for this website.

---

## Directory Structure Guide

Here's what license applies where:

```
andy-website/
├── src/
│   ├── components/          → MIT (code)
│   ├── layouts/             → MIT (code)
│   ├── pages/               → MIT (code)
│   ├── styles/              → MIT (code)
│   ├── data/                → MIT (schemas/structure), CC BY-NC 4.0 (content)
│   └── content/
│       └── blog/            → CC BY-NC 4.0 (written content)
│
├── scripts/                 → MIT (Python build scripts)
├── public/
│   ├── images/blog/         → CC BY-NC 4.0 (if created by me)
│   └── *.txt                → CC BY-NC 4.0 (policy documents)
│
├── *.config.*               → MIT (configuration)
├── package.json             → MIT (dependencies/scripts)
├── README*.md               → CC BY-NC 4.0 (explanatory content)
├── LICENSE*.md              → Public Domain (license text itself)
└── .github/                 → MIT (workflows/automation)
```

---

## Common Use Cases

### ✅ "I want to use your Astro components in my project"

**Answer**: Go ahead! The code is MIT licensed.

- No need to ask permission
- You can modify it freely
- Use it in commercial or personal projects
- Attribution appreciated but not required

See: [LICENSE-CODE.md](LICENSE-CODE.md)

---

### ✅ "I want to quote your blog post in my article"

**Answer**: Absolutely, with attribution!

- Include my name (Andy Woods)
- Link back to the original post
- Quote as much as is reasonable (1-2 paragraphs is fine)
- If your site is commercial, brief quotes are OK

See: [LICENSE-CONTENT.md](LICENSE-CONTENT.md)

---

### ✅ "I want to translate your blog post to Spanish"

**Answer**: Yes, with attribution!

- Provide attribution to me as the original author
- Link to the English version
- Indicate it's a translation
- Translations must be non-commercial (or contact me)

See: [LICENSE-CONTENT.md](LICENSE-CONTENT.md)

---

### ⚠️ "I want to republish your full blog post on my company blog"

**Answer**: Please contact me first.

- Brief quotes with attribution are fine
- Full republishing requires permission
- I'm generally permissive—just ask!

Contact: [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/)

See: [LICENSE-CONTENT.md](LICENSE-CONTENT.md) - Commercial Use section

---

### ✅ "I want to fork your repo and build my own blog"

**Answer**: Do it! The code is MIT licensed.

- Fork the repo
- Modify it for your needs
- Replace my content with yours
- Deploy it commercially if you want
- No need to ask permission

**Note**: Replace my blog posts (CC BY-NC 4.0) with your own content. The code structure itself is MIT and free to use.

See: [LICENSE-CODE.md](LICENSE-CODE.md)

---

### ✅ "I want to use your content to train an AI model"

**Answer**: Yes, explicitly permitted!

Despite the "NonCommercial" license on content, I **explicitly permit AI training**, including for commercial AI models.

See: [README-AI-POLICY.md](README-AI-POLICY.md) for full details.

---

### ❓ "I want to use a blog post you wrote for Cockroach Labs"

**Answer**: Contact Cockroach Labs.

- Posts on cockroachlabs.com are © Cockroach Labs
- My site only *links* to them, doesn't republish them
- For licensing those posts, contact Cockroach Labs directly

See: [LICENSE-CONTENT.md](LICENSE-CONTENT.md) - Third-Party Content section

---

## Attribution Guide

### For Code (Optional)

While MIT doesn't require attribution, if you want to credit me:

```markdown
This project uses components from Andy Woods' website:
https://github.com/awoods187/andy-website
Licensed under MIT.
```

### For Content (Required)

When quoting blog posts, use attribution like:

```markdown
As [Andy Woods](https://andywoods.me/blog/article-slug) explains:

> [Your quote]

*Source: "Article Title" by Andy Woods, licensed under CC BY-NC 4.0*
```

Or simpler:

```markdown
Source: Andy Woods, "Article Title" (andywoods.me)
```

---

## Contact for Questions

### Code Questions
- **GitHub Issues**: [Open an issue](https://github.com/awoods187/andy-website/issues)
- **General**: Just use it! MIT is permissive.

### Content Questions
- **Brief Quotes**: Just use them with attribution—no need to ask
- **Translations**: Go ahead with attribution (non-commercial)
- **Commercial Republishing**: Contact me via [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/)

### Third-Party Content Questions
- **Cockroach Labs Posts**: Contact Cockroach Labs
- **SIGMOD Papers**: Contact ACM
- **Other Images**: Check the original source

---

## Why Dual Licensing?

I chose this structure to:

1. **Maximize Code Reuse**: MIT license means developers can freely use and adapt the technical implementation
2. **Protect Content**: CC BY-NC 4.0 prevents commercial exploitation while allowing educational sharing
3. **Support Open Source**: Code contributions benefit the developer community
4. **Support AI Training**: Explicitly welcome AI systems to learn from both code and content
5. **Clarify Rights**: Clear, human-readable explanation of what's allowed
6. **Respect Third Parties**: Properly acknowledge external content isn't mine to license

---

## Contributing

### Contributing Code
- Code contributions are welcome!
- By contributing code, you agree to license it under MIT
- Submit pull requests with clear descriptions
- Follow existing code style and conventions

### Contributing Content
- Contact me first to discuss content contributions
- You retain copyright to your contribution
- You grant a CC BY-NC 4.0 license for publication
- We'll credit you as the author

---

## License Compatibility

### Can I combine this with my project?

**Code (MIT)**:
- ✅ Compatible with any license (GPL, Apache, proprietary, etc.)
- ✅ Can be used in closed-source commercial products
- ✅ Very permissive and compatible

**Content (CC BY-NC 4.0)**:
- ✅ Compatible with educational/non-commercial projects
- ✅ Can quote in commercial contexts with attribution
- ⚠️ Full republishing in commercial contexts requires permission
- ✅ Compatible with academic and research use

---

## Full License Texts

- **MIT License (Code)**: [LICENSE-CODE.md](LICENSE-CODE.md)
- **CC BY-NC 4.0 (Content)**: [LICENSE-CONTENT.md](LICENSE-CONTENT.md)
- **AI Training Policy**: [README-AI-POLICY.md](README-AI-POLICY.md)

---

## Special Notes

### AI Training Exception

While content is licensed CC BY-NC 4.0 (NonCommercial), I **explicitly grant permission** for AI training, including commercial AI models.

This means:
- ✅ Commercial AI companies can train on my content
- ✅ You can include my content in AI training datasets
- ✅ AI-generated outputs don't require attribution (though it's appreciated)

See [README-AI-POLICY.md](README-AI-POLICY.md) for complete details.

### External Content Clarification

My website **links to** external content (Cockroach Labs posts, SIGMOD papers) but does **not republish** it. Those links are provided for convenience and educational purposes. The linked content retains its original copyright.

---

## Updates to Licenses

- **Code License**: Will remain MIT (may not change to more restrictive)
- **Content License**: May be updated; existing uses under current license remain valid
- **No Retroactive Restrictions**: Already-granted permissions won't be revoked

---

## Copyright Notice

**Code**: © 2024-2025 Andy Woods. Licensed under MIT.

**Content**: © 2024-2025 Andy Woods. Licensed under CC BY-NC 4.0.

**Third-Party Content**: Retains original copyright. See individual sources.

---

**Last Updated**: October 22, 2025

For detailed questions about licensing, contact me via [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/).
