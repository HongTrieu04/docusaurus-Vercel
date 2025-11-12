# ⚡ Quick Start: Create Your First Navbar

## In 60 Seconds

### 1️⃣ Open Admin Dashboard
Visit: `http://localhost:3000/admin` (or your site URL + `/admin`)

### 2️⃣ Fill the Form
```
Folder ID:     guides
Display Label: Guides
Type:          docSidebar (default)
Position:      left (default)
Order:         0 (default)
```

### 3️⃣ Click "Create Navbar"
✨ **That's it!** The system automatically:
- Creates `/guides/` folder
- Adds `navbar.json` metadata
- Writes `intro.md` 
- Updates `sidebars.js`
- Commits to GitHub
- Redeploys on Vercel

### 4️⃣ See It Live
Refresh your site → "Guides" appears in navbar ✅

---

## What Gets Created

```
/guides/
├── navbar.json                    # Metadata file
│   {
│     "id": "guides",
│     "label": "Guides",
│     "type": "docSidebar",
│     "position": "left",
│     "order": 0
│   }
└── intro.md                       # Initial page
    # Guides
    Welcome to Guides!
```

---

## Add More Pages

### Option A: Edit via CMS
1. Go to `/admin` (Decap CMS)
2. Select your navbar from the sidebar
3. Create new documents
4. Publish

### Option B: Edit Files Directly
1. Add `.md` files to `/guides/`
   ```
   /guides/getting-started.md
   /guides/advanced-topics.md
   /guides/faq.md
   ```
2. Commit to GitHub
3. Done!

---

## Example Navbars You Could Create

**Documentation:**
- ID: `docs-advanced`
- Label: Advanced Docs

**API Reference:**
- ID: `api-reference`
- Label: API Reference

**Tutorials:**
- ID: `tutorials`
- Label: Tutorials

**Knowledge Base:**
- ID: `kb`
- Label: Knowledge Base

---

## Troubleshooting

### Navbar doesn't appear
1. Check `/guides/` folder exists
2. Hard refresh browser (Ctrl+Shift+R)
3. Check browser console for errors
4. Wait 2 minutes for Vercel rebuild

### Can't create navbar
1. **Folder ID is invalid:** Use lowercase only (letters, numbers, hyphens)
2. **Folder already exists:** Choose a different ID
3. **API error:** Check network tab in browser DevTools

### Pages don't show in sidebar
1. Add markdown files to `/guides/` folder
2. Make sure filenames are valid
3. Rebuild site: `npm run build`

---

## Valid Folder IDs

✅ **Good:**
- `guides`
- `api-docs`
- `my-guides`
- `documentation2`

❌ **Bad:**
- `Guides` (uppercase not allowed)
- `my_guides` (underscore not allowed)
- `my guides` (spaces not allowed)
- `docs` (reserved)
- `blog` (reserved)

---

## What's Automatic

You DON'T need to:
- ❌ Create folders manually
- ❌ Edit configuration files
- ❌ Commit to GitHub
- ❌ Update sidebars.js
- ❌ Rebuild site

**We handle all of it!** ✅

---

## Full Feature Set

### Create Navbars
- Click "Create Navbar" button
- Auto-creates folders
- Auto-creates metadata
- Auto-creates sidebar config

### Manage Navbars
- View all navbars in list
- Delete navbars (click trash icon)
- Auto-removes from sidebar

### Edit Content
- Use Decap CMS at `/admin`
- Add/edit/delete pages
- Publish live

### Deploy
- GitHub auto-commits
- Vercel auto-rebuilds
- Changes live immediately

---

## File Structure

After creating "guides" and "api-docs" navbars:

```
project-root/
├── docs/                          # Existing
├── blog/                          # Existing
├── guides/                        # New
│   ├── navbar.json
│   ├── intro.md
│   ├── getting-started.md        # You added
│   └── advanced-topics.md        # You added
├── api-docs/                      # New
│   ├── navbar.json
│   ├── intro.md
│   └── endpoints.md              # You added
├── src/
│   └── pages/
│       ├── admin.jsx              # Admin dashboard
│       └── admin.module.css
├── api/
│   └── navbars.js                 # Auto-creation API
├── docusaurus.config.js           # Loads navbars dynamically
├── sidebars.js                    # Updated automatically
└── ...
```

---

## Pro Tips

### 💡 Organizing Navbars

Keep related content together:
- `/guides/` for user guides
- `/api/` for API documentation
- `/tutorials/` for learning content
- `/reference/` for quick reference

### 💡 Sidebar Ordering

Control which pages appear first with `sidebar_position`:

```markdown
---
title: Getting Started
sidebar_position: 1
---
```

Lower numbers appear first!

### 💡 Categories

Create nested pages in `sidebars.js`:

```javascript
mynavbar: [
  'intro',
  {
    type: 'category',
    label: 'Basics',
    items: ['basics/page1', 'basics/page2'],
  },
]
```

### 💡 Dark Mode

Your navbar respects site theme automatically!

---

## Next Steps

1. ✅ Go to `/admin`
2. ✅ Create your first navbar
3. ✅ Add a page
4. ✅ Edit in Decap CMS
5. ✅ Watch it appear live

**That's all!** No configuration needed. 🎉

---

## Need Help?

**Can't find `/admin`?**
- Check navbar for "⚙️ Admin" button
- Or visit: `yoursite.com/admin`

**Getting an error?**
- Check browser console (F12)
- Check network tab for API errors
- Read error message carefully

**Want more details?**
- See `NAVBAR_CREATION_GUIDE.md`
- See `NAVBAR_IMPLEMENTATION.md`

**Have a feature request?**
- Open a GitHub issue
- Describe what you need

---

**Ready to create your first navbar? Go to `/admin` now!** 🚀
