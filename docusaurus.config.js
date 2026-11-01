const {themes} = require('prism-react-renderer');
const protocolSource = require('./protocol-source.json');

module.exports = {
  title: 'BURST',
  tagline: 'A currency built around people',
  favicon: 'brand/burst.svg',
  url: 'https://brst.cc',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  markdown: {
    format: 'md',
    parseFrontMatter: async (params) => {
      const parsed = await params.defaultParseFrontMatter(params);
      // Keep the canonical index intact while giving the website its own front page.
      if (params.filePath.replaceAll('\\', '/').endsWith('/.protocol/docs/README.md')) {
        parsed.frontMatter.slug = '/docs';
      }
      return parsed;
    },
    preprocessor: ({fileContent}) => fileContent.replace(/<!-- default:[\w.]+(?::[\w]+)? -->|<!-- \/default -->/g, ''),
    mermaid: true,
    hooks: {onBrokenMarkdownLinks: 'throw', onBrokenMarkdownImages: 'throw'},
  },
  presets: [['classic', {
    docs: {
      path: '.protocol/docs',
      routeBasePath: '/',
      rehypePlugins: [require('./src/plugins/currency-terms')],
      exclude: ['SUMMARY.md'],
      sidebarPath: require.resolve('./sidebars.js'),
      editUrl: ({docPath}) => `https://github.com/BURST-UBI/protocol/edit/${protocolSource.ref}/docs/${docPath}`,
    },
    blog: false,
    pages: {},
    theme: {customCss: require.resolve('./src/css/custom.css')},
  }]],
  themes: [
    '@docusaurus/theme-mermaid',
    ['@easyops-cn/docusaurus-search-local', {
      hashed: true,
      searchBarShortcutHint: false,
      docsRouteBasePath: '/',
      docsDir: '.protocol/docs',
      indexBlog: false,
      highlightSearchTermsOnTargetPage: true,
    }],
  ],
  plugins: [function rawMarkdown() {
    return {
      name: 'raw-markdown',
      async postBuild({outDir}) {
        const {cp} = require('node:fs/promises');
        const {join} = require('node:path');
        await cp(join(__dirname, '.protocol/docs'), join(outDir, 'markdown'), {recursive: true});
      },
    };
  }],
  themeConfig: {
    prism: {
      theme: {
        ...themes.github,
        styles: [...themes.github.styles, {
          types: ['property', 'parameter', 'variable', 'attr-name'],
          style: {color: '#176b78'},
        }, {
          types: ['function'],
          style: {color: '#913954'},
        }],
      },
      darkTheme: themes.dracula,
      additionalLanguages: ['rust', 'toml', 'bash', 'json'],
    },
    docs: {sidebar: {autoCollapseCategories: true}},
    colorMode: {defaultMode: 'light', respectPrefersColorScheme: false},
    navbar: {
      title: 'BURST',
      logo: {alt: '', src: 'brand/burst.svg', width: 32, height: 32},
      items: [
        {to: '/docs', label: 'Documentation', position: 'left'},
        {to: '/introduction/WHITEPAPER', label: 'Whitepaper', position: 'left'},
        {href: 'https://github.com/BURST-UBI/protocol', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'light',
      links: [{title: 'Source', items: [
        {label: 'Protocol and documentation', href: 'https://github.com/BURST-UBI/protocol'},
        {label: 'Markdown files', href: `https://github.com/BURST-UBI/protocol/tree/${protocolSource.commit}/docs`},
      ]}],
      copyright: 'BURST · Open-source software under the MIT license',
    },
    tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
  },
};
