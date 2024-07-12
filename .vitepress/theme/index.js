// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Twikoo from './components/Twikoo.vue';
import './style.css'
import Comment from './components/Comment.vue';
import NovelReader from './components/NovelReader.vue'
import CommentForChapter from './components/CommentForChapter.vue'
import Danmaku from './components/Danmaku.vue'
/** @type {import('vitepress').Theme} */

DefaultTheme.enhanceApp = ({ app, router, siteData }) => {
  router.onBeforeRouteChange = (to) => {
    console.log('路由将改变为: ', to);
    if (typeof _hmt !== 'undefined') {
      _hmt.push(['_trackPageview', to]);
    }
  };
};

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
    app.component('CommentForChapter', CommentForChapter)
    app.component('Danmaku', Danmaku)

  }
}

