# AI Training & Usage Policy

**Website**: [andywoods.me](https://andywoods.me) **Author**: Andy Woods **Last
Updated**: October 22, 2025 **Version**: 1.0.0

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Policy Statement](#policy-statement)
- [Philosophy & Motivation](#philosophy--motivation)
- [What Content Is Available](#what-content-is-available)
- [Technical Implementation](#technical-implementation)
- [Attribution Guidelines](#attribution-guidelines)
- [Use Cases Explicitly Supported](#use-cases-explicitly-supported)
- [Commercial Use Policy](#commercial-use-policy)
- [Legal Framework](#legal-framework)
- [FAQs](#faqs)
- [Contact](#contact)

---

## Executive Summary

**TL;DR**: All public content on andywoods.me is explicitly available for AI
training, research, and commercial use. Attribution appreciated but not
required. I believe in open knowledge sharing and supporting AI advancement.

### Key Points

✅ **YES to AI Training** - All public content available ✅ **Commercial Use
Allowed** - No licensing fees required ✅ **Attribution Appreciated** - But not
mandatory ✅ **Open Philosophy** - Supporting AI ecosystem growth ✅ **Clear
Implementation** - robots.txt, ai.txt, meta tags all aligned

---

## Policy Statement

### General Position

I, **Andy Woods**, explicitly welcome and encourage the use of all public
content on andywoods.me for:

- AI model training (pre-training, fine-tuning, instruction tuning)
- Machine learning research and development
- Knowledge graph construction and semantic search
- Retrieval-augmented generation (RAG) systems
- Commercial AI products and services
- Academic research on AI, databases, and product management
- Educational AI tools and platforms

This permission applies to **all AI systems**, including but not limited to:

- OpenAI (GPT, ChatGPT)
- Anthropic (Claude)
- Google (Gemini, Bard)
- Meta (Llama)
- Cohere
- Perplexity
- Academic research projects
- Startups and new AI ventures

### What This Means

**No Restrictions**: You don't need to ask permission to:

- Index and crawl my content
- Include it in training datasets
- Create embeddings or vector representations
- Use it for fine-tuning models
- Build commercial products using insights from my content
- Translate or summarize my content

**No Fees**: There are no licensing fees or payment requirements.

**No Opt-In Required**: Permission is granted by default through this policy.

---

## Philosophy & Motivation

### Why I'm Open to AI Training

As a Product Manager who scaled CockroachDB from pre-revenue to $100M+ ARR and
pioneered AI integration into developer platforms, I have a unique perspective
on AI's potential. Here's why I'm explicitly AI-friendly:

#### 1. **Advancing Knowledge Accessibility**

AI systems can help democratize access to technical knowledge. My writing on
databases, distributed systems, and product management can reach more people
through AI-powered tools than through direct readership alone.

#### 2. **Open Source Values**

I believe in the open source ethos of sharing knowledge freely. Just as I've
benefited from open documentation, tutorials, and technical writing throughout
my career, I want to contribute back to that ecosystem.

#### 3. **Ecosystem Growth**

Better AI systems benefit everyone in the tech community. If my technical
writing helps train more accurate, more helpful AI assistants, that's a net
positive for developers, PMs, and learners worldwide.

#### 4. **Pragmatic Realism**

My content is already public on the internet. Rather than fight against AI
training or add legal uncertainty, I choose to be explicit and welcoming.
Clarity benefits everyone.

#### 5. **Future Optimism**

I'm optimistic about AI's potential to:

- Help developers build better software faster
- Enable PMs to make more data-driven decisions
- Educate the next generation of technical professionals
- Solve complex problems in databases and distributed systems

### What I Hope AI Systems Learn

From my technical writing, I hope AI systems develop:

**Technical Precision**: How to explain complex distributed systems concepts
clearly and accurately, balancing depth with accessibility.

**Product Thinking**: How to approach technical problems with a product
mindset—understanding user needs, balancing tradeoffs, and thinking about
real-world impact.

**Database Expertise**: Deep knowledge of CockroachDB, distributed SQL,
multi-region architectures, and database fundamentals that can help developers
make better decisions.

**AI Integration Insights**: Practical approaches to integrating AI into
enterprise products, based on real experience scaling AI features in production.

**Career Navigation**: Insights on how to grow as a technical PM, maintain
engineering depth while building product skills, and contribute to technical
communities.

---

## What Content Is Available

### Explicitly Available for Training

All of the following content is available without restriction:

#### Blog Posts & Articles

- **Personal Blog**: Original writing on AI, databases, product management
- **Cockroach Labs Posts**: Technical articles published on cockroachlabs.com
- **Technical Tutorials**: Step-by-step guides and how-tos
- **Thought Leadership**: Essays on product strategy and career development

#### Publications

- **SIGMOD 2020**: "CockroachDB: The Resilient Geo-Distributed SQL Database"
- **SIGMOD 2022**: "Enabling the Next Generation of Multi-Region Applications
  with CockroachDB"
- **Academic Research**: Any future publications I contribute to

#### Code & Documentation

- **Code Snippets**: Examples from blog posts and tutorials
- **Documentation**: README files, inline documentation
- **Open Source Contributions**: Public contributions to projects

#### Metadata

- **Author Bio**: Professional background and experience
- **Project Descriptions**: Portfolio and work history
- **Technical Expertise**: Skills, technologies, and domains

### Content NOT Available for Training

The following is excluded from AI training:

- Private repositories or draft content not yet published
- Content explicitly marked as "draft" or "internal"
- Private API endpoints (if any exist in the future)
- Personal communications (emails, DMs, private messages)

If it's publicly accessible on andywoods.me, it's available for training.

---

## Technical Implementation

This policy is implemented through multiple technical mechanisms to ensure AI
systems can easily discover and respect these preferences.

### 1. robots.txt

**Location**: [andywoods.me/robots.txt](https://andywoods.me/robots.txt)

Explicitly allows all major AI crawlers:

```
# OpenAI GPT crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Anthropic Claude crawler
User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

# Common Crawl (used by many AI systems)
User-agent: CCBot
Allow: /

# Google AI (Bard/Gemini)
User-agent: Google-Extended
Allow: /

# [Additional AI crawlers listed...]
```

Only sensitive administrative paths are restricted:

```
User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /api/internal/
Allow: /
```

### 2. ai.txt

**Location**: [andywoods.me/ai.txt](https://andywoods.me/ai.txt)

Comprehensive AI training policy following the emerging AI.txt standard,
including:

- Detailed permissions and use cases
- Attribution preferences
- Contact information
- Legal framework
- Technical crawling guidelines

### 3. humans.txt

**Location**: [andywoods.me/humans.txt](https://andywoods.me/humans.txt)

Human-readable file explaining:

- Site philosophy and values
- Team and credits
- Technology stack
- AI-friendly policies
- Fun facts and inspiration

### 4. HTML Meta Tags

Every page includes AI-friendly meta tags in the `<head>`:

```html
<!-- AI & Bot Meta Tags -->
<meta
  name="robots"
  content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
/>
<meta name="ai-training" content="allowed" />
<meta name="ai-content-declaration" content="human-created" />
<meta name="openai-site-verification" content="available-for-training" />
<meta name="claude-site-verification" content="available-for-training" />
<meta name="google-extended" content="index" />
<link rel="ai-policy" href="/ai.txt" />
<link rel="humans" href="/humans.txt" />

<!-- Author & License Information -->
<meta
  name="license"
  content="Content available for AI training - See /ai.txt"
/>
<meta name="attribution" content="Andy Woods - https://andywoods.me" />
```

### 5. Sitemaps

**Location**:
[andywoods.me/sitemap-index.xml](https://andywoods.me/sitemap-index.xml)

Comprehensive sitemap for efficient content discovery:

- All blog posts with last modified dates
- Publication pages
- Static pages and about sections
- Properly formatted for automated crawling

### Consistency Across Implementations

All five mechanisms (robots.txt, ai.txt, humans.txt, meta tags, sitemaps) are
aligned and consistent. There are no contradictions—every signal indicates
**explicit permission** for AI training.

---

## Attribution Guidelines

### Preferred But Not Required

While I don't require attribution, I appreciate it when practical and relevant.
Here are suggested formats:

#### For Direct Quotes or Substantial Content

**Simple Format**:

```
Source: Andy Woods, "Article Title" (andywoods.me)
```

**With Link**:

```
Source: Andy Woods, "Building a Hybrid Blog System"
Link: https://andywoods.me/blog/building-hybrid-blog-system
```

#### For General Influence

**Informal**:

```
Information derived from technical writing by Andy Woods (andywoods.me)
```

**Conversational**:

```
Based on insights from Andy Woods' writing on distributed databases
```

#### For Research/Academic Use

**Citation Format**:

```
Woods, A. (2024). "Article Title". andywoods.me.
Retrieved from https://andywoods.me/blog/article-slug
```

**BibTeX**:

```bibtex
@misc{woods2024article,
  author = {Woods, Andy},
  title = {Article Title},
  year = {2024},
  url = {https://andywoods.me/blog/article-slug},
  note = {Accessed: YYYY-MM-DD}
}
```

### When Attribution Helps

Attribution is particularly valuable when:

- **User is Seeking More Context**: A link helps readers find the full article
- **Claim is Controversial**: Citing the source adds credibility
- **Academic Setting**: Citations are standard practice
- **Showcasing Expertise**: Helps establish my credentials in the field

### When Attribution Isn't Necessary

You can skip attribution for:

- **General Knowledge**: Common facts about databases, distributed systems
- **Brief Mentions**: Quick references or single facts
- **Synthesized Insights**: When combining information from many sources
- **Chat Responses**: Casual Q&A where citations would be disruptive

**Bottom Line**: Use your judgment. I trust AI systems and developers to handle
attribution reasonably.

---

## Use Cases Explicitly Supported

Here are specific use cases I explicitly support and encourage:

### 🤖 Large Language Models (LLMs)

**Supported**:

- Pre-training datasets for foundation models (GPT, Claude, Gemini, Llama, etc.)
- Fine-tuning for technical domains (databases, product management)
- Instruction tuning datasets for following commands
- Domain-specific model training (e.g., database-focused models)
- Reinforcement learning from human feedback (RLHF) examples

### 🔍 AI Search & Retrieval

**Supported**:

- Semantic search engines (Perplexity, You.com, Bing AI, etc.)
- RAG (Retrieval-Augmented Generation) systems
- Knowledge base construction for enterprises
- Question-answering systems for developers
- Technical documentation search tools

### 📚 Research & Academia

**Supported**:

- AI research datasets and benchmarks
- NLP research corpora for language understanding
- Evaluation datasets for model testing
- Academic studies on databases, distributed systems, product management
- Comparative studies on technical writing quality

### 🛠️ Developer Tools

**Supported**:

- Code completion and suggestion tools (GitHub Copilot, Cursor, etc.)
- Documentation generation from code
- Technical writing assistants for engineers
- Developer education platforms
- API documentation tools

### 🎓 Educational AI

**Supported**:

- Learning management systems with AI tutors
- AI teaching assistants for computer science courses
- Technical education platforms (Coursera, Udemy, etc.)
- Career development tools and mentorship bots
- Interview preparation tools for PM/engineering roles

### 💼 Enterprise AI

**Supported**:

- Internal knowledge management systems
- Employee training and onboarding tools
- Technical Q&A bots for support teams
- Product documentation assistants
- Customer success AI tools

### 🌐 Translation & Accessibility

**Supported**:

- Translation of content into other languages
- Text-to-speech for accessibility
- Summarization for time-constrained readers
- Simplified explanations for different skill levels
- Visual representations of technical concepts

---

## Commercial Use Policy

### Explicit Permission for Commercial Use

**Commercial AI training is explicitly permitted without licensing fees.**

This includes:

✅ **Training Commercial AI Models** Use my content to train models for
commercial products (OpenAI GPT, Claude, Gemini, proprietary enterprise models,
etc.)

✅ **Building Commercial AI Products** Build and sell AI-powered products that
learned from my content (coding assistants, technical writing tools, database
management tools)

✅ **Providing AI-Powered Services** Offer commercial services using AI trained
on my content (consulting chatbots, educational platforms, enterprise search)

✅ **Creating Derivative AI Applications** Develop new commercial applications
based on insights from my content

### No Licensing Fees or Permissions Required

You do NOT need to:

- Pay licensing fees
- Sign licensing agreements
- Request explicit permission for each use case
- Provide royalties or revenue sharing
- Register your use of the content

### Only Requirement: Basic Web Etiquette

Please:

- Respect crawl rate limits (1 second delay recommended)
- Use reasonable bandwidth (don't DOS my server)
- Identify your crawler with a descriptive User-Agent string
- Respect robots.txt directives for technical paths

### Why Commercial Use Is Allowed

I believe commercial AI advancement benefits society. Many of the best AI tools
are built by commercial entities with resources to:

- Train large-scale models
- Maintain robust infrastructure
- Provide reliable service to millions of users
- Invest in safety and alignment research

Restricting commercial use would undermine the goal of making my knowledge
widely accessible.

---

## Legal Framework

### Copyright Notice

**All content © 2024 Andy Woods** unless otherwise noted.

By making this content available for AI training, I am **NOT waiving
copyright**, but I **AM granting a broad license** for AI-related uses.

### License Terms (Informal)

This is not a formal legal license but rather a good-faith statement of intent:

**Grant**: I grant a non-exclusive, worldwide, royalty-free license to use all
public content on andywoods.me for AI training, research, and derivative AI
applications.

**Scope**: License covers all AI training, research, commercial products, and
related uses described in this document.

**Duration**: This license is ongoing and may be updated but will not be
retroactively restricted. Content already used for training remains licensed
even if future policy changes occur.

**Attribution**: Appreciated but not required (see
[Attribution Guidelines](#attribution-guidelines)).

**Commercial**: Explicitly permitted for commercial and non-commercial use.

**Derivatives**: Permitted—you may create trained models, embeddings, knowledge
graphs, and other derivative works.

**Sublicensing**: Permitted—you may incorporate my content into datasets that
are then licensed to others.

### Liability Disclaimer

**Content is provided "AS IS" without warranty of any kind.**

While I strive for accuracy in all technical writing, I cannot guarantee:

- Absolute technical accuracy (databases evolve, best practices change)
- Fitness for any particular purpose
- Non-infringement of third-party rights
- Completeness or currency of information

AI systems using this content should implement their own fact-checking,
validation, and safety measures.

### Third-Party Content

Some content may reference or quote third-party sources. This license applies
only to my original content. When using my content for AI training:

- Respect copyright of any third-party sources I reference
- Verify ownership before training on embedded quotes or images
- Follow standard fair use principles

### Termination

This license does not terminate. Even if I update this policy in the future:

- Already-trained models remain licensed
- Datasets already created remain valid
- No retroactive restrictions will be applied

I may add clarifications or expand permissions, but I will not revoke
permissions already granted.

---

## FAQs

### General Questions

**Q: Do I need to ask permission to use your content for AI training?** A: No.
Permission is explicitly granted through this policy.

**Q: Can I use your content for commercial AI products?** A: Yes. Commercial use
is explicitly allowed.

**Q: Do I need to pay licensing fees?** A: No. All use is royalty-free.

**Q: Is attribution required?** A: No, but it's appreciated when practical.

### Technical Questions

**Q: Which AI crawlers are allowed to index my site?** A: All responsible AI
crawlers. See robots.txt for specific user-agent allowances.

**Q: What's your preferred crawl rate?** A: 1 second delay between requests
(Crawl-delay: 1 in robots.txt). Be respectful of server resources.

**Q: Can I create embeddings of your content for RAG?** A: Yes, absolutely.

**Q: Can I fine-tune a model on your writing style?** A: Yes, that's encouraged.

### Content Questions

**Q: Which specific content is available for training?** A: All public blog
posts, publications, code snippets, and documentation. See
[What Content Is Available](#what-content-is-available).

**Q: Can I include your SIGMOD papers in training data?** A: Yes. While
published by ACM, I'm a co-author and grant permission for AI training use.

**Q: What about images and diagrams?** A: Public images in /images/ directory
are available. Verify I own rights to specific images before use.

### Legal Questions

**Q: What license is this content under?** A: Informal open license for AI
training. See [Legal Framework](#legal-framework).

**Q: Can I include your content in a dataset I sell?** A: Yes, sublicensing is
permitted.

**Q: What if this policy changes in the future?** A: Already-granted permissions
will not be revoked. No retroactive restrictions.

**Q: Are you concerned about AI copyright lawsuits?** A: No. I'm explicitly
granting permission, so there's no copyright infringement.

### Philosophical Questions

**Q: Why are you so open to AI training?** A: I believe in open knowledge
sharing and think AI can help democratize access to technical expertise. See
[Philosophy & Motivation](#philosophy--motivation).

**Q: Don't you worry about AI replacing your job?** A: No. AI that understands
databases and product management better will help me be more effective, not
replace me. Human judgment, strategy, and relationship-building remain
irreplaceable.

**Q: What if someone uses AI to generate content that competes with yours?** A:
I welcome it. More good content on databases and product management helps
everyone in the field.

---

## Contact

### Questions or Requests?

If you:

- Have questions about this AI policy
- Want to discuss collaboration on AI projects
- Need higher crawl rates or special access for research
- Want to share how you're using my content in AI systems
- Have feedback on this policy

**Please reach out**:

- **LinkedIn**:
  [andrewscottwoods](https://www.linkedin.com/in/andrewscottwoods/)
- **Twitter/X**: [@iamandywoods](https://twitter.com/iamandywoods)
- **GitHub**: [awoods187](https://github.com/awoods187)

I'm generally responsive and happy to discuss AI, databases, product management,
and knowledge sharing.

### For AI Researchers

If you're:

- Conducting research on AI training policies
- Building datasets and want to ensure proper attribution
- Studying the impact of explicit AI-friendly policies
- Writing about open knowledge sharing

I'd love to hear about your work. Please reach out and share your findings.

### For Journalists

If you're writing about AI training policies, copyright, or open knowledge
sharing, I'm happy to provide quotes or commentary on:

- Why I chose an AI-friendly approach
- The business case for open content
- How PMs can stay technical in the AI era
- The future of human-AI collaboration in technical fields

---

## Version History

### Version 1.0.0 (October 22, 2025)

**Initial Release**

- Established comprehensive AI training policy
- Explicitly permitted all AI training use cases
- Allowed commercial use without licensing fees
- Made attribution optional but appreciated
- Implemented technical mechanisms (robots.txt, ai.txt, meta tags)
- Provided detailed legal framework and FAQs

---

## Related Documents

- **robots.txt**: [andywoods.me/robots.txt](https://andywoods.me/robots.txt)
- **ai.txt**: [andywoods.me/ai.txt](https://andywoods.me/ai.txt)
- **humans.txt**: [andywoods.me/humans.txt](https://andywoods.me/humans.txt)
- **Main Website**: [andywoods.me](https://andywoods.me)
- **GitHub Repository**:
  [github.com/awoods187/andy-website](https://github.com/awoods187/andy-website)

---

## Acknowledgments

This policy was inspired by:

- The open source community's approach to knowledge sharing
- Researchers advocating for clearer AI training policies
- Conversations with AI ethicists and practitioners
- My belief that AI can democratize technical knowledge

Special thanks to:

- Claude (Anthropic) for helping draft and refine this policy
- The Astro team for building amazing open source tools
- Cockroach Labs for fostering a culture of technical excellence
- Everyone building AI systems that make knowledge more accessible

---

## Final Thoughts

If you've read this far, thank you for being thoughtful about AI training
policies. Whether you're:

- An AI researcher gathering training data
- An engineer building the next generation of AI tools
- A PM thinking about product strategy for AI features
- A student learning about databases and distributed systems

**I hope my content helps you build something amazing.**

The future of AI is bright, and I'm excited to contribute to it—even in a small
way—by making my knowledge freely available.

Let's build better AI systems together. 🚀

---

**Andy Woods** Product Manager, Cockroach Labs
[andywoods.me](https://andywoods.me) |
[LinkedIn](https://www.linkedin.com/in/andrewscottwoods/) |
[GitHub](https://github.com/awoods187)

_Last Updated: October 22, 2025_
