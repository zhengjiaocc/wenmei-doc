// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Twikoo from './components/Twikoo.vue';
import './style.css'
import Comment from './components/Comment.vue';
import NovelReader from './components/NovelReader.vue'
/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component("Twikoo", Twikoo);
    app.component("Comment", Comment);
    app.component('NovelReader', NovelReader)
    // 仅在客户端执行统计代码
    if (!import.meta.env.SSR) {
      const scriptElement1 = document.createElement('script');
      scriptElement1.setAttribute('charset', 'UTF-8');
      scriptElement1.setAttribute('id', 'LA_COLLECT');
      scriptElement1.setAttribute('src', '//sdk.51.la/js-sdk-pro.min.js');

      const scriptElement2 = document.createElement('script');
      scriptElement2.textContent = `
        LA.init({ id: "3Iyfpiu76v1utPQC", ck: "3Iyfpiu76v1utPQC" });
      `;

      document.head.appendChild(scriptElement1);
      document.head.appendChild(scriptElement2);
    }
  }
}

