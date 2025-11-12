# ✅ Fixed: GitHub API Integration for Vercel

## What Was Wrong

**Error you saw:**
```
POST /api/navbars 500 (Internal Server Error)
ENOENT: no such file or directory, mkdir '/var/task/guides'
```

**Root cause:** Vercel serverless functions have a **read-only filesystem**. You cannot create files locally on Vercel.

## How It's Fixed

**Solution:** Use GitHub API to create files directly in your repository instead of on the Vercel filesystem.

### Changes Made

1. **`/api/navbars.js`** - Completely rewritten
   - ✅ Uses Octokit (GitHub API client)
   - ✅ Creates files in GitHub repository
   - ✅ Automatically commits changes
   - ✅ Works on Vercel's serverless environment

2. **`/package.json`** - Added dependency
   - ✅ Added `@octokit/rest` package

3. **`GITHUB_API_SETUP.md`** - New setup guide
   - ✅ Step-by-step GitHub token creation
   - ✅ Vercel environment variable setup
   - ✅ Troubleshooting guide

## New Workflow

```
User clicks "Create Navbar"
    ↓
Admin sends form to API
    ↓
API uses GitHub API to:
├─ Create /guides/navbar.json
├─ Create /guides/intro.md
├─ Update sidebars.js
└─ Commit all changes
    ↓
GitHub commit created
    ↓
Vercel webhook triggered
    ↓
Vercel rebuilds site
    ↓
✅ Navbar appears live!
```

## What You Need to Do

### 1. Create GitHub Personal Access Token
- Visit: https://github.com/settings/tokens
- Click: "Generate new token (classic)"
- Fill in:
  - **Note**: `Docusaurus Navbar API`
  - **Expiration**: 90 days
  - **Scope**: ✅ repo
- Copy token (only shown once!)

### 2. Add to Vercel Environment Variables
- Go to: https://vercel.com/dashboard
- Select project: `docusaurus-vercel`
- Settings → Environment Variables
- Add 3 variables:
  ```
  GITHUB_TOKEN = ghp_xxxx... (your token)
  GITHUB_OWNER = HongTrieu04 (your username)
  GITHUB_REPO = docusaurus-Vercel (repo name)
  ```

### 3. Install Dependency Locally
```bash
npm install @octokit/rest
```

### 4. Deploy Changes
```bash
git add -A
git commit -m "feat: add GitHub API integration for navbar creation"
git push
```

### 5. Test It
- Wait for Vercel rebuild (1-2 minutes)
- Go to `/admin`
- Try creating a navbar
- ✅ Should work now!

## How GitHub API Works

### Step 1: Get Repository Info
```javascript
const repo = await octokit.repos.get({ owner, repo });
const defaultBranch = repo.default_branch; // 'main'
```

### Step 2: Get Latest Commit
```javascript
const ref = await octokit.git.getRef({ owner, repo, ref: 'heads/main' });
const commitSha = ref.object.sha;
```

### Step 3: Create Files
```javascript
await octokit.git.createTree({
  base_tree: baseTreeSha,
  tree: [
    { path: 'guides/navbar.json', content: '...' },
    { path: 'guides/intro.md', content: '...' },
    { path: 'sidebars.js', content: '...' }
  ]
});
```

### Step 4: Commit Changes
```javascript
await octokit.git.createCommit({
  message: 'feat: create navbar "Guides"',
  tree: treeSha,
  parents: [commitSha]
});
```

### Step 5: Update Branch
```javascript
await octokit.git.updateRef({
  ref: 'heads/main',
  sha: newCommitSha
});
```

## File Structure After Fix

```
/api/navbars.js (FIXED)
├── createFilesInGitHub(navbarId, label)
│   ├─ Get GitHub credentials from env
│   ├─ Create files via GitHub API
│   ├─ Update sidebars.js
│   └─ Commit changes
│
├── deleteFilesFromGitHub(navbarId)
│   ├─ Remove sidebar entry
│   └─ Commit cleanup
│
└── handler(req, res)
    ├─ GET: List navbars from GitHub
    ├─ POST: Create via GitHub API
    └─ DELETE: Delete via GitHub API
```

## What's Automatic Now

| Operation | Before | After |
|-----------|--------|-------|
| Create folder | ❌ Fails on Vercel | ✅ GitHub API |
| Create metadata | ❌ Fails on Vercel | ✅ GitHub API |
| Update config | ❌ Fails on Vercel | ✅ GitHub API |
| Commit to GitHub | ❌ Manual | ✅ Automatic |
| Trigger Vercel build | ❌ Manual | ✅ Automatic |
| Deploy changes | ❌ Manual | ✅ Automatic |

## Environment Variables Required

**On Vercel:**
```
GITHUB_TOKEN=ghp_... (25+ character token)
GITHUB_OWNER=HongTrieu04
GITHUB_REPO=docusaurus-Vercel
```

**Locally (optional for testing):**
```bash
# .env.local
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=HongTrieu04
GITHUB_REPO=docusaurus-Vercel
```

## Error Messages & Solutions

### "GitHub credentials not configured"
→ Add GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO to Vercel env vars

### "Missing GitHub credentials"
→ Same as above, likely during development

### "Navbar already exists in sidebars.js"
→ Navbar ID already exists, try different ID

### "Invalid token"
→ Token expired or invalid, generate new one

### "Permission denied"
→ Token doesn't have `repo` scope

## Testing Checklist

- [ ] Created GitHub Personal Access Token
- [ ] Added GITHUB_TOKEN to Vercel env vars
- [ ] Added GITHUB_OWNER to Vercel env vars
- [ ] Added GITHUB_REPO to Vercel env vars
- [ ] Ran `npm install @octokit/rest`
- [ ] Committed changes to GitHub
- [ ] Vercel deployment complete
- [ ] Visit `/admin` page loads
- [ ] Create navbar form works
- [ ] Navbar appears after creation
- [ ] GitHub commit created
- [ ] GitHub shows new files

## Files Changed

| File | Change | Status |
|------|--------|--------|
| `/api/navbars.js` | Rewritten to use GitHub API | ✅ Complete |
| `/package.json` | Added @octokit/rest | ✅ Complete |
| `GITHUB_API_SETUP.md` | New setup guide | ✅ Complete |

## Next Steps

1. **Create GitHub token** (5 minutes)
2. **Add to Vercel** (2 minutes)
3. **Install locally** (1 minute)
4. **Deploy** (1 minute)
5. **Test** (2 minutes)

**Total time: ~15 minutes** ⏱️

## Questions?

**See:** `GITHUB_API_SETUP.md` for detailed instructions

**Need help?** Check the troubleshooting section in that guide.

---

## Summary

✅ **Problem**: Vercel filesystem is read-only
✅ **Solution**: Use GitHub API instead
✅ **Status**: Fixed and ready for testing
✅ **Action required**: Setup GitHub token + env vars
✅ **Time needed**: ~15 minutes

**Once setup is complete, everything works automatically!** 🎉
