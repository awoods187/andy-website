# Buttondown Setup Guide

Complete step-by-step instructions for setting up the blog subscription system with Buttondown.

**Your Buttondown Username**: `awoods187`
**Your RSS Feed URL**: `https://andywoods.me/rss.xml`
**Your Newsletter URL**: `https://buttondown.email/awoods187`

---

## Part 1: Create and Configure Buttondown Account

### Step 1: Sign Up for Buttondown

1. **Go to Buttondown**: https://buttondown.email
2. **Click "Get started for free"** in the top right
3. **Create your account**:
   - Enter your email address
   - Create a password
   - Verify your email address (check inbox for confirmation email)

### Step 2: Set Your Username

1. After email verification, you'll be prompted to **choose a username**
2. **Enter**: `awoods187`
3. This creates your newsletter URL: `https://buttondown.email/awoods187`
4. Click **"Continue"**

### Step 3: Basic Newsletter Settings

You'll be taken to the Buttondown dashboard. Let's configure the basics:

1. **Click "Settings"** in the left sidebar
2. **Navigate to "Newsletter"** tab
3. Fill in these details:
   ```
   Newsletter Name: Andy Woods - Product & AI Engineering
   Description: Building at the intersection of databases, AI, and product management
   Author: Andy Woods
   ```
4. **Click "Save"**

---

## Part 2: Connect Your RSS Feed

### Step 4: Import RSS Feed

1. **In Buttondown dashboard**, click **"Settings"** (left sidebar)
2. **Click "Imports"** tab at the top
3. **Find the "RSS" section**
4. **Enter your RSS feed URL**:
   ```
   https://andywoods.me/rss.xml
   ```
5. **Click "Import RSS feed"**

### Step 5: Configure RSS Import Settings

After importing, you'll see RSS import settings:

1. **Check Frequency**: Select **"Daily at 9:00 AM"**
   - This means Buttondown checks for new posts every day at 9am
2. **Enable "Auto-send new posts"** ✅
   - Toggle this ON so new posts automatically email subscribers
3. **Save Settings**

**What happens now**:
- Every day at 9am, Buttondown checks your RSS feed
- If there's a new post, it automatically sends an email to all subscribers
- You don't need to do anything manually!

---

## Part 3: Customize Email Template

### Step 6: Set Up Email Template

1. **In Settings**, click **"Email"** tab
2. **Scroll to "Email Template"** section
3. **Replace the default template** with this:

```
{{ email_body }}

---

**About this newsletter**

You're receiving this because you subscribed to Andy Woods' blog about AI, databases, and product management.

Not interested anymore? [Unsubscribe]( {{ unsubscribe_url }} )

Andy Woods
Director of Product Management, Cockroach Labs
https://andywoods.me
```

4. **Click "Save Template"**

**What this does**:
- `{{ email_body }}`: Your blog post content
- `{{ unsubscribe_url }}`: Automatic unsubscribe link (required by law)
- Footer adds context about who you are

### Step 7: Configure Email Sender

1. Still in **"Email"** settings tab
2. **Set "From Name"**: `Andy Woods`
3. **Set "From Email"**:
   - If you have a custom domain email, use `andy@andywoods.me`
   - Otherwise, use the Buttondown default: `awoods187@buttondown.email`
4. **Set "Reply-To Email"**: Your preferred contact email
5. **Click "Save"**

---

## Part 4: Test the Subscription System

### Step 8: Test Email Subscription

1. **Open your live site** at: https://andywoods.me/subscribe
2. **Enter a test email** (use a personal email you can check)
3. **Click "Subscribe"**
4. **Check your email inbox**:
   - You should receive a **confirmation email** from Buttondown
   - Click the confirmation link
5. **Verify you're subscribed**:
   - Go to Buttondown dashboard → "Subscribers"
   - You should see your test email listed

### Step 9: Test RSS-to-Email (Optional - requires publishing a post)

To fully test the automation:

1. **Publish a new blog post** (or update an existing one)
2. **Wait for the next RSS check** (9am daily, or trigger manually in Buttondown)
3. **To trigger manually**:
   - Go to Buttondown → Settings → Imports
   - Click "Check for new posts now"
4. **Check your email** - you should receive the new post

### Step 10: Test Unsubscribe

1. **Find the confirmation email** from Step 8
2. **Look for the unsubscribe link** at the bottom
3. **Click it** to test the unsubscribe flow
4. **Verify** you see an unsubscribe confirmation page
5. **In Buttondown dashboard**:
   - Go to "Subscribers"
   - Verify your test email is now marked as unsubscribed

---

## Part 5: Verify Integration on Your Site

### Step 11: Check All Subscription Touchpoints

Visit these pages on your deployed site and verify everything works:

1. **Subscribe Page**: https://andywoods.me/subscribe
   - ✅ Email form submits successfully
   - ✅ RSS links work
   - ✅ Feedly link works
   - ✅ Privacy details are visible

2. **Any Blog Post**: https://andywoods.me/blog/hybrid-blog-system-2025
   - ✅ Subscribe form appears at bottom
   - ✅ Form submits successfully
   - ✅ Privacy details expand correctly

3. **Header Navigation**:
   - ✅ "Subscribe" link appears in header
   - ✅ Clicking it goes to /subscribe page

4. **Footer**:
   - ✅ RSS icon appears next to social icons
   - ✅ Clicking it downloads/opens RSS feed

5. **RSS Feed**: https://andywoods.me/rss.xml
   - ✅ Opens in browser showing formatted feed
   - ✅ Contains all posts (personal + CRL + publications)
   - ✅ Each item has title, description, link, date

---

## Part 6: Optional Enhancements

### Step 12: Customize Confirmation Email (Optional)

1. **In Buttondown** → Settings → Email
2. **Find "Confirmation Email"** section
3. **Customize the message** subscribers see when they first sign up:

```
Hi there!

Thanks for subscribing to Andy Woods' newsletter. You'll get new posts about AI, databases, and product management delivered to your inbox.

Click below to confirm your subscription:

{{ confirmation_url }}

Best,
Andy
```

4. **Save**

### Step 13: Set Up Welcome Email (Optional)

Send a welcome email to new subscribers:

1. **In Buttondown** → Settings → Email
2. **Find "Welcome Email"** section
3. **Enable it** and write a welcome message:

```
Welcome to the newsletter!

I'm Andy Woods, Director of Product Management at Cockroach Labs. I write about:

- AI and LLM infrastructure
- Distributed databases and systems
- Product management lessons from scaling startups
- Hands-on explorations of new AI tools

You'll typically hear from me 1-2 times per week with new posts.

Recent popular posts:
- Building a Hybrid Blog System with AI
- Why PMs Should Understand Databases
- Getting Started with AI: A PM's Perspective

Feel free to reply to this email anytime—I read and respond to every message.

Andy
```

4. **Save**

### Step 14: Add Subscriber Count Widget (Optional)

Display subscriber count on your site:

1. **In Buttondown** → Settings → API
2. **Copy your API key**
3. This is for future use if you want to show "Join 500+ subscribers" on your site

---

## Troubleshooting

### "Email not sending after publishing post"

**Check**:
1. RSS feed is valid: Visit https://andywoods.me/rss.xml
2. In Buttondown → Settings → Imports:
   - Verify RSS URL is correct
   - Check "Last checked" timestamp
   - Manually trigger "Check for new posts now"
3. Check Buttondown → "Emails" tab to see send history

### "Subscribers not receiving confirmation emails"

**Check**:
1. Email isn't in spam folder
2. In Buttondown → Subscribers: Check if email is listed as "Unconfirmed"
3. Resend confirmation email manually from Buttondown dashboard

### "Subscribe form not working on site"

**Check**:
1. Username in `SubscribeForm.astro` matches: `awoods187`
2. Form action URL is: `https://buttondown.email/api/emails/embed-subscribe/awoods187`
3. Check browser console for errors (F12)
4. Test with different email address

### "RSS feed empty or missing posts"

**Check**:
1. Run `npm run build` locally to rebuild RSS feed
2. Deploy changes to production
3. Clear CDN cache (in Vercel dashboard)
4. Verify RSS feed source files:
   - `src/pages/rss.xml.ts` has all content sources
   - `src/data/crl-posts.ts` has posts
   - Personal posts in `src/content/blog/` are not drafts

---

## Success Metrics to Track

After launch, monitor these in Buttondown dashboard:

1. **Subscriber Growth**
   - Dashboard → Subscribers
   - Target: 5-10 new subscribers per month to start

2. **Email Open Rates**
   - Dashboard → Emails → Click any sent email
   - Target: 30-40% open rate (industry average)

3. **Click Rates**
   - How many people click through to read full posts
   - Target: 5-10% click-through rate

4. **Unsubscribe Rate**
   - Keep below 1% per email
   - If higher, review email frequency or content

5. **RSS Subscribers**
   - Buttondown shows RSS subscriber count
   - These are separate from email subscribers

---

## Quick Reference

**Your Buttondown Details**:
- Username: `awoods187`
- Newsletter URL: https://buttondown.email/awoods187
- API Embed URL: https://buttondown.email/api/emails/embed-subscribe/awoods187
- RSS Feed: https://andywoods.me/rss.xml

**Important Files**:
- Subscribe form: `src/components/SubscribeForm.astro`
- Subscribe page: `src/pages/subscribe.astro`
- RSS generator: `src/pages/rss.xml.ts`

**Buttondown Free Tier Limits**:
- Up to 100 subscribers: **Free**
- Unlimited emails
- Full analytics
- No Buttondown branding in emails

**When to Upgrade** (paid plans start at $9/month):
- Over 100 subscribers
- Want premium features (A/B testing, advanced analytics)
- Need to remove Buttondown branding from confirmation emails

---

## Next Steps After Setup

1. ✅ Complete all steps above
2. 📝 Write your first newsletter-only post (optional)
3. 📢 Announce newsletter on LinkedIn/Twitter
4. 📊 Monitor metrics in Buttondown dashboard
5. 🔄 Iterate based on subscriber feedback

---

**Need Help?**

- **Buttondown Support**: https://buttondown.email/help
- **Buttondown Documentation**: https://docs.buttondown.email
- **Your RSS Feed**: https://andywoods.me/rss.xml (validate at https://validator.w3.org/feed/)

**Contact**: If you run into issues, check the Troubleshooting section above or reach out to Buttondown support—they're very responsive!
