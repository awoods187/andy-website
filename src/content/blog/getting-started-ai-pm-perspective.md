---
title: "Getting Started with AI: A PM's Perspective"
date: 2024-10-01
excerpt: "Practical advice for product managers exploring AI features, based on building production AI systems with GPT-4 and Claude at scale."
tags: ["ai", "product-management", "llms"]
---

Every PM is being asked: "What's our AI strategy?" After spending the last year building production AI systems analyzing 10,000+ monthly signals, here's what I've learned about integrating AI into products.

## Start with the Problem, Not the Technology

The biggest mistake I see: starting with "we should use GPT-4" instead of "what problem are we solving?"

**Bad starting point:** "Let's add AI chat to our product."
**Good starting point:** "Our users spend 3 hours/week on [task]. Can AI reduce that?"

AI is a tool, not a strategy. The best AI features solve specific, high-value problems.

## My Mental Model for AI Products

I think about AI integration in three tiers:

### Tier 1: AI-Assisted Features
AI helps users do existing tasks faster. Examples:
- Autocomplete in emails (Gmail)
- Writing assistance (Grammarly)
- Code completion (GitHub Copilot)

**PM considerations:**
- Lowest risk, fastest to ship
- Doesn't change core workflow
- Easy to measure impact (time saved, adoption rate)

### Tier 2: AI-Augmented Workflows
AI enables new workflows or capabilities. Examples:
- Automated summaries (Slack, Notion)
- Smart recommendations (Spotify, Netflix)
- Conversational interfaces to data

**PM considerations:**
- Medium risk, changes how users work
- Requires user education
- Measure workflow adoption and satisfaction

### Tier 3: AI-First Products
AI is the core product differentiator. Examples:
- ChatGPT, Claude (conversational AI)
- Midjourney, DALL-E (generative images)
- Perplexity (AI search)

**PM considerations:**
- Highest risk, biggest potential impact
- Requires rethinking entire UX
- Success metrics are product-specific

Most established products should start at Tier 1 and work up.

## The AI Product Stack: What You Actually Need

Building production AI isn't just calling an API. Here's the stack:

### 1. The Model (LLM)
Options: OpenAI (GPT-4), Anthropic (Claude), Google (Gemini), Open source (Llama)

**PM decision factors:**
- Cost per request (varies 10-100x)
- Latency requirements (real-time vs. batch)
- Privacy/security constraints (cloud vs. on-prem)
- Model capabilities (reasoning, coding, multilingual)

I've shipped features using both GPT-4 and Claude. Both are excellent; choice depends on your specific use case and cost constraints.

### 2. Prompt Engineering
Your prompts are your product. Bad prompts = bad user experience.

**Key techniques:**
- **Few-shot learning:** Show examples of desired output
- **Chain-of-thought:** Ask the model to explain its reasoning
- **Structured outputs:** Use JSON schema to enforce format
- **Prompt templates:** Parameterize prompts for consistency

**PM tip:** Version control your prompts like code. A/B test prompt variations. Monitor quality constantly.

### 3. RAG (Retrieval-Augmented Generation)
LLMs don't know your proprietary data. RAG lets you inject relevant context.

**Architecture:**
1. User asks question
2. Search your data for relevant context
3. Pass context + question to LLM
4. LLM generates answer based on your data

**PM considerations:**
- Requires vector database (Pinecone, Weaviate, or pgvector)
- Chunking strategy affects quality
- Search relevance is critical (garbage in = garbage out)

### 4. Evaluation & Monitoring
AI outputs are non-deterministic. You need continuous quality monitoring.

**Metrics I track:**
- Response latency (p50, p95, p99)
- Cost per request
- User satisfaction (thumbs up/down)
- Task completion rate
- Error rate and types

**Pro tip:** Build a "golden test set" of known inputs/outputs. Run it on every prompt change to catch regressions.

## Lessons from Production

Here are hard-won lessons from shipping AI features:

### 1. Users Don't Trust "Magic"
Initially, we hid the AI complexity. Mistake. Users need to understand:
- What the AI is doing
- Where data comes from
- Why it made a recommendation

**Solution:** Show your work. Cite sources. Explain reasoning. Let users verify.

### 2. Hallucinations Are Real
LLMs confidently generate plausible-sounding nonsense. In production, this is unacceptable.

**Mitigations:**
- Use RAG to ground responses in facts
- Add confidence scores
- Enable human review for critical paths
- Make it easy to report issues

### 3. Prompt Engineering Is Product Work
Your engineering team can integrate APIs. But crafting prompts that deliver consistent, high-quality outputs? That's product work.

I've spent hours iterating on prompts, testing edge cases, and refining outputs. This isn't a "set it and forget it" task.

### 4. Cost Management Is Critical
At scale, AI costs add up fast. GPT-4 API calls can cost $0.01-0.10 per request. If you have 10,000 users making 10 requests/day, that's $10K-100K/month.

**Cost optimizations:**
- Use cheaper models for simple tasks (GPT-3.5 vs. GPT-4)
- Batch requests when possible
- Cache common responses
- Set rate limits
- Monitor cost per feature

## Getting Started: A Practical Roadmap

If you're exploring AI features, here's what I recommend:

### Week 1: Explore & Experiment
- Play with ChatGPT, Claude, and Gemini directly
- Identify 3-5 high-value use cases in your product
- Prototype prompts manually (no code yet)

### Week 2: Build a Proof of Concept
- Pick the highest-value use case
- Build a simple prototype (even a Slack bot works)
- Test with internal users
- Measure: Does this actually save time/add value?

### Week 3: Evaluate Feasibility
- Estimate cost at scale (users × requests/day × cost/request)
- Assess accuracy/quality (manual review of 100 responses)
- Identify edge cases and failure modes
- Decide: Build, refine, or pivot?

### Week 4+: Iterate & Ship
- Start with a small beta cohort
- Collect feedback obsessively
- Iterate on prompts and UX
- Monitor quality and cost
- Expand gradually

## The PM Role in AI Products

Your job isn't to become an ML engineer. It's to:

1. **Identify high-value problems** AI can solve
2. **Define success metrics** and quality thresholds
3. **Manage tradeoffs** between cost, latency, and quality
4. **Design UX** that builds trust and handles errors gracefully
5. **Monitor quality** and iterate based on user feedback

The best AI features feel simple to users but are sophisticated under the hood. That sophistication comes from product thinking, not just technical implementation.

## Final Thoughts

AI is a tool, not magic. The same PM fundamentals apply:
- Understand your users deeply
- Solve real problems
- Measure impact
- Iterate relentlessly

The difference is the solution space is expanding rapidly. Features that were impossible two years ago are now trivial. Stay curious, experiment often, and ship incrementally.

---

Building AI products? I'd love to hear about your experience. What's working? What's not? [Reach out on Twitter](https://twitter.com/iamandywoods) or [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/).
