// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Twikoo from './components/Twikoo.vue';
import './style.css'
import Comment from './components/Comment.vue';
import NovelReader from './components/NovelReader.vue'
import Danmaku from './components/Danmaku.vue'
import Visit from './components/Visit.vue'
import Team from './components/Team.vue'
import confetti from "./components/confetti.vue"
import notice from './components/notice.vue'
import MyLayout from './components/MyLayout.vue'
import Quote from './components/Quote.vue';
import NavVisitor  from './components/NavVisitor.vue';
import Thanks from './components/Thanks.vue';
import "vitepress-markdown-timeline/dist/theme/index.css";
import './style/index.css'
import Test from './components/Test.vue';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* 引入图标库组件 */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import all icons, solid图标库的包名为fas、regular图标库的包名为far、brands图标库的包名为fab */
import { fas } from '@fortawesome/free-solid-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'
// import { fab } from '@fortawesome/free-brands-svg-icons'

/* 添加 fas 图标 在网站中的solid分类下面获取*/
library.add(fas)

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
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   })
  // },
  Layout: MyLayout, 
  // Layout() {
  //   return h(DefaultTheme.Layout, null, {
  //     'layout-top': () => h(notice), // 使用layout-top插槽

  //   })
  // },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component("Twikoo", Twikoo);
    app.component("Comment", Comment);
    app.component('NovelReader', NovelReader)
    app.component('Danmaku', Danmaku)
    app.component('Visit', Visit)
    app.component('Team', Team)
    app.component('confetti', confetti)
    app.component('notice',notice)
    app.component('Quote',Quote)
    app.component('NavVisitor',NavVisitor)
    app.component('Thanks',Thanks)
    app.component('Test',Test)
    app.component('font-awesome-icon', FontAwesomeIcon)

  },
}

