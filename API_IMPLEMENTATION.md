# API Endpoints for Admin Dashboard

The React admin dashboard (`src/pages/admin.jsx`) expects the following API endpoints. 

## Implementation Options

You have two choices:

### Option 1: Use Vercel Serverless Functions (Recommended for Vercel)

Create `/api/` folder in your Docusaurus root and implement these endpoints:

#### File: `/api/navbars.js`

```javascript
import fs from 'fs';
import path from 'path';

const navbarsDir = path.join(process.cwd(), 'data', 'navbars');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get all navbars
      const dirs = fs.readdirSync(navbarsDir).filter(name => {
        const fullPath = path.join(navbarsDir, name);
        return fs.statSync(fullPath).isDirectory();
      });

      const navbars = dirs
        .map(dir => {
          const metaPath = path.join(navbarsDir, dir, '_metadata.json');
          if (fs.existsSync(metaPath)) {
            const content = fs.readFileSync(metaPath, 'utf8');
            return JSON.parse(content);
          }
          return null;
        })
        .filter(Boolean)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      return res.status(200).json(navbars);
    } else if (req.method === 'POST') {
      // Create new navbar
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name required' });
      }

      const navbarId = name.toLowerCase().replace(/\s+/g, '-');
      const navbarPath = path.join(navbarsDir, navbarId);

      if (!fs.existsSync(navbarPath)) {
        fs.mkdirSync(navbarPath, { recursive: true });
      }

      const metadata = {
        id: navbarId,
        label: name,
        to: `/${navbarId}`,
        type: '',
        position: 'left',
        order: 0,
      };

      fs.writeFileSync(
        path.join(navbarPath, '_metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      return res.status(201).json(metadata);
    } else if (req.method === 'DELETE') {
      // Delete navbar - requires specific endpoint
      return res.status(405).json({ error: 'Use DELETE /api/navbars/[id]' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
```

#### File: `/api/navbars/[id].js`

```javascript
import fs from 'fs';
import path from 'path';

const navbarsDir = path.join(process.cwd(), 'data', 'navbars');

export default async function handler(req, res) {
  const { id } = req.query;
  const navbarPath = path.join(navbarsDir, id);

  try {
    if (req.method === 'DELETE') {
      // Delete entire navbar folder
      if (fs.existsSync(navbarPath)) {
        fs.rmSync(navbarPath, { recursive: true, force: true });
        return res.status(200).json({ success: true });
      }
      return res.status(404).json({ error: 'Navbar not found' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
```

#### File: `/api/navbars/[id]/pages.js`

```javascript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const navbarsDir = path.join(process.cwd(), 'data', 'navbars');

export default async function handler(req, res) {
  const { id } = req.query;
  const navbarPath = path.join(navbarsDir, id);

  try {
    if (req.method === 'GET') {
      // Get all pages in navbar
      if (!fs.existsSync(navbarPath)) {
        return res.status(404).json({ error: 'Navbar not found' });
      }

      const files = fs.readdirSync(navbarPath)
        .filter(f => f.endsWith('.md') && f !== 'README.md');

      const pages = files.map(file => {
        const filePath = path.join(navbarPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);
        
        return {
          id: file.replace('.md', ''),
          file: file,
          title: data.title || file,
          sidebar_position: data.sidebar_position || 0,
        };
      });

      pages.sort((a, b) => (a.sidebar_position || 0) - (b.sidebar_position || 0));
      return res.status(200).json(pages);

    } else if (req.method === 'POST') {
      // Create new page
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title required' });
      }

      const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.md';
      const filePath = path.join(navbarPath, fileName);

      const pageContent = `---
title: ${title}
sidebar_label: ${title}
sidebar_position: 1
---

# ${title}

Your content here...
`;

      fs.writeFileSync(filePath, pageContent);

      return res.status(201).json({
        id: fileName.replace('.md', ''),
        file: fileName,
        title: title,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
```

#### File: `/api/navbars/[id]/pages/[pageId].js`

```javascript
import fs from 'fs';
import path from 'path';

const navbarsDir = path.join(process.cwd(), 'data', 'navbars');

export default async function handler(req, res) {
  const { id, pageId } = req.query;
  const pagePath = path.join(navbarsDir, id, pageId + '.md');

  try {
    if (req.method === 'DELETE') {
      if (fs.existsSync(pagePath)) {
        fs.unlinkSync(pagePath);
        return res.status(200).json({ success: true });
      }
      return res.status(404).json({ error: 'Page not found' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
```

### Option 2: Disable Dashboard Temporarily

If you don't want to implement the API yet, you can hide the dashboard link and just use Decap CMS:

Edit `/static/admin/index.html` and comment out this line:
```html
<!-- <button class="nav-link" onclick="switchView('dashboard')">
  📊 Dashboard
</button> -->
```

Users will go directly to the CMS editor.

## Important Notes

### Dependencies

If using Option 1, you'll need:

```bash
npm install gray-matter
```

The `gray-matter` package is used to parse YAML frontmatter from markdown files.

### Docusaurus Configuration

Docusaurus uses Webpack/Babel which might conflict with API functions. For Vercel deployment, the `/api` folder should be at the root level and Vercel will automatically handle it as serverless functions.

### File Paths

Both the dashboard and CMS need to work with the same file structure:
- Navbars are folders in `data/navbars/`
- Each navbar has a `_metadata.json` file
- Pages are `.md` files in the navbar folder

## Testing Locally

```bash
# Start Docusaurus
npm run start

# In another terminal, test the API:
curl http://localhost:3000/api/navbars

# Create a navbar:
curl -X POST http://localhost:3000/api/navbars \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

## Vercel Deployment

1. Push your changes to GitHub
2. Vercel automatically detects `/api` folder
3. API functions are deployed as serverless functions
4. Dashboard will work immediately after deployment

## Alternative: Use Decap CMS Only

If you prefer not to implement the API, simply use the Decap CMS editor:
- Go to `/admin`
- Manage navbars under "Navbars (Sections)"
- Manage pages under "Navbar Pages"
- All CRUD operations work through the CMS interface

The dashboard is optional but provides a faster UI for common operations.
