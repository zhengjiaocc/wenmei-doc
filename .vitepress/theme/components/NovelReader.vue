<template>
  <div class="novel-reader-container">
    <div class="novel-reader">
      <!-- 顶部状态栏 -->
      <div class="top-bar">
        <div class="left-section" v-if="isDesktop">
          《问题妹妹恋上我》 <!-- 书名 -->
        </div>
        <div class="center">
          {{ currentChapter.title }} <!-- 当前章节 -->
        </div>
        <!-- 添加额外的导航按钮（仅在电脑端显示） -->
        <div class="extra-navigation" v-if="isDesktop">
          <a href="/">主页</a>
          <a href="/docs/info/author">负是非</a>
          <a href="/docs/info/message">留言板</a>
        </div>
      </div>

      <!-- 目录侧边栏 -->
      <div class="drawer" :class="{ 'open': drawerOpen }" v-if="drawer === 'catalog'">
        <div class="drawer-content">
          <ul>
            <li v-for="chapter in chapters" :key="chapter.id" @click="selectChapter(chapter)">
              {{ chapter.title }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 竖向工具栏（仅在电脑端显示） -->
      <div class="vertical-toolbar" v-if="isDesktop">
        <button @click="toggleDrawer('catalog')" class="toolbar-button">
          目录
        </button>
        <button @click="prevChapter" class="toolbar-button">
          上一章
        </button>
        <button @click="nextChapter" class="toolbar-button">
          下一章
        </button>
      </div>

      <!-- 手机端工具栏 -->
      <div class="mobile-toolbar" v-else>
        <a href="/" class="toolbar-button">
          主页
        </a>
        <button @click="toggleDrawer('catalog')" class="toolbar-button">
          目录
        </button>
        <button @click="prevChapter" class="toolbar-button">
          上一章
        </button>
        <button @click="nextChapter" class="toolbar-button">
          下一章
        </button>
      </div>

      <!-- 小说内容区域 -->
      <div class="content-area">
        <div class="content-wrapper">
          <pre>{{ currentChapter.content }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import novelData from '/docs/novel/chapters.json'; // 导入小说数据

export default {
  name: 'NovelReader',
  data() {
    return {
      chapters: novelData, // 小说章节数据
      currentChapterIndex: 0, // 当前章节索引
      drawer: null, // 当前展开的侧边栏
      drawerOpen: false, // 侧边栏是否展开
      isDesktop: false ,// 是否为电脑端（用于决定是否显示竖向工具栏和侧边栏）
      chapterWordCount: 0 // 当前章节字数
    };
  },
  computed: {
    currentChapter() {
      return this.chapters[this.currentChapterIndex];
    }
  },
  methods: {
    prevChapter() {
      if (this.currentChapterIndex > 0) {
        this.currentChapterIndex--;
        this.scrollToTop();
      }
    },
    nextChapter() {
      if (this.currentChapterIndex < this.chapters.length - 1) {
        this.currentChapterIndex++;
        this.scrollToTop();
      }
    },
    toggleDrawer(drawerName) {
      if (this.drawer === drawerName && this.drawerOpen) {
        this.drawerOpen = false;
        this.drawer = null;
      } else {
        this.drawer = drawerName;
        this.drawerOpen = true;
      }
    },
 // 选择章节
  selectChapter(chapter) {
    this.currentChapterIndex = this.chapters.findIndex(ch => ch.id === chapter.id);
    this.drawerOpen = false;
    this.drawer = null;
    this.calculateChapterWordCount(); // 更新章节字数
    this.scrollToTop();
  },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  },
  mounted() {
    this.isDesktop = window.innerWidth >= 1024;
  }
};
</script>
<style scoped>
/* 整个页面背景为浅黄色，提供温暖和舒适的阅读体验 */
.novel-reader-container {
  position: relative;
  z-index: 1;
  background-color: #FFFAE1;
}

/* 字体颜色为深棕色或黑色 */
.novel-reader {
  width: 100%;
  position: relative;
  font-family: 'Arial', sans-serif;
  color: #4A2C2A; /* 深棕色 */
}

.top-bar {
  background-color: #fff;
  color: #4A2C2A;
  height: 64px;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.top-bar .left-section {
  line-height: 1;
  margin-right: 10px; /* 电脑端书名与导航栏的间隔 */
}

.top-bar .center {
  text-align: center;
  line-height: 1;
  font-weight: bold;
  font-size: 18px; /* 突出章节信息 */
}

.extra-navigation {
  display: flex;
  align-items: center;
}

.extra-navigation a {
  margin-left: 20px;
  text-decoration: none;
  color: #4A2C2A;
  font-size: 14px;
  font-weight: 500;
}

.extra-navigation a:hover {
  text-decoration: underline;
}

.vertical-toolbar {
  position: fixed;
  top: 64px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 10px;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.vertical-toolbar .toolbar-button {
  width: 55px;
  height: 55px;
  background-color: #f0f0f0;
  color: #4A2C2A;
  border: none;
  cursor: pointer;
  font-size: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-bottom: 10px;
}

.mobile-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  box-shadow: 0 -4px 8px rgba(0,0,0,0.1);
  border-top: 1px solid #e0e0e0;
}

.mobile-toolbar .toolbar-button {
  min-width: 40px;
  height: 40px;
  color: #4A2C2A;
  border: none;
  cursor: pointer;
  font-size: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-area {
  margin-top: 64px;
  margin-bottom: 50px; /* 确保内容不会被底部工具栏遮挡 */
  padding: 20px;
  line-height: 1.8;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  max-width: 900px;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.content-area pre {
  white-space: pre-wrap;
  overflow-x: auto;
  font-size: 16px; /* 字体适中 */
  line-height: 1.6; /* 行距适中 */
  color: #4A2C2A;
}

.drawer {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 50px; /* 确保目录不会被底部工具栏遮挡 */
  width: 100%;
  max-width: 100vw;
  background-color: #FFFAE1;
  box-shadow: 4px 0 8px rgba(0,0,0,0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
}

.drawer.open {
  transform: translateX(0);
}

.drawer-content {
  height: calc(100vh - 114px);
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.drawer ul {
  list-style-type: none;
  padding: 0;
  margin: 10px;
}

.drawer ul li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.drawer ul li:hover {
  background-color: #ddd;
}

@media (max-width: 1023px) {
  .vertical-toolbar {
    display: none;
  }

  .mobile-toolbar {
    top: auto;
    bottom: 0;
    /* border-color: red; */
    border-radius: 8PX;
  }

  /* .content-area {
    margin-top: 64px;
  } */

  .drawer {
    width: 100%;
    max-width: 100vw;
    left: 0;
    right: 0;
    border-radius: 0;
    transform: translateX(-100%);
    box-shadow: 4px 0 8px rgba(0,0,0,0.1);
  }

.content-area{
  font-size: 20px;
  color: rgba(37, 34, 27);
  padding: 0;
  /* background-color: red; */

}

.top-bar{
     box-shadow: none; /* 移除阴影 */
       background-color: #FFFAE1;
       padding: 0;
 
}
.top-bar .center{
  color:rgba(149, 139, 127);
  font-size: 14px;
}

.top-bar .count{
  color:red;
  margin-right: 5px;
}

.content-wrapper{
  background-color: #FFFAE1;
  padding: 0 20px;
}
.content-wrapper pre {
  font-size: 19px; /* 调整字体大小 */
}

}
</style>
