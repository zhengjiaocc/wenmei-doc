import { defineConfig } from 'vitepress';
export default defineConfig({
  // base: "/wenmei-doc/",
  head: [
    ["link", { rel: "icon", href: "wtmmlsw.svg" }],
    ['meta', { name: 'description', content: '《问题妹妹恋上我》文档库，负是非' }],
  ],
  sitemap: {
    hostname: 'https://www.wtmmlsw.cn'
  },

  appearance: false, // 默认配置，可以切换
  title: "《问题妹妹恋上我》",
  description: "小说《问题妹妹恋上我》的文档站",
  themeConfig: {

    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    "lastUpdatedText": "最近更新",
    "docFooter": {
      "prev": "前一篇",
      "next": "后一篇"
    },
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    outline: {
      label: '当前页'
    },

    logo: "logo_cut-modified.png",
    nav: [
      { text: '主页', link: '/' },
      { text: '小说', link: '/docs/lib/novel.md' },
      { text: '负是非', link: '/docs/info/author' },
      { text: '留言板', link: '/docs/info/message' },
      {
        text: '关于',
        items: [
          { text: '关于我们', link: '/docs/info/about.md' },
          { text: '日志', link: '/docs/logs/logs' },
          { text: '项目地址', link: 'https://github.com/zhengjiaocc/wenmei-doc.git' },
        ],
      },
    ],
    footer: {
      message: `
        <a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" style="text-decoration: none; display: inline-flex; align-items: center;">
          <span>本站由</span>
          <img src="up.png" width="60" style="margin: 0 5px;">
          <span>提供加速服务</span>
        </a>
      `,
      copyright: "Copyright © 2024-present ZhangHanXiao",
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    // 合并自动生成的侧边栏和手动配置的侧边栏项
    sidebar: [
      {
        text: '相关',
        collapsible: true,
        collapsed: false,
        items: [
          { text: '简介', link: '/docs/info/into' },
          { text: '缘盟', link: '/docs/info/link' },
          { text: '重大事记', link: '/docs/info/record' },
          {
            text: '经典语录',
            collapsible: true,
            collapsed: false,
            items: [
              { text: '愿有缘·楚缘', link: '/docs/lib/echoes/cy.md' },
              { text: '孰留缘·流苏', link: '/docs/lib/echoes/ls.md' },
              { text: '孰同缘·舒童', link: '/docs/lib/echoes/st.md' },
              { text: '可有缘·一可', link: '/docs/lib/echoes/yk.md' },
              { text: '怜人缘·怜人', link: '/docs/lib/echoes/lr.md' },
            ],
          },
        ],
      },
      {
        text: '档案库',
        collapsible: true,
        collapsed: false,
        items: [
          { text: '人物关系', link: '/docs/lib/role' },
          {
            text: '角色档案',
            collapsible: true,
            collapsed: true,
            items: [
              { text: '楚缘', link: '/docs/lib/role-doc/chuyaun.md' },
              { text: '楚南', link: '/docs/lib/role-doc/chunan.md' },
              { text: '萧一可', link: '/docs/lib/role-doc/xiaoyike.md' },
              { text: '东方怜人', link: '/docs/lib/role-doc/dongfanglianren.md' },
              { text: '程流苏', link: '/docs/lib/role-doc/chengliusu.md' },
              { text: '苏童', link: '/docs/lib/role-doc/sutong.md' },
              { text: '冬小夜', link: '/docs/lib/role-doc/dongxiaoye.md' },
            ],
          },
          { text: '初绽瞬间', link: '/docs/lib/first' },
          { text: '重复之章', link: '/docs/lib/count' },
          { text: '巅峰角逐', link: '/docs/lib/sort' },
          { text: '角色尺度大公开', link: '/docs/lib/reveal' },
        ],
      },
      // 自动生成的小说章节侧边栏项
      {
        text: '资源库',
        collapsible: true,
        collapsed: true,
        items: [
          { text: '相关资源', link: '/docs/resources/resources.md' },
          { text: '在线阅读', link: '/docs/lib/novel.md' },
        ],
      },
    ],
  },
});
