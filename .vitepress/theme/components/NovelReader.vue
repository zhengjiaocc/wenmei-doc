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

    <transition name="navbar-slide">
      <div class="navbar" v-if="isNavBarVisible">
        <button @click="goToHome">主页</button>
      </div>
    </transition>

    <transition name="toolbar-slide">
      <div class="toolbar" v-if="isToolBarVisible">
        <button @click="showDirectory">目录</button>
      </div>
    </transition>

    <transition name="directory-slide">
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
        if (chapters.value.length > 0) {
          selectChapter(chapters.value[0].id); // 默认选择第一章
        }
      } catch (error) {
        console.error("获取章节目录失败:", error);
      }
    };

    const selectChapter = async (id) => {
      try {
        // 立即收起目录
        isDirectoryVisible.value = false;
        isToolBarVisible.value = false;

        const chapter = await getChapter(id);
        currentChapter.value = {
          title: chapter.chapterTitle || "未命名章节",
          wordCount: chapter.chapterContent ? chapter.chapterContent.length : 0,
        };
        currentContent.value = chapter.chapterContent || "";
        currentAdditionalInfo.value = chapter.additionalInfo || "";

        // 等待 DOM 更新后滚动到顶部
        await nextTick();
        document
          .querySelector(".content-area")
          .scrollTo({ top: 0, behavior: "smooth" });
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
      reverseChapters,
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
  background-color: rgb(247, 247, 247);
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
  top: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 20px; /* 增加内边距 */
  font-family: "Serif"; /* 使用 serif 字体 */
  font-size: 16px; /* 字体大小 */
  line-height: 1.6; /* 行间距 */
  color: #333; /* 字体颜色 */
}

.content-area p {
  margin: 1em 0; /* 段落上下间距 */
}

.additional-info {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: rgb(255, 255, 255);
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
  height: 55px;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.directory {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100vh * 9 / 10);
  background-color: white;
  color: black;
  display: flex;
  flex-direction: column;
  z-index: 10;
  overflow-y: auto;
  padding: 0 20px 20px 20px;
  border-radius: 35px 35px 0 0;
}

.directory-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: white;
  padding: 10px 0;
}

.directory-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid gray;
}

.directory-title {
  font-size: 14px;
  flex-grow: 1;
  text-align: left;
  padding: 10px 0;
}

.close-button {
  background: none;
  border: none;
  color: black;
  font-size: 25px;
  font-weight: bold;
  cursor: pointer;
}

.directory-controls {
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: space-between;
}

.reverse-button {
  margin-left: 10px;
  padding: 5px 10px;
}

.chapter-list {
  padding: 10px 0;
}

.chapter-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.chapter-list li {
  padding: 8px 0;
  cursor: pointer;
}

.chapter-list li:hover {
  background-color: #f0f0f0;
}

/* 添加过渡动画效果 */
.navbar-slide-enter-active,
.navbar-slide-leave-active,
.toolbar-slide-enter-active,
.toolbar-slide-leave-active,
.directory-slide-enter-active,
.directory-slide-leave-active {
  transition: transform 0.5s ease-in-out; /* 修改持续时间为0.5秒，使用ease-in-out缓动函数 */
}

.navbar-slide-enter {
  transform: translateY(-100%);
}

.navbar-slide-leave-to {
  transform: translateY(-100%);
}

.toolbar-slide-enter {
  transform: translateY(100%);
}

.toolbar-slide-leave-to {
  transform: translateY(100%);
}

.directory-slide-enter {
  transform: translateY(0%);
}

.directory-slide-leave-to {
  transform: translateY(100%);
}

</style>
