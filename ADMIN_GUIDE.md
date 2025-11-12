# Admin Dashboard - Navbar Configuration Guide

## Overview

The admin page (`/admin-dashboard`) is a **separate configuration page** that helps you manage which folders appear as navbar items in your Docusaurus site.

It's like how you currently have:
- `/docs` folder → appears as "Tutorial" in navbar
- `/blog` folder → appears as "Blog" in navbar

The admin page lets you **plan and configure custom navbar items** similar to docs and blog.

## Overview

The admin system combines:
1. **Dynamic React Admin Page** (`/admin-dashboard`) - Quick management UI for navbars and pages
2. **Decap CMS Editor** (`/admin`) - Full-featured markdown editor for content
3. **Folder-based Navbar Structure** - Each navbar is a folder in `data/navbars/`

## Project Structure

```
data/
├── navbars/
│   ├── tutorial/                  # Navbar folder
│   │   ├── _metadata.json         # Navbar metadata (id, label, position, etc.)
│   │   ├── getting-started.md     # Page in this navbar
│   │   └── advanced-guide.md      # Another page
│   ├── guides/
│   │   ├── _metadata.json
│   │   └── first-guide.md
│   └── api/
│       ├── _metadata.json
│       └── reference.md
```

## Features

### 1. Manage Navbars
- **Add Navbar**: Create a new folder at `data/navbars/<navbar-id>/` with a `_metadata.json` file
- **Delete Navbar**: Remove the entire navbar folder and all its pages
- **Edit Navbar**: Update navbar metadata (label, position, order, links) via Decap CMS
- **Auto-update**: Changes are reflected on the site immediately after rebuild

### 2. Manage Pages
- **Add Page**: Create new `.md` files inside a navbar folder
- **Edit Page**: Edit markdown content and frontmatter in the Decap CMS Editor
- **Delete Page**: Remove `.md` files from the navbar folder
- **Organize**: Use sidebar_position in frontmatter to order pages

## Usage

### Access the Admin Interface

1. **Dashboard (Quick Management)**
   - Navigate to `/admin-dashboard`
   - View list of navbars
   - Quickly add/delete navbars and pages
   - Click "Edit" on any page to open the full editor

2. **CMS Editor (Full Content Editing)**
   - Navigate to `/admin`
   - Use the tab navigation to switch between Dashboard and Editor
   - Edit navbar metadata in the "Navbars (Sections)" collection
   - Edit pages in the "Navbar Pages" collection

### Creating a New Navbar

#### Using the Dashboard:
1. Go to `/admin-dashboard`
2. Click "Add Navbar"
3. Enter navbar name (e.g., "guides")
4. The system creates `data/navbars/guides/_metadata.json`

#### Using Decap CMS:
1. Go to `/admin`
2. Click "Navbars (Sections)" in the left sidebar
3. Click "New Navbars"
4. Fill in:
   - **ID**: Unique identifier (e.g., "guides") - this becomes the folder name
   - **Label**: Display name (e.g., "Guides")
   - **Type**: docSidebar, external, or empty
   - **To/Href**: Path or URL
   - **Position**: left or right on navbar
   - **Order**: Number for sorting (lower = earlier)

### Creating a Page in a Navbar

#### Using the Dashboard:
1. Go to `/admin-dashboard`
2. Select a navbar from the left
3. Click "Add Page"
4. Enter page title
5. The system creates a new `.md` file in that navbar's folder

#### Using Decap CMS:
1. Go to `/admin`
2. Click "Navbar Pages" in the left sidebar
3. Click "New Navbar Pages"
4. The file path will be: `data/navbars/<navbar-id>/<page-filename>.md`
5. Fill in:
   - **Page Title**: Display title
   - **Sidebar Label**: Short name for sidebar (optional)
   - **Sidebar Position**: Order in sidebar (optional)
   - **Content**: Markdown content with images, code blocks, etc.

### Editing Navbar Metadata

To change navbar settings (label, position, order, etc.):
1. Go to `/admin`
2. Click "Navbars (Sections)"
3. Find and click your navbar
4. Edit any field
5. Click "Publish" or "Save"

The changes are immediately reflected in `data/navbars/<id>/_metadata.json`.

### Editing Page Content

1. Go to `/admin`
2. Click "Navbar Pages"
3. Find your page (browse by folder path)
4. Edit the markdown and frontmatter
5. Click "Publish" or "Save"

## Technical Details

### Dynamic Navbar Loading

The `docusaurus.config.js` file includes a `loadNavbarItems()` function that:
1. Reads all folders in `data/navbars/`
2. For each folder, loads `_metadata.json`
3. Parses and sorts by `order` field
4. Adds them to the site navbar

This means:
- **Adding a navbar folder** → automatically appears on the navbar
- **Deleting a navbar folder** → automatically removed from navbar
- **Editing `_metadata.json`** → changes appear after rebuild

### Decap CMS Configuration

The `static/admin/config.yml` file defines:
- **navbars collection**: Manages `_metadata.json` files
- **navbar_pages collection**: Manages `.md` files in navbar folders
- **relation widget**: Links pages to their navbar (for reference)

### Frontend Display

Pages in navbars are displayed based on:
- `sidebar_position`: Order in sidebar
- `sidebar_label`: Custom display name (defaults to title)
- File structure: Nested folders create nested navigation

## Workflow Example

### Create a "API Documentation" section with 3 pages:

1. **Create navbar**
   - Go to `/admin-dashboard` → "Add Navbar"
   - Name: "api"
   - System creates: `data/navbars/api/`

2. **Configure navbar** (in `/admin` → "Navbars (Sections)")
   - ID: api
   - Label: "API Documentation"
   - Type: docSidebar
   - Sidebar ID: apiSidebar
   - Position: left
   - Order: 2

3. **Add pages** (in `/admin-dashboard`)
   - Add page: "Getting Started"
   - Add page: "Reference"
   - Add page: "Examples"

4. **Edit page content** (in `/admin` → "Navbar Pages")
   - Click each page to edit markdown
   - Add images, code blocks, links, etc.
   - Publish changes

5. **Result**
   - New navbar item "API Documentation" appears on the site
   - Three pages are accessible under the API section
   - All changes are version-controlled in git

## Environment Setup

To get this working on Vercel:

1. **GitHub Integration**: Decap CMS is already configured to use your GitHub repo
2. **Build Process**: Docusaurus rebuilds on every push
3. **Automatic Updates**: When you publish changes in CMS:
   - Files are committed to your GitHub repo
   - Vercel automatically rebuilds
   - Site updates with new content

## Common Tasks

### Hide a page temporarily
- Edit the page in Decap CMS
- Add to frontmatter: `hidden: true`
- Docusaurus will exclude it from sidebar

### Change page order in sidebar
- Edit page frontmatter: `sidebar_position: 1` (lower = earlier)

### Make a navbar external link
- Edit navbar in `/admin` → "Navbars (Sections)"
- Set Type: "external"
- Set Href: "https://example.com"

### Delete an entire navbar
- Delete the folder `data/navbars/<navbar-id>/`
- OR use `/admin-dashboard` → select navbar → click delete

## Troubleshooting

### Changes not showing on site
1. **Check**: Did you click "Publish" in Decap CMS?
2. **Check**: Did Vercel rebuild after the commit?
3. **Wait**: Rebuilds can take 2-3 minutes
4. **Rebuild**: Manually trigger Vercel rebuild in dashboard

### Page not appearing in navbar
1. **Check**: Is the `_metadata.json` valid JSON? (Use Decap CMS to edit)
2. **Check**: Does the folder have a valid `_metadata.json` file?
3. **Check**: Is the `sidebar_position` set correctly in page frontmatter?

### CMS not allowing me to save
1. **Check**: GitHub permissions - your account must be a collaborator
2. **Check**: GitHub App is properly configured
3. **Try**: Use command line git: `git add . && git commit -m "..." && git push`

## Next Steps

- Add more navbar sections as needed
- Customize navbar appearance in `docusaurus.config.js`
- Set up GitHub Actions for automated tests
- Invite team members as collaborators to edit content

---

For more info about Decap CMS, visit: https://decapcms.org/
For more about Docusaurus, visit: https://docusaurus.io/
