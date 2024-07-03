import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({ 
  // base: "/wenmei-doc/",
  head: [["link", { rel: "icon", href: "wtmmlsw.svg" }],
  ],



  title: "《问题妹妹恋上我》",
  description: "小说《问题妹妹恋上我》的文档站",
  themeConfig: {


    // https://vitepress.dev/reference/default-theme-config
    "lastUpdatedText": "最近更新",
    "docFooter": {
      "prev": "前一篇",
      "next": "后一篇"
    },

    outline: {
      label: '当前页'
    },

    
    logo: "logo_cut-modified.png",
    nav: [
      { text: '主页', link: '/' },
      { text: '负是非', link: '/docs/info/author' },
      { text: '留言板', link: '/docs/info/message' },
      { text: '关于我们', link: '/docs/info/about' },
      { text: '日志', link: '/docs/logs/logs' },
      { text: '项目地址', link: 'https://github.com/zhengjiaocc/wenmei-doc.git' },


    ],

    

    sidebar: [
      {
        text: '相关',
        collapsible: true,
        collapsed: false,
        items: [
          { text: '简介', link: '/docs/info/into' },
          { text: '缘盟', link: '/docs/info/link' },
          { text: '重大事记', link: '/docs/info/record'},
          { text: '经典语录', link: '/docs/info/echoes'},
        ],
      },
      {
        text: '档案库',
        collapsible: true,
        collapsed: false,
        items: [
          { text: '人物关系', link: '/docs/lib/relationship' },
          { text: '角色档案', link: '/docs/lib/relationship'},
          { text: '初绽瞬间', link: '/docs/lib/first'},
          { text: '重复之章', link: '/docs/lib/count'},
          { text: '巅峰角逐', link: '/docs/lib/sort'},
          { text: '角色尺度大公开', link: '/docs/lib/reveal'},
        ],
      },
    ],


    footer: {
      message: `
    <a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" style="text-decoration: none; display: inline-flex; align-items: center;">
    <span>本网站由</span>
    <img src="up.png" width="60" style="margin: 0 5px;">
    <span>提供加速服务</span>
    </a>
      `,
      copyright: "Copyright © 2024-present ZhangHanXiao",
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
     

    ]
    ,
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
  },
})
