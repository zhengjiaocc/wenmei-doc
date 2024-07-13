<template>
  <div class="novel-reader-container">
    <Danmaku v-if="danmakuVisible" :key="currentChapter.id" />
    <div class="novel-reader">
      <!-- 顶部状态栏 -->
      <div class="top-bar" v-show="topBarVisible">
        <div class="left-section" v-if="isDesktop">
          <a href="/">《问题妹妹恋上我》</a>
        </div>
        <div class="center">
          {{ processTitle(currentChapter.title) }}
        </div>

        <div class="extra-navigation" v-if="isDesktop">
          <a href="/docs/info/author">负是非</a>
          <a href="/">主页</a>
        </div>
        <div
          class="mobile-settings-button"
          v-if="!isDesktop"
          @click="toggleSettings"
        >
          <span class="icon">☰</span>
        </div>
      </div>
      <!-- 系统设置工具栏 -->
      <div class="settings-toolbar" v-if="settingsVisible">
        <button @click="goHome">主页</button>
        <div class="ps-container">
          <button class="ps-button">PS</button>
          <label class="switch">
            <input type="checkbox" v-model="psVisible" @click="togglePsVisibility" />
            <span class="slider round"></span>
          </label>
        </div>
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
        <button @click="scrollToTop" class="toolbar-button">顶部</button>
        <button @click="scrollToBottom" class="toolbar-button">底部</button>
        <button @click="prevChapter" class="toolbar-button">上一章</button>
        <button @click="nextChapter" class="toolbar-button">下一章</button>
        <button @click="togglePsVisibility" class="toolbar-button ps-button">
          <span v-if="!psVisible" style="text-decoration: line-through"
            >PS</span
          >
          <span v-else>PS</span>
        </button>
      </div>

      <!-- 手机端工具栏 -->
      <div class="mobile-toolbar" v-else>
        <button @click="toggleDrawer('catalog')" class="toolbar-button">
          目录
        </button>
        <button @click="prevChapter" class="toolbar-button">上一章</button>
        <button @click="nextChapter" class="toolbar-button">下一章</button>
        <!-- 替换主页按钮为评论按钮 -->
        <button @click="toggleComments" class="toolbar-button">
          <span class="comment-count" v-if="commentsCount != 0">
            <!-- 根据评论数量动态显示 -->
            {{ formatCommentsCount() }}
          </span>
          评论
          <span
            :class="{
              'rotate-open': commentsVisible,
              'rotate-close': !commentsVisible,
            }"
            >+</span
          >
        </button>
      </div>

      <!-- 小说内容区域 -->
      <div class="content-area">
        <div class="content-wrapper">
          <pre>{{ currentChapter.content }}</pre>
          <hr v-if="psVisible && currentChapter.ps.trim() !== ''" />
          <pre v-if="psVisible">{{ currentChapter.ps }}</pre>
          <!-- 添加上一章和下一章按钮 -->
          <div class="chapter-navigation">
            <button @click="prevChapter" :disabled="currentChapterIndex === 0">
              上一章
            </button>
            <button
              @click="nextChapter"
              :disabled="currentChapterIndex === chapters.length - 1"
            >
              下一章
            </button>
          </div>
        </div>
      </div>

      <div class="comment-container">
        <button
          @click="toggleComments"
          class="toggle-comments-button"
          v-if="isDesktop"
        >
          <span class="comments-title">本章评论</span>
          <!-- 使用span标签包装标题 -->
          {{ commentsVisible ? "关闭评论" : "打开评论" }}
          <span class="comments-count">数量：{{ commentsCount }}</span>
          <!-- 移动评论数量到按钮内部右侧 -->
        </button>
        <div v-if="commentsVisible">
          <Twikoo v-if="currentChapter" :key="currentChapter.id" ref="twikoo" />
        </div>
      </div>
    </div>
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
      commentsVisible: false, // 评论区是否可见
      commentsCount: 0, // 当前章节的评论数量
      preloadComments: [], // 预加载评论数组
      settingsVisible: false, // 控制设置工具栏显示
      psVisible: false, // 控制PS内容显示
    };
  },
  computed: {
    currentChapter() {
      return this.chapters[this.currentChapterIndex];
    },
  },
  methods: {
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
        this.updateTwikooMagicPath();
        this.getCommentsCount();
        this.commentsVisible = false;
        this.preloadCommentsCount(); // 预加载相邻章节的评论数量

        // 更新相邻章节的评论数量显示
        this.commentsCount = this.preloadComments[this.currentChapterIndex];
      }
    },
    nextChapter() {
      if (this.currentChapterIndex < this.chapters.length - 1) {
        this.currentChapterIndex++;
        this.saveCurrentChapterIndex();
        this.scrollToTop();
        this.updateTwikooMagicPath();
        this.getCommentsCount();
        this.commentsVisible = false;
        this.preloadCommentsCount(); // 预加载相邻章节的评论数量

        // 更新相邻章节的评论数量显示
        this.commentsCount = this.preloadComments[this.currentChapterIndex];
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
      this.commentsVisible = false; // 关闭当前章节的评论区

      this.currentChapterIndex = this.chapters.findIndex(
        (ch) => ch.id === chapter.id
      );
      this.saveCurrentChapterIndex();
      this.drawerOpen = false;
      this.drawer = null;
      this.scrollToTop();
      this.updateTwikooMagicPath();
      this.getCommentsCount();
      this.commentsVisible = false;
      this.preloadCommentsCount(); // 预加载相邻章节的评论数量
    },

    scrollToBottom() {
      // 获取评论区域的 DOM 元素
      const commentContainer = document.querySelector(".comment-container");
      if (commentContainer) {
        commentContainer.scrollIntoView({ behavior: "auto", block: "end" });
      }
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    },
    saveCurrentChapterIndex() {
      // 使用localStorage存储当前章节索引
      localStorage.setItem(
        "currentChapterIndex",
        this.currentChapterIndex.toString()
      );
      console.log("保存当前章节索引:", this.currentChapterIndex);
    },
    loadSavedChapterIndex() {
      // 从localStorage加载保存的当前章节索引
      const savedIndex = localStorage.getItem("currentChapterIndex");
      if (savedIndex !== null) {
        this.currentChapterIndex = parseInt(savedIndex);
        this.scrollToTop(); // 加载后滚动到章节顶部
        this.updateTwikooMagicPath();
        console.log("加载保存的章节索引:", this.currentChapterIndex);
      }
    },
    // 处理键盘事件
    handleKeyUp(event) {
      if (event.ctrlKey && event.key === " ") {
        this.danmakuVisible = !this.danmakuVisible;
        console.log("弹幕显示状态切换:", this.danmakuVisible);
      }
    },
    updateTwikooMagicPath() {
      if (this.currentChapter) {
        window.TWIKOO_MAGIC_PATH = "chapter" + this.currentChapter.id;
        console.log("更新 Twikoo 路径:", window.TWIKOO_MAGIC_PATH);
      }
    },
    toggleComments() {
      this.drawerOpen = false;
      this.commentsVisible = !this.commentsVisible;
      console.log("评论区显示状态切换:", this.commentsVisible);

      if (this.commentsVisible) {
        // 延迟执行滚动操作，确保评论区已渲染
        this.$nextTick(() => {
          const commentContainer = document.querySelector(".comment-container");
          if (commentContainer) {
            commentContainer.scrollIntoView({
              behavior: "auto",
              block: "start",
            });
          }
        });
      }
    },
    // 获取评论数量方法
    async getCommentsCount() {
      try {
        const response = await fetch("https://twikoo-wm.zhengjiao.cc/", {
          method: "POST",
          body: JSON.stringify({
            event: "COMMENT_GET",
            url: window.TWIKOO_MAGIC_PATH,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        const count = data.count;
        this.commentsCount = count; // 更新评论数量
        console.log("当前文章评论数量：", count);
      } catch (error) {
        console.error("获取评论数量失败：", error);
      }
    },
    // 预加载相邻章节的评论数量
    async preloadCommentsCount() {
      const nextChapterIndex = this.currentChapterIndex + 1;
      const prevChapterIndex = this.currentChapterIndex - 1;

      const fetchCommentCount = async (chapterIndex) => {
        if (chapterIndex >= 0 && chapterIndex < this.chapters.length) {
          const chapter = this.chapters[chapterIndex];
          const response = await fetch("https://twikoo-wm.zhengjiao.cc/", {
            method: "POST",
            body: JSON.stringify({
              event: "COMMENT_GET",
              url: "chapter" + chapter.id,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          this.preloadComments[chapterIndex] = data.count;
          console.log(`预加载章节 ${chapterIndex} 的评论数量:`, data.count);
        }
      };

      fetchCommentCount(nextChapterIndex);
      fetchCommentCount(prevChapterIndex);
    },
    formatCommentsCount() {
      const count = this.commentsCount;
      if (count !== undefined && count !== null) {
        if (count >= 10000) {
          return (count / 10000).toFixed(1) + "w+";
        } else if (count >= 1000) {
          return (count / 1000).toFixed(1) + "k+";
        } else {
          return count.toString();
        }
      } else {
        return "";
      }
    },
    toggleSettings() {
      this.settingsVisible = !this.settingsVisible;
      console.log("设置按钮被点击了");
    },
    goHome() {
      // 主页按钮逻辑
      window.location.href = "/";
      console.log("主页按钮被点击了");
    },
    togglePsVisibility() {
      this.psVisible = !this.psVisible;
      localStorage.setItem("psVisible", this.psVisible.toString()); // 将psVisible状态保存到本地存储
      console.log("PS显示状态切换:", this.psVisible);
    },

    // 组件加载时加载保存的PS状态
    loadPsVisibility() {
      const savedPsVisible = localStorage.getItem("psVisible");
      if (savedPsVisible !== null) {
        this.psVisible = savedPsVisible === "true"; // 将字符串转换为布尔值
        console.log("加载保存的PS显示状态:", this.psVisible);
      }
    },
    handleClickOutside(event) {
      // 如果点击的不是设置按钮以及设置工具栏本身，则隐藏设置工具栏
      if (
        !event.target.closest(".mobile-settings-button") &&
        !event.target.closest(".settings-toolbar")
      ) {
        this.settingsVisible = false;
      }
    },
  },

  mounted() {
    this.isDesktop = window.innerWidth >= 1024;
    this.loadSavedChapterIndex(); // 组件加载时加载保存的阅读进度
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("click", this.handleClickOutside);
    this.loadPsVisibility();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("click", this.handleClickOutside);
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
  padding: 10px;
  width: 100%;
  max-width: 963px;
  margin: 0 auto;
  margin-top: 10px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  border-radius: 10px;
  position: relative;
  margin-bottom: 20px;
}

.toggle-comments-button {
  width: 100%;
  height: 40px;
  background-color: transparent;
  color: #555;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s,
    box-shadow 0.3s;
  display: flex;
  justify-content: space-between; /* 左右对齐 */
  align-items: center; /* 垂直居中 */
  padding: 0 10px; /* 左右内边距 */
}

.toggle-comments-button:hover {
  background-color: #e0e0e01f; /* 悬停时背景色 */
  color: #333; /* 悬停时文字颜色 */
  border-color: #999999b2; /* 悬停时边框颜色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 提升浅色阴影 */
}
/* 弹幕样式 */
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

.chapter-navigation {
  display: flex;
  justify-content: center; /* 居中对齐 */
  gap: 60px; /* 按钮之间的间距 */
  margin: 20px 0; /* 顶部和底部的间距 */
}

.chapter-navigation button {
  width: 200px; /* 按钮宽度 */
  height: 40px; /* 按钮高度 */
  background-color: rgb(232, 112, 58); /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 去掉默认边框 */
  border-radius: 20px; /* 圆角效果 */
  cursor: pointer; /* 鼠标指针效果 */
  font-size: 16px; /* 文字大小 */
  transition: background-color 0.3s; /* 过渡效果 */
  display: flex;
  justify-content: center; /* 文字居中 */
  align-items: center; /* 文字居中 */
}

.chapter-navigation button:hover {
  background-color: rgb(210, 100, 52); /* 悬停时的背景颜色 */
}

@media (max-width: 1023px) {
  .mobile-settings-button {
    margin-top: 9px;
  }
  .comment-container {
    background-color: rgb(250, 250, 250);
  }

  .toggle-comments-button {
    margin: 0;
    height: 40px; /* 按钮高度 */
    background-color: transparent; /* 背景透明 */
    color: #555; /* 文字颜色 */
    border: none;
    padding: 0 auto;
    margin-bottom: 20px;
    box-shadow: none;
  }

  .chapter-navigation {
    display: none;
  }
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
    top: 44px;
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
    margin-top: 50px;
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
    height: 44px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
  }

  .top-bar a {
    margin-top: 4px;
  }
  .top-bar .center {
    margin-top: 14px;
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

  .novel-reader-container {
    background-color: rgb(250, 250, 250);
  }

  .toolbar-button span {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  .rotate-open {
    animation: rotate-open 0.3s forwards;
  }

  .rotate-close {
    animation: rotate-close 0.3s forwards;
  }

  @keyframes rotate-open {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(45deg);
    }
  }

  @keyframes rotate-close {
    from {
      transform: rotate(45deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  .comment-button {
    position: relative; /* 父元素相对定位，使绝对定位的子元素相对于此定位 */
    display: inline-block; /* 行内块元素，保证按钮和评论数量在同一行 */
    padding-right: 20px; /* 可根据实际情况调整按钮右侧空白 */
  }
  .comment-count {
    position: absolute; /* 绝对定位，根据父元素进行位置调整 */
    right: 63px; /* 放置在评论按钮左侧 */
    top: -3px;
    color: #c01313; /* 示例文字颜色，可根据设计需求修改 */
    font-size: 11px; /* 示例字体大小，可根据设计需求修改 */
  }

  .settings-toolbar {
    display: flex;
    position: fixed;
    flex-direction: column; /* 竖向排列 */
    align-items: flex-start; /* 居左显示 */
    padding: 20px;
    background-color: whitesmoke;
    margin-top: 25px;
    width: 100%;
  }

  .settings-toolbar button {
    padding: 5px 0;
    width: 100%; /* 占满一行 */
    text-align: left; /* 按钮标题靠左显示 */
    margin-bottom: 10px; /* 间距 */
  }

  .ps-container {
    display: flex;
    justify-content: space-between; /* 按钮和滑动开关两端对齐 */
    width: 100%; /* 占满一行 */
  }

  .ps-button {
    text-align: left; /* 按钮标题靠左显示 */
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:checked + .slider:before {
    transform: translateX(14px);
  }

  .slider.round {
    border-radius: 20px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
}
</style>
