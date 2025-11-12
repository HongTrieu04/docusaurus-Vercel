// @ts-check
// Import các module cần thiết
import {themes as prismThemes} from 'prism-react-renderer';
import path from 'path';
import fs from 'fs';

// --- HÀM TẢI NAVBAR TỪ CMS ---

/**
 * Load navbar items from dynamically created navbar folders at project root.
 * Looks for folders with navbar.json metadata files.
 * This function runs at build time (Node.js environment).
 */
function loadDynamicNavbars() {
  const projectRoot = process.cwd();
  const navbarItems = [];
  
  // Protected folders that shouldn't be treated as navbars
  const protectedFolders = ['docs', 'blog', 'src', 'static', 'node_modules', 'build', '.git', '.github', 'data', 'api'];
  
  try {
    const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (protectedFolders.includes(entry.name)) continue;
      if (entry.name.startsWith('.')) continue; // Skip hidden folders
      
      const navbarMetadataPath = path.join(projectRoot, entry.name, 'navbar.json');
      
      // Check if this folder has navbar.json metadata
      if (fs.existsSync(navbarMetadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(navbarMetadataPath, 'utf-8'));
          navbarItems.push({
            type: metadata.type || 'docSidebar',
            sidebarId: metadata.sidebarId || entry.name,
            position: metadata.position || 'left',
            label: metadata.label,
            order: metadata.order || 999,
          });
        } catch (err) {
          console.warn(`Failed to parse navbar.json for ${entry.name}:`, err instanceof Error ? err.message : String(err));
        }
      }
    }
  } catch (err) {
    console.warn('Failed to load dynamic navbars:', err instanceof Error ? err.message : String(err));
  }
  
  return navbarItems.sort((a, b) => (a.order || 999) - (b.order || 999));
}

const config = {
  // ... (cấu hình cơ bản: title, tagline, favicon, url, baseUrl, v.v.)
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'facebook',
  projectName: 'docusaurus',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/HongTrieu04/docusaurus-Vercel/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/HongTrieu04/docusaurus-Vercel/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'My Site',
        logo: { alt: 'My Site Logo', src: 'img/logo.svg' },
        items: [
          // Standard Docs/Blog items
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          
          // Dynamically loaded navbars from GitHub API
          ...loadDynamicNavbars(),
          
          // Admin items
          {
            to: '/admin', 
            label: '⚙️ Admin',
            position: 'right',
          },
          {
            href: 'https://github.com/HongTrieu04/docusaurus-Vercel',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;