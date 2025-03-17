import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Strapi Config Sync',
  tagline: "Documentation for the config-sync plugin for Strapi",
  favicon: 'img/favicon.jpg',

  plugins: [
    'docusaurus-plugin-sass',
  ],

  // Set the production url of your site here
  url: 'https://docs.pluginpal.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/config-sync/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'pluginpal', // Usually your GitHub org/user name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // themes: ['@docusaurus/theme-live-codeblock', '@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/pluginpal/strapi-plugin-config-sync/tree/master/docs',
          admonitions: {
            keywords: [
              // Admonitions defaults
              'note',
              'tip',
              'info',
              'caution',
              'danger',

              // Admonitions custom
              'callout',
              'prerequisites',
              'strapi',
              'warning',
            ],
          },
        },
        blog: false,
        sitemap:  {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.6,
          // ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const {defaultCreateSitemapItems, ...rest} = params;
            const items = await defaultCreateSitemapItems(rest);
            return items;
          },
        },
        theme: {
          customCss: './src/scss/__index.scss',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Strapi Config Sync',
      logo: {
        alt: 'Config Sync logo',
        src: 'img/logo.png',
      },
      items: [
        {
          href: 'https://github.com/pluginpal/strapi-plugin-config-sync',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.com/invite/strapi',
            },
            {
              label: 'Forum',
              href: 'https://forum.strapi.io/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website',
              href: 'https://www.pluginpal.io',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/pluginpal',
            },
          ],
        },
      ],
    },

    algolia: {
      appId: 'ADLP623G89',
      apiKey: '8f91ceaf54e8e8db14479fd79a420a8c',
      indexName: 'pluginpal',
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
