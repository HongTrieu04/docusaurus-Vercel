// @ts-check
// Import các module cần thiết
import {themes as prismThemes} from 'prism-react-renderer';
import path from 'path';
import fs from 'fs';

// --- HÀM TẢI NAVBAR TỪ CMS ---

/**
 * Tải các mục Navbar từ các file JSON metadata trong data/navbars.
 * File này chỉ chạy trong môi trường build (Node.js).
 */
function loadDynamicNavbars() {
  // Trỏ đến thư mục chứa các file metadata JSON do API/CMS tạo ra
  const navbarsDir = path.join(process.cwd(), 'data', 'navbars');

  if (!fs.existsSync(navbarsDir)) {
    // Nếu thư mục chưa tồn tại (ví dụ: lần build đầu tiên), trả về mảng rỗng
    return [];
  }

  const navbarItems = [];
  
  try {
    const entries = fs.readdirSync(navbarsDir);
    
    for (const fileName of entries) {
      if (fileName.endsWith('.json')) {
        const filePath = path.join(navbarsDir, fileName);
        
        try {
          const metadata = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          navbarItems.push(metadata);
        } catch (err) {
          console.warn(`Failed to parse navbar file ${fileName}:`, err instanceof Error ? err.message : String(err));
        }
      }
    }
  } catch (err) {
    console.warn('Failed to load dynamic navbars:', err instanceof Error ? err.message : String(err));
  }
  
  // Sắp xếp các mục theo trường 'order'
  return navbarItems.sort((a, b) => (a.order || 999) - (b.order || 999));
}

/** @type {import('@docusaurus/types').Config} */
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

  onBrokenLinks: 'throw',

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
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'My Site',
        logo: { alt: 'My Site Logo', src: 'img/logo.svg' },
        items: [
          // Các mục Docs/Blog MẶC ĐỊNH
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          
          // MỤC ĐỘNG TỪ CMS/API
          ...loadDynamicNavbars(),
          
          // Các mục Admin (Đã tách biệt)
          {
            to: '/navbar-manager', 
            label: '🛠️ Navbar Manager',
            position: 'right',
          },
          {
            href: '/admin/index.html',
            label: '⚙️ Decap CMS',
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
          // ... (cấu hình footer)
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