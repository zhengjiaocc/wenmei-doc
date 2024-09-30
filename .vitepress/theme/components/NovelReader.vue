<template>
  <div class="novel-container" @click="toggleNavBar">
    <div class="chapter-info">
      <span class="chapter-title">{{ currentChapter.title.trim() }}</span>
      <span class="chapter-word-count">{{ currentChapter.wordCount }} 字</span>
    </div>

    <div class="content-area">
      <div v-html="currentContent"></div>
      <div v-if="currentAdditionalInfo" class="additional-info">
        {{ currentAdditionalInfo }}
      </div>
    </div>

    <transition name="slide">
      <div class="navbar" v-if="isNavBarVisible">
        <button @click="goToHome">主页</button>
      </div>
    </transition>

    <transition name="slide">
      <div class="toolbar" v-if="isToolBarVisible">
        <button @click="showDirectory">目录</button>
      </div>
    </transition>

    <transition name="slide">
      <div class="directory" v-if="isDirectoryVisible">
        <div class="directory-header">
          <div class="directory-title-container">
            <span class="directory-title">目录</span>
            <button class="close-button" @click="hideDirectory">×</button>
          </div>
          <div class="directory-controls">
            <span>共: {{ chapters.length }}章</span>
            <button class="reverse-button" @click="reverseChapters">
              倒序
            </button>
          </div>
        </div>
        <div class="chapter-list">
          <ul>
            <li
              v-for="chapter in chapters"
              :key="chapter.id"
              @click="selectChapter(chapter.id)"
            >
              {{ chapter.chapterTitle.trim() }}
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { getAllChapterDirectory, getChapter } from "../utils/api";

export default {
  setup() {
    const isNavBarVisible = ref(false);
    const isToolBarVisible = ref(true);
    const isDirectoryVisible = ref(false);
    const chapters = ref([]);
    const currentChapter = ref({ title: "", wordCount: 0 });
    const currentContent = ref("");
    const currentAdditionalInfo = ref("");

    const toggleNavBar = () => {
      if (!isNavBarVisible.value && !isToolBarVisible.value) {
        isNavBarVisible.value = true;
        isToolBarVisible.value = true;
      } else {
        isNavBarVisible.value = false;
        isToolBarVisible.value = false;
      }
    };

    const fetchChapters = async () => {
      try {
        const data = await getAllChapterDirectory();
        chapters.value = data;
        console.log("获取的章节数据:", chapters.value);
        if (chapters.value.length > 0) {
          selectChapter(chapters.value[0].id); // 默认选择第一章
        }
      } catch (error) {
        console.error("获取章节目录失败:", error);
      }
    };

    const selectChapter = async (id) => {
      try {
        const chapter = await getChapter(id);
        currentChapter.value = {
          title: chapter.chapterTitle || "未命名章节",
          wordCount: chapter.chapterContent ? chapter.chapterContent.length : 0,
        };
        currentContent.value = chapter.chapterContent || "";
        currentAdditionalInfo.value = chapter.additionalInfo || "";
        console.log("当前章节内容:", currentContent.value);
        console.log("当前章节附加信息:", currentAdditionalInfo.value);
        isDirectoryVisible.value = false;
        isToolBarVisible.value = false;
      } catch (error) {
        console.error(`获取章节 ${id} 失败:`, error);
      }
    };

    const showDirectory = () => {
      isNavBarVisible.value = false;
      isToolBarVisible.value = false;
      isDirectoryVisible.value = true;
    };

    const hideDirectory = () => {
      isDirectoryVisible.value = false;
      isToolBarVisible.value = true;
    };

    const goToHome = () => {
      alert("返回主页！");
    };

    const reverseChapters = () => {
      chapters.value.reverse(); // 反转章节顺序
    };

    fetchChapters();

    onMounted(() => {
      document.addEventListener("click", handleClickOutsideSettings);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutsideSettings);
    });

    return {
      isNavBarVisible,
      isToolBarVisible,
      isDirectoryVisible,
      chapters,
      currentChapter,
      currentContent,
      currentAdditionalInfo,
      toggleNavBar,
      selectChapter,
      showDirectory,
      hideDirectory,
      goToHome,
      reverseChapters, // 导出反转章节的函数
    };
  },
};
</script>

<style scoped>
.novel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(247, 247, 247); /* 修改背景颜色 */
  color: black;
  overflow: hidden;
}

.chapter-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: #f9f9f9;
}

.chapter-title {
  font-size: 14px;
}

.chapter-word-count {
  font-size: 12px;
}

.content-area {
  position: absolute;
  top: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 10px;
}

.additional-info {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: rgb(255, 255, 255); /* 修改为白色 */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px;
}

.toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: rgb(255, 255, 255); /* 修改为白色 */
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.directory {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100vh * 9 / 10); /* 修改为占据视口的90% */

  background-color: white; /* 背景颜色为白色 */
  color: black; /* 字体颜色为黑色 */
  display: flex;
  flex-direction: column; /* 垂直布局 */
  z-index: 10; /* 确保目录在上方 */
  overflow-y: auto; /* 允许垂直滚动 */
  padding: 0 20px 20px 20px;
  border-radius: 35px 35px 0 0;
}

.directory-header {
  position: sticky; /* 固定头部 */
  top: 0; /* 距离顶部 0 */
  z-index: 20; /* 确保头部在上方 */
  background-color: white; /* 设置头部背景色为白色 */
  padding: 10px 0; /* 增加上下内边距 */
}

.directory-title-container {
  display: flex; /* 使用flexbox */
  justify-content: space-between; /* 左右分布 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 宽度100% */
  border-bottom: 1px solid gray;
}

.directory-title {
  font-size: 14px; /* 字体大小 */
  flex-grow: 1; /* 使标题占据剩余空间 */
  text-align: left; /* 左对齐 */
  padding: 10px 0;
}

.close-button {
  background: none; /* 去掉默认样式 */
  border: none; /* 去掉边框 */
  color: black; /* 字体颜色 */
  font-size: 25px; /* 修改为14px */
  font-weight: bold;
  cursor: pointer; /* 鼠标悬停为手型 */
}

.directory-controls {
  display: flex; /* 水平排列 */
  align-items: center; /* 垂直居中 */
  font-size: 14px; /* 修改为14px */
  justify-content: space-between; /* 分布对齐 */
}

.reverse-button {
  margin-left: 10px; /* 按钮之间留出一些空间 */
  padding: 5px 10px; /* 按钮内边距 */
}

.chapter-list {
  padding: 10px 0; /* 为章节列表添加上下内边距 */
}

.chapter-list ul {
  list-style-type: none; /* 去掉列表样式 */
  padding: 0; /* 去掉内边距 */
  margin: 0; /* 去掉外边距 */
}

.chapter-list li {
  padding: 8px 0; /* 为每个章节项添加上下内边距 */
  cursor: pointer; /* 鼠标悬停为手型 */
}

.chapter-list li:hover {
  background-color: #f0f0f0; /* 鼠标悬停时的背景色 */
}

/* 添加过渡动画效果 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease-in-out; /* 修改持续时间为0.5秒，使用ease-in-out缓动函数 */
}

.slide-enter {
  transform: translateY(-100%);
}

.slide-leave-to {
  transform: translateY(-100%);
}
</style>

