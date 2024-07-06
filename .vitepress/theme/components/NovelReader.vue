<template>
  <div class="novel-reader" @click="handleClickOutsideSidebar">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <h1 class="novel-title">{{ novelTitle }}</h1>
      <!-- 在手机端显示章节名称和字数 -->
      <div class="chapter-info" v-if="isMobile">
        <span>{{ currentChapter.title.replace(/\s+第/g, '第') }}</span>
        <span>{{ currentChapter.wordCount }}字</span>
      </div>
    </div>
    
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }" ref="sidebar">
      <div class="sidebar-header">
        <h2>目录</h2>
        <button @click="closeSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="sidebar-content">
        <!-- 目录 -->
        <div class="directory" style="width: 25vw;">
          <ul class="chapter-list">
            <li v-for="(chapter, index) in filteredChapters" :key="index" @click="goToChapter(index)">
              {{ chapter.title }}
            </li>
          </ul>
        </div>
        
      </div>
    </div>
    
    <!-- 章节内容区域 -->
    <div class="chapter-content" :style="{ fontSize: fontSize + 'px' }">
      <div v-if="isLoading" class="loading-indicator">
        <span>Loading...</span>
      </div>
      <div v-else class="content-text">
        <pre v-html="currentChapter.content"></pre>
      </div>
    </div>
    
    <!-- 竖向浮动工具栏，仅在非手机端显示 -->
    <div class="floating-toolbar" v-if="!isMobile">
      <button class="toolbar-btn" @click="prevChapter" :disabled="currentIndex === 0">
        <i class="fas fa-arrow-up"></i>
        <span>上一章</span>
      </button>
      <button class="toolbar-btn" @click="nextChapter" :disabled="currentIndex === chapters.length - 1">
        <i class="fas fa-arrow-down"></i>
        <span>下一章</span>
      </button>
      <!-- 工具栏中的目录弹出按钮 -->
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
        <span>目录</span>
      </button>
    </div>
  </div>
</template>

<script>
import novelData from '/docs/novel/chapters.json'; // 替换为实际路径

export default {
  data() {
    return {
      chapters: [],
      novelTitle: '问题妹妹恋上我', // 替换为你的小说标题
      currentIndex: 0,
      isSidebarOpen: false,
      isLoading: false,
      fontSize: 16, // 初始字号
      isMobile: false // 标记是否为手机端
    };
  },
  computed: {
    currentChapter() {
      return this.chapters[this.currentIndex] || {};
    },
    filteredChapters() {
      // 这里去掉了搜索功能的相关逻辑
      return this.chapters;
    }
  },
  created() {
    this.chapters = novelData; // 设置章节数据
    this.checkIfMobile(); // 初始化检测是否为手机端
    window.addEventListener('resize', this.checkIfMobile); // 监听窗口大小变化
  },
  destroyed() {
    window.removeEventListener('resize', this.checkIfMobile); // 移除窗口大小变化监听
  },
  methods: {
    nextChapter() {
      if (this.currentIndex < this.chapters.length - 1) {
        this.currentIndex++;
      }
    },
    prevChapter() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    goToChapter(index) {
      this.currentIndex = index;
      this.closeSidebar();
    },
    handleClickOutsideSidebar(event) {
      // 如果侧边栏是打开状态并且点击的不是侧边栏区域，则关闭侧边栏
      if (this.isSidebarOpen && !this.$refs.sidebar.contains(event.target)) {
        this.closeSidebar();
      }
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768; // 媒体查询中使用的手机端宽度
    }
  }
};
</script>

<style scoped>
/* 顶部导航栏样式 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  color: #333;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 20px;
}

.novel-title {
  font-size: 24px;
}

.chapter-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #666;
}

.word-count {
  font-size: 12px;
  color: #999;
  margin-right: 20px;
}

/* 侧边栏样式 */
.sidebar {
  position: fixed;
  top: 0;
  left: -25vw; /* 初始状态从左侧隐藏，占1/4视口宽度 */
  width: 25vw; /* 优化宽度为1/4视口宽度 */
  height: 100%;
  background-color: #f9f9f9;
  color: #333;
  transition: left 0.3s ease; /* 添加左侧滑出的过渡效果 */
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 0 10px 10px 0;
  overflow-y: auto; /* 添加滚动条功能 */
  display: none; /* 初始隐藏 */
}

.sidebar-open {
  left: 0; /* 打开时从左侧滑出 */
  display: block; /* 显示侧边栏内容 */
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.sidebar-content {
  padding: 0 20px;
}

.directory {
  margin-bottom: 20px;
}

.chapter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chapter-list li {
  padding: 10px 20px; /* 增加左右内边距 */
  cursor: pointer;
  transition: background 0.3s;
  border-bottom: 1px solid #eee;
}

.chapter-list li:hover {
  background-color: #e0e0e0;
}

/* 章节内容区域样式 */
.chapter-content {
  padding: 20px;
  margin: 20px;
  background-color: #f2f2f2;
  flex: 1;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.content-text {
  line-height: 1.6;
  color: #333;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-all; /* 确保长单词和长句子换行 */
  max-width: 100%; /* 设置最大宽度 */
}

.content-text pre {
  max-width: 100%; /* 设置最大宽度 */
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-all;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* 调整为适合的高度 */
  font-size: 18px;
  color: #666;
}

/* 竖向浮动工具栏样式 */
.floating-toolbar {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toolbar-btn {
  width: 60px;
  height: 60px;
  background-color: #f2f2f2;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
}

.toolbar-btn:hover {
  background-color: #e0e0e0;
  color: #000000;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* 工具栏中的目录弹出按钮样式 */
.sidebar-toggle {
  width: 60px;
  height: 60px;
  background: #ffffff;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
  border-radius: 10px;
}

.sidebar-toggle:hover {
  background-color: #f2f2f2;
  color: #000000;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* 媒体查询：在小于等于768px宽度时应用以下样式 */
@media (max-width: 768px) {
  .chapter-info {
    display: none; /* 隐藏章节信息 */
  }
  .top-bar {
    justify-content: center; /* 中心对齐 */
  }
  .sidebar {
    width: 100%; /* 在手机端占据整个宽度 */
    left: -100%; /* 隐藏侧边栏 */
    border-radius: 0; /* 移除圆角 */
  }
  .sidebar-open {
    left: 0; /* 打开时从左侧滑出 */
  }
  .sidebar-header {
    padding: 0 10px; /* 减小侧边栏头部内边距 */
  }
  .directory {
    width: 100%; /* 目录宽度占满 */
  }
  .floating-toolbar {
    display: none; /* 隐藏竖向浮动工具栏 */
  }
}
</style>
