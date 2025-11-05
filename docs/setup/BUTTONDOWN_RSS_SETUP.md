# Buttondown RSS Feed Setup - Detailed Walkthrough

**Detailed step-by-step guide for connecting your RSS feed and enabling
auto-send emails.**

---

## Step 4: Add RSS Feed to Buttondown (Detailed)

### 4.1: Navigate to Settings

1. **Log into Buttondown**: https://buttondown.email
2. **Look at the left sidebar** - you'll see several menu items
3. **Click on "Settings"** (it has a gear icon ⚙️)
4. You'll be taken to the Settings page

### 4.2: Find the Imports Section

1. **At the top of the Settings page**, you'll see several tabs:
   - Newsletter
   - Email
   - **Imports** ← Click this one
   - API
   - Billing
   - Advanced

2. **Click the "Imports" tab**

### 4.3: Locate the RSS Import Section

On the Imports page, you'll see different import options. Scroll down until you
find:

```
┌─────────────────────────────────────────┐
│  RSS                                     │
│  ────────────────────────────────────   │
│  Import posts from an RSS feed           │
│                                          │
│  [Text input field]                      │
│  Add RSS feed URL                        │
│                                          │
│  [+ Add RSS feed] button                 │
└─────────────────────────────────────────┘
```

### 4.4: Enter Your RSS Feed URL

1. **Click inside the text input field** that says "Add RSS feed URL"
2. **Type or paste**:
   ```
   https://andywoods.me/rss.xml
   ```
3. **Double-check** there are no extra spaces or typos
4. **Click the "+ Add RSS feed" button**

### 4.5: Verify RSS Feed Was Added

After clicking "Add RSS feed", you should see:

1. **A success message** appears (usually green): "RSS feed added successfully"
2. **Your feed appears in a list** below the input field:

```
┌─────────────────────────────────────────┐
│  Active RSS Feeds                        │
│  ────────────────────────────────────   │
│  https://andywoods.me/rss.xml           │
│  Last checked: Just now                  │
│  Status: ✓ Active                        │
│  Posts found: [number]                   │
│                                          │
│  [Settings] [Remove]                     │
└─────────────────────────────────────────┘
```

3. **Click "Settings"** next to your RSS feed to configure auto-send

---

## Step 5: Enable Auto-Send for New Posts (Detailed)

### 5.1: Open RSS Feed Settings

After clicking "Settings" on your RSS feed (from step 4.5), a modal or new
section opens showing RSS feed configuration options.

### 5.2: Configure Check Frequency

You'll see a section labeled **"Check Frequency"** or **"Polling Frequency"**:

```
┌─────────────────────────────────────────┐
│  Check Frequency                         │
│  ────────────────────────────────────   │
│  How often should Buttondown check       │
│  this RSS feed for new posts?            │
│                                          │
│  [Dropdown menu ▼]                       │
│                                          │
│  Options:                                │
│  • Every hour                            │
│  • Every 6 hours                         │
│  • Daily at 9:00 AM  ← Select this      │
│  • Daily at 5:00 PM                      │
│  • Weekly                                │
│  • Manual only                           │
└─────────────────────────────────────────┘
```

**What to do**:

1. **Click the dropdown menu**
2. **Select "Daily at 9:00 AM"** (or whichever time works best for you)
   - This means Buttondown checks your RSS feed every day at 9am
   - If there's a new post, it will send it to subscribers

**Why daily?**

- You probably don't post multiple times per day
- Daily checks are frequent enough without being wasteful
- 9am is a good time - people check email in the morning

### 5.3: Enable Auto-Send (This is the Critical Step!)

Scroll down to find the **"Auto-send new posts"** or **"Automatically send new
posts to subscribers"** option:

```
┌─────────────────────────────────────────┐
│  Auto-send Settings                      │
│  ────────────────────────────────────   │
│  □ Automatically send new posts to       │
│     subscribers                          │
│                                          │
│  When enabled, new posts from this RSS   │
│  feed will be sent to your subscribers   │
│  automatically.                          │
└─────────────────────────────────────────┘
```

**What to do**:

1. **Check the checkbox** ✅ next to "Automatically send new posts to
   subscribers"
2. The checkbox should turn blue/filled when enabled

### 5.4: Configure Email Template (Optional but Recommended)

Below the auto-send toggle, you may see template options:

```
┌─────────────────────────────────────────┐
│  Email Template for RSS Posts            │
│  ────────────────────────────────────   │
│  Subject line:                           │
│  [{{ post_title }}]                      │
│                                          │
│  Body:                                   │
│  [Text editor with default template]     │
│                                          │
│  Variables you can use:                  │
│  • {{ post_title }}                      │
│  • {{ post_content }}                    │
│  • {{ post_url }}                        │
│  • {{ post_date }}                       │
└─────────────────────────────────────────┘
```

**Recommended template**:

**Subject line**:

```
{{ post_title }}
```

**Body**:

```
{{ post_content }}

---

Read the full post: {{ post_url }}

You're receiving this because you subscribed to Andy Woods' newsletter.
[Unsubscribe]( {{ unsubscribe_url }} )
```

### 5.5: Save Your Settings

1. **Look for a "Save" or "Save Settings" button** at the bottom of the
   modal/section
2. **Click it**
3. **Look for confirmation**: You should see "Settings saved" or similar message

### 5.6: Verify Auto-Send is Working

Back on the main RSS settings page, you should now see:

```
┌─────────────────────────────────────────┐
│  https://andywoods.me/rss.xml           │
│  Last checked: 2 minutes ago             │
│  Status: ✓ Active                        │
│  Auto-send: ✓ Enabled  ← Verify this   │
│  Next check: Tomorrow at 9:00 AM         │
│                                          │
│  [Settings] [Check Now] [Remove]         │
└─────────────────────────────────────────┘
```

**Important indicators**:

- ✅ **Status: Active** - RSS feed is working
- ✅ **Auto-send: Enabled** - New posts will email automatically
- ✅ **Next check: [time]** - Shows when Buttondown will check again

---

## Testing the RSS Feed Immediately

Don't want to wait until 9am tomorrow? You can test it right now:

### Option 1: Manual Check (Recommended)

1. **On the RSS feed settings page**, find the **"Check Now"** button
2. **Click it**
3. **Watch what happens**:

   ```
   Checking feed... ⏳
   Found 3 new posts ✓
   ```

4. **Check the "Emails" tab** in Buttondown:
   - You should see draft emails for recent blog posts
   - If auto-send is enabled, they'll send immediately OR
   - You can send them manually as a test

### Option 2: Publish a New Post (Full Test)

1. **Create a new blog post** on your site (or update an existing one)
2. **Deploy to production** so it appears in your RSS feed
3. **Go to Buttondown** → RSS Settings
4. **Click "Check Now"**
5. **Within a few seconds**, Buttondown should:
   - Detect the new post
   - Create an email draft
   - Send it to all subscribers (if auto-send is on)

6. **Check your email** (if you're subscribed with a test email)
7. You should receive the new post!

---

## Common Issues and Solutions

### Issue 1: "Feed URL is invalid"

**Possible causes**:

- Typo in the URL
- RSS feed isn't accessible yet (site not deployed)
- RSS feed has errors

**Solution**:

1. Test your RSS feed first: https://andywoods.me/rss.xml
   - Open it in a browser
   - Should show XML with your blog posts
2. Validate the feed: https://validator.w3.org/feed/
   - Paste your RSS URL
   - Fix any errors shown
3. Make sure your site is deployed to production
4. Try adding the feed again in Buttondown

### Issue 2: "No posts found in feed"

**Possible causes**:

- RSS feed is empty
- Blog posts are marked as drafts
- RSS feed isn't regenerated yet

**Solution**:

1. Check RSS feed manually: https://andywoods.me/rss.xml
2. Verify you have published posts (not drafts)
3. Rebuild and redeploy your site:
   ```bash
   npm run build
   git push origin main
   ```
4. Wait 1-2 minutes for deployment
5. Try "Check Now" in Buttondown again

### Issue 3: Auto-send checkbox is grayed out

**Possible causes**:

- You need to verify your email first
- Free tier limitation (shouldn't be)
- Account setup incomplete

**Solution**:

1. Check your email for Buttondown verification link
2. Complete account setup in Buttondown
3. Try refreshing the page
4. Contact Buttondown support if still stuck

### Issue 4: RSS feed checks but doesn't send emails

**Checklist**:

- ✅ Auto-send checkbox is enabled
- ✅ You have at least 1 confirmed subscriber (even if it's just you)
- ✅ Email sending is not paused in Settings → Email
- ✅ The post is actually "new" (published after the last check)

**To verify**:

1. Go to Buttondown → "Emails" tab
2. Check "Drafts" section
3. You should see drafts for new posts
4. If drafts exist but didn't send, check email sending settings

---

## Understanding How It Works

### Daily Workflow (Automated)

```
9:00 AM Daily:
┌─────────────────────────────────────────┐
│ 1. Buttondown checks your RSS feed      │
│    https://andywoods.me/rss.xml         │
│                                          │
│ 2. Compares to last check                │
│    • No new posts? Do nothing ✓         │
│    • New post found? Continue to step 3  │
│                                          │
│ 3. Create email from new post            │
│    • Use template you configured         │
│    • {{ post_title }} → Email subject   │
│    • {{ post_content }} → Email body    │
│                                          │
│ 4. Send to all subscribers               │
│    • Only if auto-send is enabled ✅    │
│    • Otherwise save as draft             │
│                                          │
│ 5. Mark post as "sent"                   │
│    • Won't send again tomorrow           │
└─────────────────────────────────────────┘
```

### What Gets Sent?

When you publish a blog post:

1. **Your site builds** → Updates RSS feed
2. **RSS feed includes**:
   - Post title
   - Post excerpt/description
   - Post URL
   - Publication date
   - Author (Andy Woods)
   - Categories/tags

3. **Buttondown receives** this data during check
4. **Email created** with:
   - Subject: Your post title
   - Body: Your post content (from RSS)
   - Link: Back to your site
   - Footer: Unsubscribe link

---

## Pro Tips

### Tip 1: Test With Yourself First

1. Subscribe to your own newsletter with a personal email
2. Publish a test post
3. Verify you receive it
4. Check formatting, links, images
5. Then announce to the world!

### Tip 2: Send Time Matters

Consider when your audience reads email:

- **9am**: Good for professionals (check email at work)
- **5pm**: Good for evening readers
- **Avoid weekends**: Lower open rates

You can change this in RSS feed settings → Check Frequency.

### Tip 3: Preview Before Auto-Send

If you're nervous about auto-send:

1. **Disable auto-send** initially
2. Let Buttondown create **drafts** for new posts
3. **Review and edit** drafts in Buttondown dashboard
4. **Manually send** when ready
5. **Enable auto-send** once you're confident

### Tip 4: Monitor Your First Few Sends

After enabling auto-send:

1. **Check Buttondown → Emails** after each publish
2. **Verify emails were sent**
3. **Check your own inbox** to see how it looks
4. **Review open rates** after 24 hours
5. **Adjust template** if needed

---

## Quick Reference Card

**Print this out and keep it handy:**

```
═══════════════════════════════════════════
  BUTTONDOWN RSS SETUP CHECKLIST
═══════════════════════════════════════════

□ Log into Buttondown: buttondown.email
□ Go to Settings → Imports tab
□ Add RSS feed: https://andywoods.me/rss.xml
□ Click "+ Add RSS feed"
□ Click "Settings" next to your feed
□ Set check frequency: Daily at 9:00 AM
□ ✅ Enable "Auto-send new posts"
□ Save settings
□ Verify: Status = Active, Auto-send = Enabled
□ Test: Click "Check Now"
□ Verify: Check "Emails" tab for drafts/sent

TROUBLESHOOTING:
• Feed not found? Check: andywoods.me/rss.xml
• No posts? Verify blog posts aren't drafts
• Not sending? Check auto-send checkbox ✅
• Still stuck? support@buttondown.email

YOUR DETAILS:
Username: awoods187
Newsletter: buttondown.email/awoods187
RSS Feed: andywoods.me/rss.xml
═══════════════════════════════════════════
```

---

**Questions?** Check the main setup guide in `BUTTONDOWN_SETUP.md` or contact
Buttondown support at support@buttondown.email
