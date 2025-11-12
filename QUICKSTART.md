# Quick Start Guide - Admin System

Get up and running with the new admin system in 5 minutes.

## 🚀 Step 1: What Was Added?

Your project now has:

1. **Dynamic Admin Dashboard** - Visual interface for managing navbars/pages
2. **Enhanced Decap CMS** - Full editor with navbar management
3. **Sample Navbar** - `data/navbars/tutorial/` for testing
4. **Documentation** - Complete guides for setup and usage

## 🔧 Step 2: Install Dependencies (if needed)

The dashboard and CMS should work out of the box. No new dependencies required!

However, if you implement the optional API endpoints, you'll need:

```bash
npm install gray-matter
```

## 📍 Step 3: Access the Admin Interface

### Development (Local Testing)

```bash
npm run start
# Then open browser to:
# - Dashboard: http://localhost:3000/admin-dashboard
# - CMS Editor: http://localhost:3000/admin
```

### Production (Vercel)

```
- Dashboard: https://your-site.com/admin-dashboard
- CMS Editor: https://your-site.com/admin
```

## ✍️ Step 4: Create Your First Navbar

### Option A: Using Dashboard (Fastest)

1. Go to `/admin-dashboard`
2. Click **"+ Add Navbar"**
3. Type navbar name (e.g., "guides")
4. Click **"Create"**
5. ✅ New navbar created!

### Option B: Using Decap CMS (More Control)

1. Go to `/admin`
2. Click **"Navbars (Sections)"** in left sidebar
3. Click **"New Navbars"**
4. Fill in:
   - **ID**: guides
   - **Label**: Guides
   - **Type**: docSidebar (or leave empty for custom links)
   - **Position**: left
   - **Order**: 0
5. Click **"Publish"**

## 📄 Step 5: Add Pages to Navbar

### Option A: Using Dashboard

1. Go to `/admin-dashboard`
2. Select your navbar from left sidebar
3. Click **"+ Add Page"**
4. Type page title
5. Click **"Create Page"**
6. ✅ Page created! Now edit it via the "Edit" button

### Option B: Using Decap CMS

1. Go to `/admin`
2. Click **"Navbar Pages"**
3. Click **"New Navbar Pages"**
4. Fill in:
   - **Page Title**: Your title
   - **Content**: Write markdown content
5. Click **"Publish"**

## ✏️ Step 6: Edit Content

### For Full Markdown Editing

1. Go to `/admin` (Decap CMS)
2. Click **"Navbar Pages"**
3. Find your page and click it
4. Edit markdown and frontmatter
5. Click **"Publish"**

### For Quick Edits

1. Go to `/admin-dashboard`
2. Find your page under the navbar
3. Click **"Edit"** button
4. You'll be taken to the CMS editor

## 📊 Step 7: Deploy

### To Vercel

```bash
git add .
git commit -m "Add admin dashboard and navbar management"
git push origin main
```

Vercel automatically:
- Detects changes
- Rebuilds your site
- Deploys new content
- ✅ Live in 2-3 minutes!

## 📁 File Structure Reference

After adding a navbar called "api" with pages "reference.md" and "examples.md":

```
data/navbars/
├── tutorial/
│   ├── _metadata.json          ← Navbar config
│   └── getting-started.md      ← Page content
└── api/
    ├── _metadata.json          ← Your new navbar
    ├── reference.md            ← Your page
    └── examples.md             ← Your page
```

## 🎯 Common Tasks

### Make a navbar point to docs
Edit navbar in `/admin`:
- **Type**: docSidebar
- **Sidebar ID**: tutorialSidebar (or your sidebar)
- **To**: /tutorial

### Hide a page temporarily
Edit page frontmatter:
```yaml
---
title: My Page
hidden: true
---
```

### Reorder pages in sidebar
Edit page frontmatter:
```yaml
---
title: My Page
sidebar_position: 1
---
```
(Lower numbers = higher in sidebar)

### Make navbar external link
Edit navbar in `/admin`:
- **Type**: external
- **Href**: https://example.com

### Delete everything and start fresh
```bash
rm -rf data/navbars/*
# Then create new navbars as needed
```

## 🆘 Troubleshooting

### Dashboard shows "Loading..." forever
- Check browser console for errors (F12)
- Make sure you're running `npm run start`
- Check if `/api/navbars` endpoint exists (optional)
- As fallback, use CMS editor instead

### Changes not showing on site
1. Did you click **"Publish"** in CMS?
2. Wait for Vercel rebuild (2-3 min)
3. Clear browser cache (Ctrl+Shift+Del)
4. Check GitHub for commits

### CMS login not working
- Make sure you're a collaborator on the GitHub repo
- Check GitHub app permissions
- Try logging out and back in

### Can't find my page in CMS
- Make sure file is in correct folder: `data/navbars/<navbar-id>/*.md`
- Use "Navbar Pages" collection, not "Docs"
- Refresh the page

## 📚 More Help

- **Full Guide**: See `/ADMIN_GUIDE.md`
- **API Setup**: See `/API_IMPLEMENTATION.md`
- **Decap CMS Docs**: https://decapcms.org/
- **Docusaurus Docs**: https://docusaurus.io/

## ✨ That's It!

You now have a complete no-code admin system! 🎉

- Share `/admin` link with team members
- They log in with GitHub account
- Everyone can edit without touching code
- Changes deploy automatically

Happy editing! 🚀
