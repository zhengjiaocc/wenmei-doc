<template>
  <div class="novel-reader-container">
    <Danmaku v-if="danmakuVisible" :key="currentChapter.id" />
    <div class="novel-reader">
      <!-- 顶部状态栏 -->
      <div class="top-bar" v-show="topBarVisible">
        <div class="left-section" v-if="isDesktop">
          <a href="/">《问题妹妹恋上我》</a>
          <!-- 书名 -->
        </div>
        <div class="center">
          <!-- 使用条件渲染和字符串处理来调整标题显示 -->
          {{ processTitle(currentChapter.title) }}
        </div>

        <!-- 添加额外的导航按钮（仅在电脑端显示） -->
        <div class="extra-navigation" v-if="isDesktop">
          <a href="/docs/info/author">负是非</a>
          <a href="/docs/info/message">留言板</a>
          <a href="/">主页</a>
        </div>
        <!-- 移动端主页按钮移到右上角 -->
        <a href="/" class="mobile-home-button" v-if="!isDesktop">主页</a>
      </div>

      <!-- 目录侧边栏 -->
      <div
        class="drawer"
        :class="{ open: drawerOpen }"
        v-if="drawer === 'catalog'"
      >
        <div class="drawer-content">
          <ul>
            <li
              v-for="chapter in chapters"
              :key="chapter.id"
              @click="selectChapter(chapter)"
            >
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
        <button @click="scrollToBottom" class="toolbar-button">评论</button>
        <button @click="scrollToTop" class="toolbar-button">顶部</button>
        <button @click="prevChapter" class="toolbar-button">上一章</button>
        <button @click="nextChapter" class="toolbar-button">下一章</button>
        <!-- <button @click="toggleDrawer('danmaku')" class="toolbar-button">
          弹幕
        </button> -->
      </div>

      <!-- 手机端工具栏 -->
      <div class="mobile-toolbar" v-else>
        <button @click="toggleDrawer('catalog')" class="toolbar-button">
          目录
        </button>
        <button @click="prevChapter" class="toolbar-button">上一章</button>
        <button @click="nextChapter" class="toolbar-button">下一章</button>
        <!-- 替换主页按钮为评论按钮 -->
        <button @click="scrollToBottom" class="toolbar-button">评论</button>
      </div>

      <!-- 小说内容区域 -->
      <div class="content-area">
        <div class="content-wrapper">
          <pre>{{ currentChapter.content }}</pre>
        </div>
      </div>

      <div class="comment-container">
        <Twikoo v-if="currentChapter" :key="currentChapter.id" />
      </div>
    </div>

    <!-- Twikoo 评论组件 -->
  </div>
</template>

<script>
import novelData from "/docs/novel/chapters.json"; // 导入小说数据

export default {
  name: "NovelReader",
  data() {
    return {
      chapters: novelData, // 小说章节数据
      currentChapterIndex: 0, // 当前章节索引
      drawer: null, // 当前展开的侧边栏
      drawerOpen: false, // 侧边栏是否展开
      isDesktop: false, // 是否为电脑端（用于决定是否显示竖向工具栏和侧边栏）
      danmakuVisible: false, // 控制弹幕显示
      topBarVisible: true, // 顶部状态栏是否可见
    };
  },
  computed: {
    currentChapter() {
      return this.chapters[this.currentChapterIndex];
    },
  },
  methods: {
    // ... 其他方法
    handleScroll() {
      clearTimeout(this.scrollTimeout); // 每次滚动时清除之前的定时器

      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (!this.isDesktop) {
        // 如果是手机端，不隐藏顶部状态栏
        this.topBarVisible = true;
      } else {
        // 如果是电脑端，根据滚动方向显示或隐藏顶部状态栏
        if (currentScrollTop > this.lastScrollTop) {
          // 向下滚动，隐藏顶部状态栏
          this.topBarVisible = false;
        } else if (currentScrollTop < this.lastScrollTop) {
          // 向上滚动，显示顶部状态栏
          this.topBarVisible = true;
        }

        // 如果滚动到页面顶部，显示顶部状态栏
        if (currentScrollTop <= 0) {
          this.topBarVisible = true;
        }
      }

      this.lastScrollTop = currentScrollTop;

      // 设置定时器，在滚动结束后再显示或隐藏顶部状态栏
      this.scrollTimeout = setTimeout(() => {
        if (!this.isDesktop) {
          // 如果是手机端，保持顶部状态栏显示
          this.topBarVisible = true;
        } else {
          if (currentScrollTop > this.lastScrollTop) {
            // 向下滚动，隐藏顶部状态栏
            this.topBarVisible = false;
          } else if (currentScrollTop < this.lastScrollTop) {
            // 向上滚动，显示顶部状态栏
            this.topBarVisible = true;
          }
        }
      }, 1000); // 延迟1000毫秒
    },

    processTitle(title) {
      // 如果是手机端，去除 "第" 字前面的空格
      if (!this.isDesktop) {
        return title.replace(/\s*(第)/g, "$1");
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
        window.TWIKOO_MAGIC_PATH = "chapter" + this.currentChapter.id;
        console.log("prevChapter", window.TWIKOO_MAGIC_PATH);
      }
    },
    nextChapter() {
      if (this.currentChapterIndex < this.chapters.length - 1) {
        this.currentChapterIndex++;
        this.saveCurrentChapterIndex();
        this.scrollToTop();
        window.TWIKOO_MAGIC_PATH = "chapter" + this.currentChapter.id;
        console.log("nextChapter", window.TWIKOO_MAGIC_PATH);
      }
    },
    toggleDrawer(drawerName) {
      if (drawerName === "danmaku") {
        this.danmakuVisible = !this.danmakuVisible;
      } else {
        if (this.drawer === drawerName && this.drawerOpen) {
          this.drawerOpen = false;
          this.drawer = null;
        } else {
          this.drawer = drawerName;
          this.drawerOpen = true;
        }
      }
    },
    selectChapter(chapter) {
      this.currentChapterIndex = this.chapters.findIndex(
        (ch) => ch.id === chapter.id
      );
      this.saveCurrentChapterIndex();
      this.drawerOpen = false;
      this.drawer = null;
      this.scrollToTop();
      window.TWIKOO_MAGIC_PATH = "chapter" + this.currentChapter.id;
      console.log("selectChapter", window.TWIKOO_MAGIC_PATH);
    },

    scrollToBottom() {
      // 获取评论区域的 DOM 元素
      const commentContainer = document.querySelector(".comment-container");
      if (commentContainer) {
        commentContainer.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    saveCurrentChapterIndex() {
      // 使用localStorage存储当前章节索引
      localStorage.setItem(
        "currentChapterIndex",
        this.currentChapterIndex.toString()
      );
    },
    loadSavedChapterIndex() {
      // 从localStorage加载保存的当前章节索引
      const savedIndex = localStorage.getItem("currentChapterIndex");
      if (savedIndex !== null) {
        this.currentChapterIndex = parseInt(savedIndex);
        this.scrollToTop(); // 加载后滚动到章节顶部
        window.TWIKOO_MAGIC_PATH =
          "chapter" + this.chapters[this.currentChapterIndex].id;
      }
    },
    // 处理键盘事件
    handleKeyUp(event) {
      if (event.ctrlKey && event.key === " ") {
        this.danmakuVisible = !this.danmakuVisible;
      }
    },
    updateTwikooMagicPath() {
      if (this.currentChapter) {
        window.TWIKOO_MAGIC_PATH = "chapter" + this.currentChapter.id;
      }
    },
  },
  mounted() {
    window.TWIKOO_MAGIC_PATH = "chapter" + this.currentChapter.id;
    // 监听键盘事件
    window.addEventListener("keyup", this.handleKeyUp);

    this.isDesktop = window.innerWidth >= 1024;
    this.loadSavedChapterIndex(); // 组件加载时加载保存的阅读进度
    window.addEventListener("scroll", this.handleScroll);
    console.log("mounted:", window.TWIKOO_MAGIC_PATH);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.novel-reader-container {
  position: relative;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgb(224, 224, 224);
}

.novel-reader {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.top-bar {
  margin: 0 auto;
  background-color: #f2f2f2;
  max-width: 850px;
  color: gray;
  height: 64px;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 0 0;
  border-bottom: 1px solid rgb(223, 223, 223);
  transition: transform 2s ease, opacity 2s ease;
}

.top-bar .left-section {
  align-items: center;
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
  padding: 10px;
  z-index: 1000;
  border-radius: 8px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  margin-top: 30px;
}

.vertical-toolbar .toolbar-button {
  width: 55px;
  height: 55px;
  color: #333333a3;
  border: none;
  cursor: pointer;
  font-size: 0.8em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  background-color: rgb(242, 242, 242);
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
  height: 45px;
  z-index: 1000; /* 确保在其他元素之上 */
}

.mobile-toolbar .toolbar-button {
  min-width: 40px;
  height: 2em;
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
  background-color: rgb(224, 224, 224);
  padding: 0 20px;
  line-height: 1.8;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.content-wrapper {
  max-width: 960px;
  width: 100%;
  background-color: #f2f2f2;
  padding: 60px 80px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: #252525;
  overflow: hidden;
}

.content-area pre {
  white-space: pre-wrap;
  word-wrap: break-word; /* 兼容旧版本浏览器的换行 */
  overflow-x: hidden; /* 隐藏横向滚动条 */
  margin-bottom: 1.6rem;
  font-size: 18px;
}

.drawer {
  border: 1px solid rgba(232, 232, 232, 0.69);
  position: fixed;
  top: 88px;
  right: 98px;
  bottom: 40px;
  width: 25%;
  max-width: 100vw;
  background-color: rgb(250, 250, 250);
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: 999;
  border-radius: 8px;
  overflow: hidden;
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
  border-bottom: 2px solid rgba(232, 232, 232, 0.69);
}

.drawer ul li:hover {
  background-color: #ddd;
}

.comment-container {
  padding: 10px 10px;
  width: 100%;
  max-width: 963px;
  margin: 0 auto;
  margin-top: 10px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  border-radius: 10px;
}
.danmaku-container {
  position: absolute; /* 调整为 absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999; /* 确保在其他内容上方 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.danmaku-content {
  width: 80%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  color: #333;
  font-size: 1.2em;
  text-align: center;
}
@media (max-width: 1023px) {
  .vertical-toolbar {
    display: none;
  }

  .drawer {
    width: 100%;
    max-width: 100vw;
    left: 0;
    right: 0;
    border-radius: 0;
    transform: translateX(-100%);
    top: 64px;
    border: 0;
  }

  .drawer ul {
    color: rgb(236, 142, 54);
    font-size: 16px;
    list-style-type: none;
    padding: 0;
    background-color: rgb(242, 243, 245);
  }
  .drawer ul li:nth-child(even) {
    border: 0;
    background-color: whitesmoke;
    padding: 8px 0px;
    cursor: pointer;
    transition: background-color 0.1s ease;
  }

  .drawer ul li:nth-child(odd) {
    border: 0;
    background-color: rgba(245, 245, 245, 0.633);
    padding: 8px 0px;
    cursor: pointer;
    transition: background-color 0.1s ease;
  }

  .content-area {
    margin-top: 64px;
    /* margin-bottom: 40px; */
    font-family: "SimSun", "宋体", serif;
    font-size: 19px;
    color: rgba(37, 34, 27);
    padding: 0;
    background-color: rgb(250, 250, 250);
    overflow: hidden;
  }

  .top-bar {
    box-shadow: none;
    background-color: rgb(250, 250, 250);
    height: 64px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
  }
  .top-bar .center {
    color: rgba(149, 139, 127);
    font-size: 14px;
  }

  .content-wrapper {
    padding: 0 20px;
    width: 100%;
    max-width: 960px;
    background-color: rgb(250, 250, 250);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    color: rgb(37, 37, 37);
    overflow: hidden;
  }
  .content-wrapper pre {
    margin-top: 0;
    font-size: 19px;
    padding: 0;
  }

  .drawer-content {
    height: 100%;
    background-color: whitesmoke;
  }
}
</style>
