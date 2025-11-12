# 🔧 Setup: GitHub API Integration for Navbar Creation

## Problem Solved

The navbar creation system now works on **Vercel serverless functions**, which have a read-only filesystem. We use the **GitHub API** to create files directly in your repository.

## What Changed

- ✅ API now uses GitHub API instead of local filesystem
- ✅ Works perfectly on Vercel without filesystem access
- ✅ Changes automatically commit to GitHub
- ✅ Vercel auto-rebuilds after commit
- ✅ New dependency: `@octokit/rest` (GitHub API client)

## Setup Instructions

### Step 1: Create GitHub Personal Access Token

1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Fill in:
   - **Note**: `Docusaurus Navbar API`
   - **Expiration**: 90 days (or no expiration if preferred)
4. Select scopes:
   - ✅ `repo` (full control of private repositories)
   - ✅ `workflow` (update GitHub Actions workflows)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Add to Vercel

1. Go to Vercel: https://vercel.com/dashboard
2. Select your project: `docusaurus-vercel`
3. Go to Settings → Environment Variables
4. Add these variables:

```
Name: GITHUB_TOKEN
Value: ghp_xxxx... (paste your token)
Environments: Production, Preview, Development
```

```
Name: GITHUB_OWNER
Value: HongTrieu04 (your GitHub username)
Environments: Production, Preview, Development
```

```
Name: GITHUB_REPO
Value: docusaurus-Vercel (your repo name)
Environments: Production, Preview, Development
```

5. Click "Save"

### Step 3: Install Dependency Locally

```bash
npm install @octokit/rest
```

Or let Vercel install it automatically when you deploy.

### Step 4: Test It

1. Commit changes to GitHub:
   ```bash
   git add -A
   git commit -m "feat: add GitHub API integration for navbar creation"
   git push
   ```

2. Wait for Vercel to rebuild (should take 1-2 minutes)

3. Go to your site and try `/admin`

4. Create a test navbar and it should work! ✅

## How It Works Now

### Old Way (Failed on Vercel)
```
Admin Form
    ↓
API tries to create folder
    ↓
❌ Error: filesystem is read-only on Vercel
```

### New Way (Works on Vercel)
```
Admin Form
    ↓
API uses GitHub API
    ↓
Creates files in GitHub directly
    ↓
GitHub commit created
    ↓
Vercel webhook triggered
    ↓
Vercel rebuilds and deploys
    ↓
✅ Success!
```

## Troubleshooting

### "GitHub credentials not configured"
**Problem**: Missing environment variables on Vercel

**Solution**:
1. Go to Vercel project settings
2. Add GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO
3. Redeploy: `git push` to trigger rebuild

### "Invalid token"
**Problem**: Token is invalid or expired

**Solution**:
1. Generate new token: https://github.com/settings/tokens
2. Update GITHUB_TOKEN in Vercel
3. Redeploy

### "Permission denied"
**Problem**: Token doesn't have necessary scopes

**Solution**:
1. Delete token: https://github.com/settings/tokens
2. Create new token with `repo` scope
3. Update GITHUB_TOKEN in Vercel

### "Navbar created but doesn't appear"
**Problem**: Vercel build didn't trigger or failed

**Solution**:
1. Check Vercel deployments page
2. Check build logs for errors
3. Verify sidebars.js was updated correctly
4. Manual trigger: `git push` empty commit: `git commit --allow-empty -m "trigger rebuild" && git push`

## Security Notes

### Token Permissions
- `repo` scope: Full control of repositories
- `workflow` scope: Update workflows (not needed but harmless)
- ⚠️ **Never share** your token
- ⚠️ **Never commit** your token to git

### Token Safety
- Token is stored securely in Vercel's encrypted storage
- Only sent from Vercel to GitHub API
- Never exposed to browser/client
- Automatically used by API endpoints

### Token Rotation
- Set expiration date (recommended: 90 days)
- Regularly rotate tokens
- Delete old tokens from GitHub settings

## What This API Can Do

With your token and GitHub API, the navbar system can:

✅ Create folders with metadata files
✅ Create markdown files
✅ Update sidebars.js config
✅ Commit changes with messages
✅ Delete folders and clean up
✅ List existing navbars
✅ Read navbar metadata

## What This API Cannot Do

❌ Access private repositories (unless explicitly allowed by token scope)
❌ Push to protected branches (GitHub branch rules still apply)
❌ Override GitHub Actions or security policies
❌ Access other users' repositories

## Environment Variables Reference

```javascript
// In /api/navbars.js, these are used:
process.env.GITHUB_TOKEN    // Personal access token
process.env.GITHUB_OWNER    // Repository owner (your username)
process.env.GITHUB_REPO     // Repository name
```

## Testing Locally

### Option 1: Without Token (Testing Admin UI)
```bash
npm start
# Admin UI works, but API will fail
# Good for testing UI only
```

### Option 2: With Token (Full Testing)
```bash
# Set environment variables
export GITHUB_TOKEN=ghp_xxxx...
export GITHUB_OWNER=HongTrieu04
export GITHUB_REPO=docusaurus-Vercel

npm start
# Full functionality
```

### Option 3: Using .env File
```bash
# Create .env.local file
echo "GITHUB_TOKEN=ghp_xxxx..." > .env.local
echo "GITHUB_OWNER=HongTrieu04" >> .env.local
echo "GITHUB_REPO=docusaurus-Vercel" >> .env.local

npm start
```

## Vercel Setup Summary

| Variable | Value | Purpose |
|----------|-------|---------|
| GITHUB_TOKEN | ghp_... (your token) | API authentication |
| GITHUB_OWNER | HongTrieu04 | Your GitHub username |
| GITHUB_REPO | docusaurus-Vercel | Your repository name |

All three **MUST** be set for the system to work.

## Next Steps

1. ✅ Create GitHub Personal Access Token
2. ✅ Add environment variables to Vercel
3. ✅ Run `npm install @octokit/rest`
4. ✅ Deploy: `git push`
5. ✅ Test: Create navbar in `/admin`
6. ✅ Done! 🎉

## Support

**Having issues?**

1. Check Vercel build logs:
   - Vercel Dashboard → Deployments → Click latest → View Logs
   
2. Check API errors:
   - Browser DevTools → Network tab → Click `/api/navbars` request
   - Look at Response tab for error message

3. Common issues:
   - Missing environment variables
   - Token expired or invalid
   - Repository name incorrect
   - Owner username incorrect

**Environment variables not working?**
1. Redeploy after changing env vars
2. Clear Vercel cache: Vercel Dashboard → Settings → Deployments
3. Trigger new build: `git push` or manual trigger in Vercel

## References

- GitHub Personal Access Tokens: https://github.com/settings/tokens
- Octokit Documentation: https://octokit.github.io/rest.js/
- Vercel Environment Variables: https://vercel.com/docs/projects/environment-variables
- GitHub API Docs: https://docs.github.com/en/rest

---

**Everything is now configured for GitHub API integration!** ✨
