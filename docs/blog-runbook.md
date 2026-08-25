# Blog Runbook — Quick Reference

Short reference for common blog operations. Full architecture: [blog.md](./blog.md).

---

## Rotate AGENT_BLOG_TOKEN

If the token is compromised or needs rotation:

1. **Generate new token:**
   ```bash
   openssl rand -base64 32
   ```

2. **Update Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Update `AGENT_BLOG_TOKEN` in Production (and Preview if needed)
   - Redeploy is NOT required; env vars are read at runtime

3. **Update agent-hub:**
   - SSH into EC2
   - Update `.env` with the new token
   - Restart scheduler: `docker compose restart scheduler`

4. **Verify:**
   ```bash
   # From EC2, test the new token
   curl -X POST https://www.habibiahmada.dev/api/agent/blog \
     -H "Authorization: Bearer <new-token>" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","description":"Test description for validation","body_md":"## Test\n\nTest body","category":"web"}'
   ```

---

## Unpublish a Bad Post

To remove a post from the public site without deleting it:

1. **Via Supabase Dashboard:**
   - Go to Table Editor → `blog_posts`
   - Find the post by slug or title
   - Change `status` from `published` to `archived`

2. **Via API (admin):**
   ```bash
   # Requires admin session cookie
   curl -X PATCH https://www.habibiahmada.dev/api/admin/blog \
     -H "Content-Type: application/json" \
     -d '{"id":"<post-uuid>","status":"archived"}'
   ```

3. **Revalidate cache** (happens automatically after PATCH, but if needed):
   ```bash
   # Trigger revalidation by hitting any blog page
   curl -s https://www.habibiahmada.dev/blog > /dev/null
   ```

---

## Check Daily Quota

To see how many agent posts have been created today:

1. **Via Supabase Dashboard:**
   - Go to SQL Editor
   ```sql
   SELECT id, slug, title, created_at
   FROM blog_posts
   WHERE source = 'agent'
     AND created_at >= (NOW() AT TIME ZONE 'Asia/Jakarta')::date
     AND created_at < ((NOW() AT TIME ZONE 'Asia/Jakarta')::date + interval '1 day');
   ```

2. **Via API (will return 429 if quota used):**
   ```bash
   curl -s -o /dev/null -w "%{http_code}" \
     -X POST https://www.habibiahmada.dev/api/agent/blog \
     -H "Authorization: Bearer $AGENT_BLOG_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Quota check","description":"This is a test to check the daily quota status.","body_md":"## Test","category":"web"}'
   # Returns 429 if quota exceeded, 201 if available
   ```

---

## Check Agent-Hub Logs

On EC2:

```bash
# View scheduler logs
docker compose logs scheduler --tail 50

# Check portfolio_blog specific output
docker compose logs scheduler 2>&1 | grep -i "portfolio_blog\|BLOG_AGENT"

# Check last run result
cat /data/runs.json | jq '.[-1]'
```

---

## Emergency: Stop Agent Publishing

1. **Remove token from Vercel** (set to empty or remove env var)
2. **Or remove from agent-hub `.env`:**
   ```bash
   # Comment out AGENT_BLOG_TOKEN in .env
   # Restart scheduler
   docker compose restart scheduler
   ```

---

## Comment moderation (daily plan)

Comments require login and start as `pending` (see [blog-comments-adr.md](./blog-comments-adr.md)).

**Daily cadence (when posts are live):**

1. Open `/admin/blog` → pick a post → `/admin/blog/[id]`
2. Approve or reject each pending comment
3. Reject spam / excessive links without reply
4. If queue is empty, no action needed

API (admin session):

```bash
# List comments for a post
curl -s "https://www.habibiahmada.dev/api/admin/blog/<post-id>/comments"

# Approve
curl -X PATCH "https://www.habibiahmada.dev/api/admin/blog/<post-id>/comments" \
  -H "Content-Type: application/json" \
  -d '{"comment_id":"<id>","status":"approved"}'
```

---

## Create Storage bucket `blog-covers` (one-time)

1. Supabase Dashboard → Storage → New bucket
2. Name: `blog-covers`, **public**
3. Optional: file size limit 200 KB, MIME `image/webp`
4. Upload via `POST /api/admin/blog/upload` (admin session + multipart `file`)

---

## Verify Blog is Live

```bash
# Check blog list page
curl -s https://www.habibiahmada.dev/blog | grep -o '<title>[^<]*</title>'

# Check sitemap includes blog posts
curl -s https://www.habibiahmada.dev/sitemap.xml | grep "/blog/"

# Check robots.txt allows /blog
curl -s https://www.habibiahmada.dev/robots.txt | grep "blog"
```
