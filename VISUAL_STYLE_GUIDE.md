# Visual Style Guide

**Project**: Andy Woods Personal Website
**Style**: Vintage WPA National Parks Poster × Retro-Futurism
**Purpose**: Create cohesive, brand-consistent images for blog posts and marketing materials

---

## 🎨 Brand Visual Identity

This style guide ensures all generated images maintain a consistent aesthetic that communicates:
- **Established Expertise** - Vintage, trustworthy design language
- **Forward-Thinking Innovation** - Retro-futuristic subject matter
- **Technical Authority** - Clean, geometric precision

---

## 📐 Core Style Prompt

**Use this prompt template for ALL image generation:**

```
[SUBJECT DESCRIPTION] rendered in vintage 1930s-1940s WPA National Parks poster style,
retro-futuristic aesthetic, screen print illustration with 4-5 color limited palette
(burnt orange #CC5500, deep teal #2C5F5F, warm ochre #D4A76A, cream #FFF8E7, charcoal #2B2B2B),
bold geometric simplified forms, dramatic diagonal perspective, strong light/shadow contrast,
subtle halftone texture, vintage paper grain, optimistic mid-century futurism,
style of Joseph Binder and Charley Harper, layered depth with clear foreground/midground/background,
no text, leave bottom third compositionally clean for typography
```

---

## 🎨 Color Palette

**IMPORTANT**: Use these EXACT hex codes for consistency across all images.

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Burnt Orange** | `#CC5500` | Primary accent, highlights, sunsets |
| **Deep Teal** | `#2C5F5F` | Shadows, depth, water, sky |
| **Warm Ochre** | `#D4A76A` | Mid-tones, earth, warmth |
| **Cream** | `#FFF8E7` | Highlights, sky, paper base |
| **Charcoal** | `#2B2B2B` | Deep shadows, outlines, contrast |

### Color Palette Preview

```
🟠 #CC5500  🔵 #2C5F5F  🟡 #D4A76A  ⬜ #FFF8E7  ⬛ #2B2B2B
```

---

## 📏 Composition Guidelines

### Layout Requirements

1. **Layered Depth**
   - Clear foreground (bold, high contrast)
   - Defined midground (supporting elements)
   - Distinct background (atmospheric depth)

2. **Typography Space**
   - **Bottom third must remain compositionally clean**
   - Leave room for overlaid text/titles
   - Avoid busy patterns in lower portion

3. **Perspective**
   - Dramatic diagonal angles
   - Low horizon line (heroic feel)
   - Strong vanishing points

4. **Form Language**
   - Bold geometric shapes
   - Simplified, abstracted forms
   - No photorealistic detail

### Visual Effects

- ✅ Subtle halftone texture (screen print aesthetic)
- ✅ Vintage paper grain
- ✅ Strong light/shadow contrast
- ✅ Flat color blocks (limited palette)
- ❌ No gradients (except subtle transitions)
- ❌ No text or typography in generated image
- ❌ No photorealistic rendering

---

## 📝 Subject Templates

### AI & Machine Learning

#### Template 1: Neural Networks as Natural Landscapes
```
Neural network pathways forming majestic mountain ranges with data streams cascading
as geometric waterfalls
```

**Use for**: AI/ML blog posts, data science topics, neural network explainers

#### Template 2: AI as Sunrise
```
Artificial intelligence as an art deco sunrise over crystalline algorithm peaks
```

**Use for**: AI strategy posts, thought leadership, future of AI

---

### Databases & Data Infrastructure

#### Template 1: SQL as Canyon Architecture
```
SQL database architecture as layered canyon walls with data flowing through
geometric valleys
```

**Use for**: Database fundamentals, SQL tutorials, architecture posts

#### Template 2: Data Warehouse as Monument
```
Data warehouse as monumental cliff face with structured query patterns etched
like ancient formations
```

**Use for**: Data warehousing, analytics platforms, enterprise data

---

### Cloud & Enterprise Technology

#### Template 1: Cloud Infrastructure
```
Cloud infrastructure as stylized cumulus formations above server farm mountain ranges
```

**Use for**: Cloud architecture, infrastructure posts, DevOps topics

#### Template 2: Enterprise Networks
```
Enterprise network topology as interconnected plateau systems with data packet rivers
```

**Use for**: Enterprise software, system design, networking

---

### Innovation & Future Technology

#### Template 1: Quantum Computing
```
Quantum computing qubits as constellation patterns over technological mountain peaks
```

**Use for**: Emerging tech, quantum computing, advanced topics

#### Template 2: Blockchain & Distributed Systems
```
Blockchain ledgers as interlocking geological strata forming futuristic mesas
```

**Use for**: Distributed systems, blockchain, Web3 topics

---

## 🎯 Usage Instructions

### Step-by-Step Process

1. **Choose Subject Template**
   - Select from templates above
   - Or create custom using same metaphor pattern: `[Tech Concept] as [Natural Formation]`

2. **Copy Core Style Prompt**
   - Use the complete prompt verbatim
   - Replace `[SUBJECT DESCRIPTION]` with your chosen template

3. **Add Aspect Ratio**
   - **Portrait (Blog Hero)**: `--ar 3:4`
   - **Landscape (OG Image)**: `--ar 16:9`
   - **Square (Social)**: `--ar 1:1`

4. **Generate Image**
   - Use Midjourney, DALL-E, or similar AI image generator
   - Keep color palette HEX codes in prompt
   - Ensure "no text" and "clean bottom third" in prompt

### Example Complete Prompt

```
Neural network pathways forming majestic mountain ranges with data streams cascading
as geometric waterfalls rendered in vintage 1930s-1940s WPA National Parks poster style,
retro-futuristic aesthetic, screen print illustration with 4-5 color limited palette
(burnt orange #CC5500, deep teal #2C5F5F, warm ochre #D4A76A, cream #FFF8E7, charcoal #2B2B2B),
bold geometric simplified forms, dramatic diagonal perspective, strong light/shadow contrast,
subtle halftone texture, vintage paper grain, optimistic mid-century futurism,
style of Joseph Binder and Charley Harper, layered depth with clear foreground/midground/background,
no text, leave bottom third compositionally clean for typography --ar 3:4
```

---

## 🖼️ Image Specifications

### File Requirements

| Use Case | Dimensions | Aspect Ratio | Format | Max Size |
|----------|-----------|--------------|--------|----------|
| **Blog Hero Image** | 1200×1600px | 3:4 | JPG/PNG | 500KB |
| **OpenGraph (OG) Image** | 1200×630px | 16:9 | JPG/PNG | 300KB |
| **Social Media** | 1080×1080px | 1:1 | JPG/PNG | 400KB |
| **Thumbnail** | 600×800px | 3:4 | JPG | 200KB |

### Optimization

1. **After Generation**:
   - Export at highest quality
   - Resize to target dimensions
   - Optimize with TinyPNG or Squoosh
   - Save to `public/images/blog/` directory

2. **File Naming Convention**:
   ```
   [post-slug]-hero.jpg       # Main blog image
   [post-slug]-og.jpg         # OpenGraph image
   [post-slug]-thumb.jpg      # Thumbnail
   ```

3. **Example**:
   ```
   public/images/blog/
   ├── ai-database-integration-hero.jpg
   ├── ai-database-integration-og.jpg
   └── ai-database-integration-thumb.jpg
   ```

---

## 🎨 Custom Subject Creation

### Metaphor Framework

Follow this pattern to create new subjects:

```
[Technical Concept] as [Natural/Geological Formation] with [Data/Flow Element]
```

**Examples**:

✅ **Good**:
- "API endpoints as mountain trail networks with request flows as hiking paths"
- "Microservices architecture as archipelago islands with communication bridges"
- "Cache layers as sedimentary rock strata with data retrieval shafts"

❌ **Avoid**:
- Too literal: "Database servers in a data center"
- Too abstract: "Technology innovation concepts"
- Mixed metaphors: "Cloud networks as underwater coral reefs"

### Consistency Checklist

Before generating, verify:
- [ ] Uses natural/geological metaphor
- [ ] Includes exact color hex codes
- [ ] Specifies "no text"
- [ ] Requests "clean bottom third"
- [ ] Mentions "WPA National Parks poster style"
- [ ] References "Joseph Binder and Charley Harper"
- [ ] Includes aspect ratio flag

---

## 📚 Design References

### Historical Inspiration

**WPA National Parks Posters (1930s-1940s)**:
- Bold, flat color blocks
- Geometric simplification of nature
- Screen print aesthetic
- Optimistic, heroic perspective
- Limited color palettes (3-5 colors)

**Key Artists Referenced**:
- **Joseph Binder** - Austrian-American poster designer, geometric modernism
- **Charley Harper** - Wildlife artist, extreme geometric simplification
- **Doug Leen** - Modern WPA-style National Parks posters

### Modern Retro-Futurism

**Mid-Century Modern Elements**:
- Streamlined, aerodynamic forms
- Optimistic vision of technology
- Space-age aesthetics
- Atomic-age graphics

---

## 🎯 Brand Messaging Through Imagery

### What This Style Communicates

| Visual Element | Brand Message |
|----------------|---------------|
| **Vintage WPA Style** | "Established, trustworthy, timeless" |
| **Geometric Precision** | "Technical expertise, attention to detail" |
| **Natural Metaphors** | "Technology that feels organic and accessible" |
| **Retro-Futurism** | "Innovation rooted in proven principles" |
| **Limited Palette** | "Clarity, focus, professional restraint" |
| **Heroic Perspective** | "Ambitious vision, leadership" |

### Target Audience Perception

**Product Managers**: "Visionary yet practical"
**Engineers**: "Technically sound with design sensibility"
**Executives**: "Strategic thinker with creative approach"
**General Tech Community**: "Unique voice in crowded space"

---

## 📂 Asset Organization

### Directory Structure

```
public/images/
├── blog/                    # Blog post images
│   ├── [post-slug]-hero.jpg
│   ├── [post-slug]-og.jpg
│   └── [post-slug]-thumb.jpg
├── og-image.png            # Site-wide OpenGraph image
├── profile.jpg             # Profile photo
└── default-post.svg        # Fallback image
```

### Metadata Tracking

Keep a log of generated images:

```markdown
## Image Generation Log

### 2025-01-21: AI Database Integration
- **Subject**: Neural networks as mountain ranges
- **Aspect Ratio**: 3:4
- **Generator**: Midjourney v6
- **File**: ai-database-integration-hero.jpg
- **Status**: Published

### 2025-01-21: Cloud Architecture Post
- **Subject**: Cloud infrastructure as cumulus formations
- **Aspect Ratio**: 16:9
- **Generator**: DALL-E 3
- **File**: cloud-architecture-og.jpg
- **Status**: Published
```

---

## 🚀 Quick Reference Card

### 30-Second Image Generation Checklist

```
□ Choose subject template (or create using metaphor framework)
□ Copy core style prompt
□ Replace [SUBJECT DESCRIPTION]
□ Verify color hex codes are included
□ Add aspect ratio: --ar 3:4 or --ar 16:9
□ Confirm "no text" in prompt
□ Generate image
□ Optimize & resize
□ Save to public/images/blog/
□ Update blog post frontmatter with image path
```

---

## 🎨 Alternative Styles (Future Expansion)

### If WPA Style Doesn't Fit

For certain topics, consider these alternative approaches while maintaining brand consistency:

**Technical Diagrams**:
- Isometric blueprint style
- Same color palette
- Clean, geometric forms

**Data Visualization**:
- Vintage infographic style
- 1960s information design
- Same limited color palette

**Note**: Always maintain the 5-color palette for brand consistency.

---

## 📊 Success Metrics

### Visual Brand Consistency KPIs

- **Color Palette Adherence**: 100% (all 5 colors present)
- **Style Recognition**: Viewer should identify brand in 3 seconds
- **Composition Clarity**: Bottom third always available for text
- **File Size**: < 500KB for blog heroes
- **Load Time**: < 2s for hero image on 3G

---

## 🔧 Troubleshooting

### Common Issues & Solutions

**Problem**: Generated image too busy in bottom third
- **Solution**: Re-prompt with emphasis on "clean bottom third" and "leave space for typography"

**Problem**: Colors don't match brand palette
- **Solution**: Ensure hex codes are in prompt, or adjust in post-processing

**Problem**: Too photorealistic
- **Solution**: Add "screen print illustration" and "bold geometric simplified forms" earlier in prompt

**Problem**: Image too dark/low contrast
- **Solution**: Emphasize "strong light/shadow contrast" and use cream (#FFF8E7) for highlights

**Problem**: Wrong aspect ratio delivered
- **Solution**: Verify `--ar` flag is at end of prompt, regenerate

---

## 📚 Additional Resources

### Design Tools

- **TinyPNG** - Image compression: https://tinypng.com
- **Squoosh** - Google's image optimizer: https://squoosh.app
- **Coolors** - Color palette verification: https://coolors.co

### AI Image Generators (Tested)

- **Midjourney v6** ⭐ Recommended - Best at style consistency
- **DALL-E 3** - Good backup, slightly less vintage feel
- **Stable Diffusion XL** - Open source alternative

### Historical Reference Collections

- **Library of Congress WPA Posters**: https://www.loc.gov/collections/works-progress-administration-posters/
- **Vintage National Parks Posters**: https://www.nps.gov/museum/exhibits/npgallery/
- **Joseph Binder Archive**: Search design archives for reference

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-21 | Initial style guide created |

---

## 📧 Questions or Suggestions?

For questions about this visual style guide or to suggest new subject templates:

- **GitHub Issues**: Open an issue in this repository
- **Contact**: Andy Woods via [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/) or [X](https://twitter.com/iamandywoods)

---

**Built with ❤️ for consistent, memorable visual branding**

*This style guide is part of the andy-website project. See `README.md` for full project documentation.*
