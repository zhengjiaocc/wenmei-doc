<template>
  <div class="novel-container" @click="toggleNavAndToolBar">
    <div class="chapter-info" :class="backgroundColor">
      <span class="chapter-title">{{ currentChapter.title.trim() }}</span>
      <span class="chapter-word-count">{{ currentChapter.wordCount }} 字</span>
    </div>

    <div
      class="content-area"
      :class="backgroundColor"
      :style="{ fontSize: fontSize + 'px' }"
    >
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <!-- 旋转的圆圈 -->
        <span class="loading-text">正在加载...</span>
        <!-- 加载文本 -->
      </div>
      <div v-html="currentContent" v-else></div>
      <div v-if="currentAdditionalInfo" class="additional-info">
        {{ currentAdditionalInfo }}
      </div>
    </div>

    <transition name="navbar-slide" @click.stop>
      <div class="navbar" v-if="isNavBarVisible">
        <button @click="goToHome">主页</button>
        <!-- 主页按钮 -->
        <div class="navbar-right">
          <button @click="toggleNavAndToolBar">更多</button>
          <!-- 其他按钮 -->
        </div>
      </div>
    </transition>

    <transition name="toolbar-slide">
      <div class="toolbar" v-if="isToolBarVisible">
        <button @click.stop="showDirectory">目录</button>
        <button @click.stop="showSettings">设置</button>
      </div>
    </transition>

    <transition name="directory-slide">
      <div class="directory" v-if="isDirectoryVisible" @click.stop>
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
              @click="(event) => selectChapter(chapter.id, event)"
            >
              {{ chapter.chapterTitle.trim() }}
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <transition name="settings-slide">
      <div class="settings" v-if="isSettingsVisible" @click.stop>
        <div class="settings-content">
          <div class="font-size-setting">
            <div class="slider-container">
              <span class="font-size-label">A-</span>
              <input
                id="fontSizeRange"
                type="range"
                min="12"
                max="24"
                step="2"
                v-model="fontSize"
              />
              <span class="font-size-label">A+</span>
            </div>
          </div>
          <div class="background-color-setting">
            <div class="color-selector">
              <div
                v-for="color in colors"
                :key="color.name"
                :class="[
                  'color-circle',
                  color.class,
                  { selected: backgroundColor === color.class },
                ]"
                @click="changeBackgroundColor(color.class)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { getAllChapterDirectory, getChapter } from "../utils/api";

export default {
  setup() {
    const isNavBarVisible = ref(false);
    const isToolBarVisible = ref(false);
    const isDirectoryVisible = ref(false);
    const isSettingsVisible = ref(false);
    const chapters = ref([]);
    const currentChapter = ref({ title: "", wordCount: 0 });
    const currentContent = ref("");
    const currentAdditionalInfo = ref("");
    const fontSize = ref(16);
    const backgroundColor = ref("color-white");
    const loading = ref(false); // 添加 loading 状态

    const colors = ref([
      { name: "White", class: "color-white", rgb: "rgb(245, 245, 245)" },
      { name: "Gray", class: "color-gray", rgb: "rgb(224, 224, 224)" },
      { name: "Peach", class: "color-peach", rgb: "rgb(252, 237, 208)" },
      { name: "Orange", class: "color-orange", rgb: "rgb(239, 198, 144)" },
      { name: "Green", class: "color-green", rgb: "rgb(201, 232, 200)" },
      {
        name: "Light Pink",
        class: "color-light-pink",
        rgb: "rgb(240, 218, 220)",
      },
    ]);

    const changeBackgroundColor = (colorClass) => {
      backgroundColor.value = colorClass;
    };

    const toggleNavAndToolBar = () => {
      if (!isSettingsVisible.value && !isDirectoryVisible.value) {
        isNavBarVisible.value = !isNavBarVisible.value;
        isToolBarVisible.value = !isToolBarVisible.value;
      }
    };

    const fetchChapters = async () => {
      loading.value = true; // 开始加载
      try {
        const data = await getAllChapterDirectory();
        chapters.value = data;
        if (chapters.value.length > 0) {
          selectChapter(chapters.value[0].id);
        }
      } catch (error) {
        console.error("获取章节目录失败:", error);
      } finally {
        loading.value = false; // 结束加载
      }
    };

    const selectChapter = async (id, event) => {
      if (event) {
        event.stopPropagation();
      }
      loading.value = true; // 开始加载
      try {
        isDirectoryVisible.value = false;
        isToolBarVisible.value = false;
        const chapter = await getChapter(id);
        currentChapter.value = {
          title: chapter.chapterTitle || "未命名章节",
          wordCount: chapter.chapterContent ? chapter.chapterContent.length : 0,
        };
        currentContent.value = chapter.chapterContent || "";
        currentAdditionalInfo.value = chapter.additionalInfo || "";

        // 直接滚动到顶部，不使用动画
        await nextTick();
        document.querySelector(".content-area").scrollTop = 0; // 修改这里
      } catch (error) {
        console.error(`获取章节 ${id} 失败:`, error);
      } finally {
        loading.value = false; // 结束加载
      }
    };

    const showDirectory = (event) => {
      event.stopPropagation();
      isNavBarVisible.value = false;
      isToolBarVisible.value = false;
      isDirectoryVisible.value = true;
    };

    const hideDirectory = () => {
      isDirectoryVisible.value = false;
      isToolBarVisible.value = false;
      isNavBarVisible.value = false;
    };

    const showSettings = (event) => {
      event.stopPropagation();
      isNavBarVisible.value = false;
      isToolBarVisible.value = false;
      isSettingsVisible.value = true;
    };

    const hideSettings = () => {
      isSettingsVisible.value = false;
      isToolBarVisible.value = false;
      isNavBarVisible.value = false;
    };

    const goToHome = () => {
      window.location.href = "/"; // 跳转到主页
    };

    const reverseChapters = () => {
      chapters.value.reverse();
    };

    // 点击事件处理函数
    const handleClickOutside = (event) => {
      const directory = document.querySelector(".directory");
      const settings = document.querySelector(".settings");
      const toolbar = document.querySelector(".toolbar");

      if (
        directory &&
        !directory.contains(event.target) &&
        isDirectoryVisible.value
      ) {
        hideDirectory();
      }
      if (
        settings &&
        !settings.contains(event.target) &&
        isSettingsVisible.value
      ) {
        hideSettings();
      }
    };

    onMounted(() => {
      fetchChapters();
      document.addEventListener("click", handleClickOutside); // 添加全局点击事件
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside); // 清除全局点击事件
    });

    return {
      isNavBarVisible,
      isToolBarVisible,
      isDirectoryVisible,
      isSettingsVisible,
      chapters,
      currentChapter,
      currentContent,
      currentAdditionalInfo,
      fontSize,
      loading, // 返回 loading 状态
      toggleNavAndToolBar,
      selectChapter,
      showDirectory,
      hideDirectory,
      goToHome,
      reverseChapters,
      showSettings,
      hideSettings,
      fontSize,
      backgroundColor,
      colors,
      changeBackgroundColor,
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
  height: 50px;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between; /* 修改为space-between以将主页按钮放到左侧 */
  align-items: center;
  padding: 0 10px;
}

.toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 18px 18px 0 0;
}

.directory {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100vh * 8.8 / 10);
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

.settings {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 25%; /* 高度为屏幕的1/6 */
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 35px 35px 0 0;
  z-index: 10;
  width: 100%;
  padding: 20px;
}

.settings-content {
  text-align: center;
  font-size: 16px;
}

.settings-slide-enter-active,
.settings-slide-leave-active {
  transition: transform 0.5s ease-in-out;
}

.settings-slide-enter {
  transform: translateY(100%);
}

.settings-slide-leave-to {
  transform: translateY(100%);
}
.slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

input[type="range"] {
  width: 200px;
  margin: 0 10px;
}

.font-size-label {
  font-size: 14px;
  color: #333;
}

.background-color-setting {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.color-selector {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}

.color-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

/* 选中状态 */
.color-circle.selected {
  border: 2px solid #4285f4; /* 蓝色外边框，表示已选中 */
  box-shadow: 0 0 5px rgba(66, 133, 244, 0.5); /* 可选的阴影效果 */
}

.color-white {
  background-color: rgb(245, 245, 245);
}

.color-gray {
  background-color: rgb(224, 224, 224);
}

.color-peach {
  background-color: rgb(252, 237, 208);
}

.color-orange {
  background-color: rgb(239, 198, 144);
}

.color-green {
  background-color: rgb(201, 232, 200);
}

.color-light-pink {
  background-color: rgb(240, 218, 220);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-spinner {
  border: 2px solid rgba(128, 128, 128, 0.5); /* 浅灰色边框 */
  border-left-color: gray; /* 左侧为深灰色 */
  border-radius: 50%;
  width: 16px; /* 圆圈的宽度 */
  height: 16px; /* 圆圈的高度 */
  animation: spin 1s linear infinite; /* 添加旋转动画 */
  margin-right: 5px; /* 圆圈与文本的间距 */
}

.loading-text {
  font-size: 0.9em; /* 较小的文本大小 */
  color: gray; /* 文本颜色为灰色 */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>