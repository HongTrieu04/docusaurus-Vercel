// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import fs from 'fs';
import path from 'path';

// Load navbar items from _metadata.json files in data/navbars/*/
// This enables the CMS to manage navbars as folders with pages inside.
function loadNavbarItems() {
  try {
    const dir = path.join(__dirname, 'data', 'navbars');
    if (!fs.existsSync(dir)) return null;

    const items = [];
    const subDirs = fs.readdirSync(dir).filter((name) => {
      const fullPath = path.join(dir, name);
      return fs.statSync(fullPath).isDirectory();
    });

    for (const subDir of subDirs) {
      const metadataPath = path.join(dir, subDir, '_metadata.json');
      if (fs.existsSync(metadataPath)) {
        try {
          const content = fs.readFileSync(metadataPath, 'utf8');
          const item = JSON.parse(content);
          items.push(item);
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn(`Failed to parse ${metadataPath}:`, errMsg);
        }
      }
    }

    // Sort by order (if present) then by folder name
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    return items;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn('Failed to load navbar items:', errMsg);
    return null;
  }
}

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

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
      navbar: (function () {
        const dynamicItems = loadNavbarItems();
        const fallback = {
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
            {
              href: 'https://github.com/facebook/docusaurus',
              label: 'GitHub',
              position: 'right',
            },
          ],
        };

        // If we can load navbar items from data files, use them; otherwise use the default fallback items.
        if (!dynamicItems || dynamicItems.length === 0) return fallback;

        // Build the final navbar object reusing title/logo from fallback but replacing items
        return {
          title: fallback.title,
          logo: fallback.logo,
          items: dynamicItems,
        };
      })(),
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
