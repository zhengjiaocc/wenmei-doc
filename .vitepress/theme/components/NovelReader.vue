<template>
  <div class="novel-reader-container">
    <div class="novel-reader">
      <!-- 顶部状态栏 -->
      <div class="top-bar">
        <div class="left-section" v-if="isDesktop">
          《问题妹妹恋上我》 <!-- 书名 -->
        </div>
<div class="center">
  <!-- 使用条件渲染和字符串处理来调整标题显示 -->
  {{ processTitle(currentChapter.title) }}
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
      isDesktop: false // 是否为电脑端（用于决定是否显示竖向工具栏和侧边栏）
    };
  },
  computed: {
    currentChapter() {
      return this.chapters[this.currentChapterIndex];
    }
  },
  methods: {
    processTitle(title) {
      // 如果是手机端，去除 "第" 字前面的空格
      if (!this.isDesktop) {
        return title.replace(/\s*(第)/g, '$1');
      } else {
        // 如果是电脑端，直接返回原始标题
        return title;
      }
    },
    prevChapter() {
      if (this.currentChapterIndex > 0) {
        this.currentChapterIndex--;
        this.saveCurrentChapterIndex();
        this.scrollToTop();
      }
    },
    nextChapter() {
      if (this.currentChapterIndex < this.chapters.length - 1) {
        this.currentChapterIndex++;
        this.saveCurrentChapterIndex();
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
    selectChapter(chapter) {
      this.currentChapterIndex = this.chapters.findIndex(ch => ch.id === chapter.id);
      this.saveCurrentChapterIndex();
      this.drawerOpen = false;
      this.drawer = null;
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    saveCurrentChapterIndex() {
      // 使用localStorage存储当前章节索引
      localStorage.setItem('currentChapterIndex', this.currentChapterIndex.toString());
    },
    loadSavedChapterIndex() {
      // 从localStorage加载保存的当前章节索引
      const savedIndex = localStorage.getItem('currentChapterIndex');
      if (savedIndex !== null) {
        this.currentChapterIndex = parseInt(savedIndex);
        this.scrollToTop(); // 加载后滚动到章节顶部
      }
    }
  },
  mounted() {
    this.isDesktop = window.innerWidth >= 1024;
    this.loadSavedChapterIndex(); // 组件加载时加载保存的阅读进度
  }
};
</script>


<style scoped>
.novel-reader-container {
  position: relative;
  z-index: 1;
}

.novel-reader {
  width: 100%;
  position: relative;
  font-family: 'Arial', sans-serif;
}

.top-bar {
  background-color: #fff;
  /* color: #333; */
  color: gray;
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
  border-radius: 8px 8px 0 0;
}

.top-bar .left-section {
  line-height: 1;
  margin-right: 10px; /* 电脑端书名与导航栏的间隔 */
}

.top-bar .center {
  text-align: center;
  line-height: 1;
}

.extra-navigation {
  display: flex;
  align-items: center;
}

.extra-navigation a {
  margin-left: 20px;
  text-decoration: none;
  color: gray;
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
  padding:10px;
  z-index: 1000;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-top: 30px;
}

.vertical-toolbar .toolbar-button {
  width: 55px;
  height: 55px;
  color: #333333a3;
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
  height: 40px;
  /* box-shadow: 0 -4px 8px rgba(0,0,0,0.1); */
  border-top: 1px solid #e0e0e0;
  z-index: 1000; /* 确保在其他元素之上 */
}

.mobile-toolbar .toolbar-button {
  min-width: 40px;
  height: 2em;
  /* background-color: #f0f0f0; */
  color: rgba(0, 0, 0, 0.395);
  border: none;
  cursor: pointer;
  font-size: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* 移除点击效果 */
  outline: none; /* 移除点击时的轮廓 */
  background-color: transparent; /* 确保背景色透明 */
}

.content-area {
  margin-top: 64px;
  padding: 20px;
  line-height: 1.8;
  display: flex;
  justify-content: center;
}

.content-wrapper {
   font-family: "SimSun", "宋体", serif; /* 添加宋体字体 */
  max-width: 900px;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  color: rgb(37, 37, 37);
}

.content-area pre {
  white-space: pre-wrap;
  overflow-x: auto;
}

.drawer {
  position: fixed;
  border: 2px solid rgba(0, 0, 0, 0.212);
  top: 88px;
  left: 0;
  bottom: 40px;
  width: 35%;
  max-width: 100vw;
  background-color: #f0f0f0;
  box-shadow: 4px 0 8px rgba(0,0,0,0.1);
  /* overflow-y: auto; */
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
  border-radius: 0;
  overflow: hidden;
  border-radius: 0 10px 10px 0;
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
  }

  .drawer {
    width: 100%;
    max-width: 100vw;
    left: 0;
    right: 0;
    border-radius: 0;
    transform: translateX(-100%);
    /* box-shadow: 4px 0 8px rgba(0,0,0,0.1); */
      top: 64px;
      border: 0;
  }



.content-area{
  font-family: "SimSun", "宋体", serif; /* 添加宋体字体 */
  font-size: 20px;
  color: rgba(37, 34, 27);
  padding: 0;
  background-color: rgb(250, 250, 250);


}

.top-bar{
  box-shadow: none; /* 移除阴影 */
  background-color: rgb(250, 250, 250);

}
.top-bar .center{
  color:rgba(149, 139, 127);
  font-size: 14px;
}


.content-wrapper{
  padding: 0 20px;
  overflow: hidden;
  margin-bottom: 40px;
  background-color: rgb(250, 250, 250);


}
.content-wrapper pre {
  margin-top: 0;
  font-size: 19px; /* 调整字体大小 */
  padding: 0;
}

.drawer-content{
  height: 100%;
  background-color: #fffae1cb;
}


}
</style>
