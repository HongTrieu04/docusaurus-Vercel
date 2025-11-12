// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import path from 'path';
import fs from 'fs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Load navbar items from dynamically created navbar folders
 * Looks for folders at root level with navbar.json metadata files
 */
function loadDynamicNavbars() {
  const projectRoot = process.cwd();
  const navbarItems = [];
  
  // List of protected folders that shouldn't be treated as navbars
  const protectedFolders = ['docs', 'blog', 'src', 'static', 'node_modules', 'build', '.git', '.github'];
  
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

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
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
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'My Site',
        logo: { alt: 'My Site Logo', src: 'img/logo.svg' },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          // Dynamically loaded navbars from folder metadata
          ...loadDynamicNavbars(),
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
          {
            to: '/admin',
            label: '⚙️ Admin',
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
              {
                label: 'X',
                href: 'https://x.com/docusaurus',
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
