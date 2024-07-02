import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({ 
  base: "/wtmmlsw-doc/",
  head: [["link", { rel: "icon", href: "wtmmlsw.svg" }]],
  title: "《问题妹妹恋上我》—— 负是非",
  description: "小说《问题妹妹恋上我》的文档站",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "logo_cut-modified.png",
    nav: [
      { text: '主页', link: '/' },
      { text: '项目地址', link: '/markdown-examples' },
      { text: '关于我们', link: '/markdown-examples' }

    ],

    sidebar: [
      {
        text: '小说资料',
        items: [
          { text: '简介', link: 'docs/info/into' },
          { text: '重大事记', link: 'docs/info/record' },
          {text: '经典语录', link: 'docs/info/echoes.md'},
        ],
      },
      // {
      //   text: '小说章节',
      //   items: [
      //     { text: '第1章 后妈如妹，妹似后妈', link: '/doc/1' },
      //     { text: '500-1000章', link: '/api-examples' },
      //     {text: '1000-1500章', link: '/api-examples'},
      //     {text: '1500-2000章', link: '/api-examples'},
      //   ],
      // },

    ],

    footer:{
      copyright: "Copyright © 2024-present ZhangHanxiao",
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
  }
  
})
