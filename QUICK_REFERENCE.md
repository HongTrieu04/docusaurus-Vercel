# ⚡ Quick Reference Card

## URLs

| Purpose | URL |
|---------|-----|
| **Admin Dashboard** | `/admin-dashboard` |
| **CMS Editor** | `/admin` |
| **Main Site** | `/` |

---

## Navigation Commands

```bash
# Start development server
npm run start

# Build for production
npm run build

# View built site locally
npm run serve
```

---

## Create a Navbar

### Via Dashboard
1. Go to `/admin-dashboard`
2. Click **"+ Add Navbar"**
3. Enter name → **Create**

### Via CMS
1. Go to `/admin`
2. Click **"Navbars (Sections)"**
3. Click **"New Navbars"**
4. Fill form → **Publish**

---

## Create a Page

### Via Dashboard
1. Go to `/admin-dashboard`
2. Select navbar from left
3. Click **"+ Add Page"**
4. Enter title → **Create Page**

### Via CMS
1. Go to `/admin`
2. Click **"Navbar Pages"**
3. Click **"New Navbar Pages"**
4. Fill form → **Publish**

---

## File Locations

| Item | Path |
|------|------|
| **Navbars** | `data/navbars/` |
| **Navbar Config** | `data/navbars/<id>/_metadata.json` |
| **Pages** | `data/navbars/<id>/*.md` |
| **CMS Config** | `static/admin/config.yml` |
| **Dashboard** | `src/pages/admin.jsx` |
| **Site Config** | `docusaurus.config.js` |

---

## Navbar Metadata Fields

```json
{
  "id": "navbar-id",           // Unique ID (folder name)
  "label": "Display Name",     // What shows on navbar
  "to": "/path",               // Internal link
  "href": "https://...",       // External link
  "type": "docSidebar",        // Type: docSidebar, external, or empty
  "sidebarId": "sidebar-id",   // For docSidebar type
  "position": "left",          // left or right on navbar
  "order": 0                   // Sort order (lower = first)
}
```

---

## Page Frontmatter

```markdown
---
title: Page Title
sidebar_label: Short Name
sidebar_position: 1
hidden: false
---

# Your Content Here

Markdown content...
```

---

## Common Tasks

### Hide a page
Add to frontmatter:
```yaml
hidden: true
```

### Reorder pages
Set sidebar_position:
```yaml
sidebar_position: 1  # Lower = higher in sidebar
```

### Make external link
In navbar metadata:
```json
{
  "type": "external",
  "href": "https://example.com"
}
```

### Delete navbar
1. `/admin-dashboard` → Select navbar → Click delete ✕
2. OR delete folder `data/navbars/<id>/`

### Delete page
1. `/admin-dashboard` → Select navbar → Find page → Click delete
2. OR use CMS editor to delete file

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| **Developer Console** | F12 |
| **Refresh Page** | Ctrl+R or Cmd+R |
| **Clear Cache** | Ctrl+Shift+Del |
| **Find in Page** | Ctrl+F |

---

## Git Commands

```bash
# See changes
git status

# Stage changes
git add .

# Commit changes
git commit -m "Description"

# Push to GitHub (triggers Vercel build)
git push origin main

# View commit history
git log --oneline
```

---

## CMS Collections Reference

| Collection | Location | Edits |
|------------|----------|-------|
| **Navbars** | `data/navbars/*/_metadata.json` | Navbar config |
| **Navbar Pages** | `data/navbars/*/*.md` | Page content |
| **Docs** | `docs/` | Documentation |
| **Blog** | `blog/` | Blog posts |

---

## Error Troubleshooting

| Error | Fix |
|-------|-----|
| **Dashboard won't load** | Check browser console (F12) |
| **Changes not showing** | Wait for Vercel rebuild |
| **File not found** | Verify path: `data/navbars/` structure |
| **CMS won't save** | Check GitHub collaborator status |
| **Navbar not appearing** | Check `_metadata.json` is valid |

---

## Authentication

**Who can edit?**
- You (repo owner)
- GitHub collaborators on your repo

**How to add team member?**
1. GitHub → Repository → Settings → Collaborators
2. Add GitHub username
3. They can now access `/admin`

---

## Deployment Checklist

- [ ] Created navbar in `data/navbars/`
- [ ] Added `_metadata.json` to navbar folder
- [ ] Added `.md` pages to navbar folder
- [ ] Tested locally with `npm run start`
- [ ] Committed changes to git
- [ ] Pushed to GitHub
- [ ] Vercel rebuilt (check dashboard)
- [ ] Visit site to verify live

---

## Markdown Syntax

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://url.com)
![Image alt](image.png)

> Blockquote

```code block```

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

---

## YAML Syntax (for metadata)

```yaml
# Comments start with #
key: value
string: "text with spaces"
number: 42
boolean: true

list:
  - item1
  - item2

nested:
  key1: value1
  key2: value2
```

---

## Directory Structure

```
New navbar "api":
data/navbars/api/          ← Folder
├── _metadata.json         ← Config file
├── reference.md           ← Page 1
├── examples.md            ← Page 2
└── tutorial.md            ← Page 3
```

---

## Admin Tools

| Tool | URL | Purpose |
|------|-----|---------|
| **React Dashboard** | `/admin-dashboard` | Quick nav/page management |
| **Decap CMS** | `/admin` | Full markdown editor |
| **GitHub** | github.com | Repository management |
| **Vercel** | vercel.com | Deployment/builds |

---

## File Extension Reference

| Extension | Type | Editing |
|-----------|------|---------|
| `.json` | Configuration | CMS or code |
| `.md` | Content | CMS editor |
| `.yml/.yaml` | Config | Code editor |
| `.js/.jsx` | Code | Code editor |
| `.css` | Styles | Code editor |

---

## Performance Tips

- Keep markdown files under 10MB
- Optimize images (under 1MB)
- Use lazy loading for images
- Minimize dependencies

---

## Security Notes

- Only collaborators can edit via `/admin`
- All changes tracked in Git history
- GitHub OAuth handles authentication
- Vercel serves from CDN (cached)

---

## Support

**Quick help?** → `/QUICKSTART.md`
**Full guide?** → `/ADMIN_GUIDE.md`
**Architecture?** → `/VISUAL_GUIDE.md`
**API setup?** → `/API_IMPLEMENTATION.md`

---

## Useful Links

- 📖 Docusaurus Docs: https://docusaurus.io/
- 📖 Decap CMS Docs: https://decapcms.org/
- 📖 Markdown Guide: https://www.markdownguide.org/
- 🔗 Your Repo: https://github.com/HongTrieu04/docusaurus-Vercel

---

**Last Updated**: November 12, 2025
**Version**: 1.0
**Quick Tip**: Bookmark this page for quick reference!
