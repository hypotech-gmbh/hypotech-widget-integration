import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'hypo.tech widget',
  description: 'Developer documentation for the hypo.tech financing widget.',
  base: '/docs/',
  outDir: '../dist/docs',
  cleanUrls: true,
  lastUpdated: true,
  appearance: false,
  sitemap: {
    hostname: 'https://widgets.hypo.tech/docs/',
  },
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'color-scheme', content: 'light' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/docs/brand/hypotech-mark.svg' }],
  ],
  themeConfig: {
    logo: {
      src: '/brand/hypotech-logo.svg',
      alt: 'hypotech',
    },
    siteTitle: false,
    search: { provider: 'local' },
    nav: [
      { text: 'Quickstart', link: '/integration' },
      { text: 'API', link: '/messages' },
      { text: 'Examples', link: '/examples/helper-script/', target: '_self' },
      { text: 'GitHub', link: 'https://github.com/hypotech-gmbh/hypotech-widget-integration' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Quickstart', link: '/integration' },
          { text: 'Events', link: '/messages' },
          { text: 'Security', link: '/security' },
          { text: 'Go live', link: '/onboarding' },
          { text: 'Troubleshooting', link: '/troubleshooting' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hypotech-gmbh/hypotech-widget-integration' },
    ],
    editLink: {
      pattern: 'https://github.com/hypotech-gmbh/hypotech-widget-integration/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    lastUpdated: { text: 'Updated' },
    outline: { level: [2, 3] },
    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },
    footer: {
      message: 'Public integration contract · API v1',
      copyright: '© hypo.tech',
    },
  },
})
