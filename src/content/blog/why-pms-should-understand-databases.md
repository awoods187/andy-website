---
title: 'Why Product Managers Should Understand Database Fundamentals'
date: 2024-10-10
excerpt:
  "Database architecture decisions have profound product implications. Here's
  what every PM should know about databases, even if they're not technical."
tags: ['product-management', 'databases', 'technical-pm']
draft: true
imageSource: 'AI-generated using Stable Diffusion'

# License Information
license: 'CC BY-NC 4.0'
copyright: '© 2024 Andy Woods'
attribution:
  'If you quote or translate this post, please provide attribution with a link
  back to the original at andywoods.me'
---

Most product managers treat databases as infrastructure—something the
engineering team worries about. But database decisions profoundly impact product
capabilities, user experience, and business outcomes.

After spending years working on a distributed database, I've seen firsthand how
database constraints shape what's possible in a product. Here's what every PM
should understand.

## Databases Determine What's Possible

Your database choice isn't just a technical decision—it's a product decision.

**Example:** Can you offer multi-region deployments? That depends on whether
your database supports active-active replication or just read replicas.

**Example:** Can you guarantee exactly-once processing of payments? That
requires transaction isolation levels your database may or may not provide.

**Example:** Can you offer real-time analytics dashboards? That depends on query
performance and indexing capabilities.

Understanding these constraints helps you:

- Set realistic product roadmaps
- Have informed conversations with engineering
- Identify when database limitations are blocking product value

## Key Concepts Every PM Should Know

You don't need to write SQL queries, but understanding these concepts will make
you a better PM:

### 1. Consistency vs. Availability

The CAP theorem states you can't have perfect consistency, availability, and
partition tolerance simultaneously. Real-world implications:

- **Strong consistency:** Users always see the latest data, but may experience
  downtime during network issues
- **Eventual consistency:** System stays available during failures, but users
  might see stale data temporarily

**PM Question:** Is it okay if a user briefly sees outdated information, or must
data always be current?

### 2. ACID Transactions

ACID guarantees ensure data integrity:

- **Atomicity:** Operations complete fully or not at all
- **Consistency:** Database rules are always enforced
- **Isolation:** Concurrent operations don't interfere
- **Durability:** Committed data survives crashes

**PM Question:** For your use case, what happens if a transaction partially
fails? (Think: payment processing, inventory management, user registration)

### 3. Read vs. Write Performance

Databases are optimized differently:

- **OLTP (Online Transaction Processing):** Fast writes, handles concurrent
  transactions (your app's primary database)
- **OLAP (Online Analytical Processing):** Fast complex queries, optimized for
  analytics (your data warehouse)

**PM Question:** Are you building a feature that writes constantly (chat app) or
reads constantly (analytics dashboard)?

### 4. Scalability Patterns

How databases scale impacts product capabilities:

- **Vertical scaling:** Bigger server, limited by hardware
- **Horizontal scaling:** More servers, but adds complexity
- **Sharding:** Split data across servers, but queries become harder

**PM Question:** Will your product need to scale to millions of users? What's
the growth curve?

## Real-World Product Implications

Let me share some examples from my experience:

### Multi-Tenancy Strategy

We had to decide: one database per customer, or shared database with tenant IDs?

**Product implications:**

- Dedicated databases → easier data isolation, higher cost
- Shared database → cost-efficient, but noisy neighbor problems

This wasn't just a tech decision—it affected our pricing model, security
posture, and ability to offer dedicated instances.

### Global Deployment

Customers wanted low-latency access worldwide. Our options:

**Product implications:**

- Read replicas → Fast reads everywhere, but writes go to primary region
- Multi-region active-active → Fast reads AND writes, but higher complexity and
  cost

Understanding database replication helped me position product tiers (Standard
vs. Enterprise) based on deployment topology.

### Data Export & Portability

Customers asked: "Can we export our data?"

Simple question, but the answer depended on:

- Can we efficiently query all tenant data?
- Can we export while the system is running?
- What format (SQL dump, CSV, API)?

Database architecture directly impacted our data portability story and
competitive positioning against vendors with data lock-in.

## How to Learn More

You don't need to become a DBA, but I recommend:

1. **Take a databases course** - CS186 at Berkeley (free online) is excellent
2. **Read database architecture docs** - PostgreSQL, MySQL docs explain concepts
   clearly
3. **Sit with your engineers** - Ask them to explain your system's database
   architecture
4. **Learn basic SQL** - Even simple SELECT queries help you understand data
   structure

## The PM Superpower

Understanding databases gives you a superpower: you can bridge product and
engineering.

When engineering says "that's not possible," you can ask: "Is it a database
constraint or an implementation choice?" Sometimes it's the former (truly
constrained), but often it's the latter (solvable with different tradeoffs).

When customers request features, you can quickly assess feasibility before
putting engineering through a full design exercise.

When defining product strategy, you can anticipate technical constraints and
architect around them.

---

You don't need to be a database expert, but understanding fundamentals will make
you a more effective PM. Your engineering team will appreciate it, and your
product will be better for it.

What database concepts have you found most useful as a PM?
[Message me on X](https://twitter.com/iamandywoods) - I'd love to hear your
experiences.

---

## License

_This post is licensed under
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). You may quote
or translate with attribution. For commercial republishing, please contact me
via [LinkedIn](https://www.linkedin.com/in/andrewscottwoods/)._

_Hero images on this site are AI-generated using Stable Diffusion._
