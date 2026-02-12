const lightCodeTheme = require('./src/prism/light');
const darkCodeTheme = require('./src/prism/dark');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Arcus',
  url: 'https://arcus-azure.net/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'arcus-azure', // Usually your GitHub org/user name.
  projectName: 'Arcus', // Usually your repo name.
  themeConfig: {
    image: 'img/arcus.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'Arcus',
        src: 'img/arcus.light.png',
        srcDark: 'img/arcus.dark.png',
      },
      items: [
        {
          to: '/components',
          label: 'Components',
          position: 'left'
        },
        {
          to: '/faq',
          label: 'FAQ',
          position: 'left'
        },

        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/arcus-azure/arcus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        src: 'img/Mono_Logo_Light.svg'
      },
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/arcus-azure',
            },
            {
              label: 'Contribution guide',
              href: 'https://github.com/arcus-azure/.github/blob/main/CONTRIBUTING.md'
            },
            {
              label: 'Discuss something',
              href: 'https://github.com/arcus-azure/arcus/discussions/new/choose'
            }
          ],
        },
        {
          title: 'Components',
          items: [
            {
              label: 'Arcus Messaging',
              href: 'https://messaging.arcus-azure.net'
            },
            {
              label: 'Arcus Observability',
              href: 'https://observability.arcus-azure.net'
            },
            {
              label: 'Arcus Scripting',
              href: 'https://scripting.arcus-azure.net'
            },
            {
              label: 'Arcus Security',
              href: 'https://security.arcus-azure.net'
            },
            {
              label: 'Arcus Testing',
              href: 'https://testing.arcus-azure.net'
            }
          ]
        },
        {
          title: 'Support',
          items: [
            {
              label: 'What is Arcus?',
              href: '/faq?details=1'
            },
            {
              label: 'Why should I use Arcus?',
              href: '/faq?details=2'
            },
            {
              label: 'How to start with Arcus?',
              href: '/faq?details=3'
            },
            {
              label: 'How to contribute to Arcus?',
              href: '/faq?details=4'
            }
          ]
        }
      ],
      copyright: `A set of OSS libraries/tools that simplify building apps running on Microsoft Azure. <br/> Copyright © ${new Date().getFullYear()}, Arcus - maintained by Codit`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['csharp', 'fsharp', 'diff', 'json', 'powershell'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          path: '.',
          sidebarCollapsible: false,
          includeCurrentVersion: process.env.CONTEXT !== 'production',
          include: ['**/*.md', '**/*.mdx'],
          exclude: ['node_modules/**', 'src/**', 'docusaurus.config.js', 'sidebars.js'],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Bitter:wght@700&family=Inter:wght@400;500&Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap'
  ],
};