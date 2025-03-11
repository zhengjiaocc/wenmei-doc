<template>
  <div
    ref="fullScreenContainer"
    class="novel-container"
    @click="toggleNavAndToolBar"
    :class="backgroundColor"
  >
    <div v-if="!loading" class="chapter-info" :class="backgroundColor">
      <div class="chapter-title-container">
        <span class="chapter-symbol"></span>
        <!-- 使用伪元素 -->
        <span class="chapter-title">{{ currentChapter.title.trim() }}</span>
      </div>
      <span class="chapter-word-count">{{ currentChapter.wordCount }} 字</span>
    </div>

    <div
      class="content-area"
      :class="backgroundColor"
      :style="{ fontSize: fontSize + 'px' }"
    >
      <div v-if="loading" class="loading-container">
        <span class="loading-text">正在加载中，请稍候...</span>
      </div>
      <div v-html="currentContent" v-else></div>
      <div v-if="currentAdditionalInfo" class="additional-info">
        {{ currentAdditionalInfo }}
      </div>
    </div>

    <transition name="navbar-slide" @click.stop>
      <div class="navbar" v-if="isNavBarVisible">
        <button @click="goToHome">
          <font-awesome-icon :icon="['fas', 'house']" />
        </button>
        <!-- 主页按钮 -->
        <div class="navbar-right">
          <button @click="toggleNavAndToolBar">更多</button>
          <!-- 其他按钮 -->
        </div>
      </div>
    </transition>

    <transition name="toolbar-slide" @click.stop>
      <div class="toolbar" v-if="isToolBarVisible">
        <button @click.stop="goToHomeAndExitFullscreen">
          <div class="button-content">
            <span class="button-icon">
              <font-awesome-icon :icon="['fas', 'angle-left']"
            /></span>
            <span class="button-text">返回</span>
          </div>
        </button>
        <button @click.stop="showDirectory">
          <div class="button-content">
            <span class="button-icon"
              ><font-awesome-icon :icon="['fas', 'bars']"
            /></span>
            <span class="button-text">目录</span>
          </div>
        </button>
        <button @click.stop="showSettings">
          <div class="button-content">
            <span class="button-icon"
              ><font-awesome-icon :icon="['fas', 'a']"
            /></span>
            <!-- 设置图标 -->
            <span class="button-text">设置</span>
          </div>
        </button>
        <button @click.stop="toggleFullScreen">
          <div class="button-content">
            <span class="button-icon">
              <font-awesome-icon :icon="['fas', 'expand']" v-if="!isFullscreen"/>
              <font-awesome-icon :icon="['fas', 'compress']" v-else/>
            </span>
            <span class="button-text">{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
          </div>
        </button>
      </div>
    </transition>

    <transition name="directory-slide">
      <div class="directory" v-if="isDirectoryVisible" @click.stop>
        <div class="directory-header">
          <div class="directory-title-container">
            <span class="directory-title">目录</span>

            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索章节..."
              @input="handleSearch"
              class="search-input"
            />
            <font-awesome-icon
              class="search-icon"
              :icon="['fas', 'magnifying-glass']"
            />

            <button class="close-button" @click="hideDirectory">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          <div class="directory-controls">
            <span>共{{ filteredChapters.length }}章</span>

            <button class="reverse-button" @click="reverseChapters">
              倒序
            </button>
          </div>
        </div>

        <div class="chapter-list">
          <ul>
            <li
              v-for="chapter in filteredChapters"
              :key="chapter.id"
              @click="(event) => selectChapter(chapter.id, event)"
              :class="{ 'current-chapter': chapter.id === currentChapter.id }"
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
                step="1"
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
          <div class="page-turning-setting">
            <span class="setting-label">翻页模式</span>
            <div class="radio-group">
              <label>
                <input
                  type="radio"
                  v-model="pageTurningMode"
                  value="horizontal"
                />
                水平翻页
              </label>
              <label>
                <input
                  type="radio"
                  v-model="pageTurningMode"
                  value="vertical"
                />
                上下翻页
              </label>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import { getAllChapterDirectory, getChapter } from "../utils/api";
import { debounce } from "lodash-es";
import { useChapterCache } from "../composables/useChapterCache";
import { useFullscreen } from "../composables/useFullscreen";
import { useLocalStorage } from "../composables/useLocalStorage";
import { useSwipeGesture } from "../composables/useSwipeGesture";

export default {
  setup() {
    // 使用组合式函数
    const { 
      cache: chapterCache, 
      addToCache, 
      getFromCache,
      addToPreloadQueue,
      startPreload 
    } = useChapterCache();
    const { 
      isFullscreen,
      tryFullScreen, 
      exitFullScreen, 
      handleFullscreenChange 
    } = useFullscreen();
    const { saveSettings, loadSettings, saveProgress, loadProgress } = useLocalStorage();
    const { startX, startY, handleTouchStart, handleTouchEnd } = useSwipeGesture();

    // 状态管理
    const isNavBarVisible = ref(false);
    const isToolBarVisible = ref(false);
    const isDirectoryVisible = ref(false);
    const isSettingsVisible = ref(false);
    const chapters = ref([]);
    const currentChapter = ref({ id: "", title: "", wordCount: 0 });
    const currentContent = ref("");
    const currentAdditionalInfo = ref("");
    const fontSize = ref(16);
    const backgroundColor = ref("color-white");
    const loading = ref(false);
    const pageTurningMode = ref("horizontal");
    const retryCount = ref(0);
    const maxRetries = 3;

    // 计算属性
    const filteredChapters = computed(() => {
      if (!searchQuery.value) return chapters.value;
      return chapters.value.filter((chapter) =>
        chapter.chapterTitle
          .trim()
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    const colors = ref([
      { name: "White", class: "color-white", rgb: "rgb(245, 245, 245)" },
      { name: "Gray", class: "color-gray", rgb: "rgb(224, 224, 224)" },
      { name: "Peach", class: "color-peach", rgb: "rgb(252, 237, 208)" },
      { name: "Orange", class: "color-orange", rgb: "rgb(239, 198, 144)" },
      { name: "Green", class: "color-green", rgb: "rgb(201, 232, 200)" },
      { name: "Light Pink", class: "color-light-pink", rgb: "rgb(240, 218, 220)" },
    ]);

    const fullScreenContainer = ref(null);

    // 方法
    const goToHomeAndExitFullscreen = () => {
      exitFullScreen();
      goToHome();
    };

    const changeBackgroundColor = (colorClass) => {
      backgroundColor.value = colorClass;
      saveSettings({ fontSize: fontSize.value, backgroundColor: colorClass, pageTurningMode: pageTurningMode.value });
    };

    const toggleNavAndToolBar = () => {
      if (!isSettingsVisible.value && !isDirectoryVisible.value) {
        const newState = !(isNavBarVisible.value && isToolBarVisible.value);
        isNavBarVisible.value = newState;
        isToolBarVisible.value = newState;
      }
    };

    // 加载章节数据
    const fetchChapters = async () => {
      loading.value = true;
      try {
        const data = await getAllChapterDirectory();
        chapters.value = data;
        const lastChapterId = loadProgress();
        if (lastChapterId) {
          await selectChapter(lastChapterId);
        } else if (data.length > 0) {
          await selectChapter(data[0].id);
        }
      } catch (error) {
        console.error("获取章节目录失败:", error);
        if (retryCount.value < maxRetries) {
          retryCount.value++;
          setTimeout(fetchChapters, 1000 * retryCount.value);
        }
      } finally {
        loading.value = false;
      }
    };

    // 预加载相邻章节
    const preloadAdjacentChapters = async (currentId) => {
      const currentIndex = chapters.value.findIndex((chap) => chap.id === currentId);
      const chaptersToPreload = [];

      // 预加载前后各两章
      for (let i = 1; i <= 2; i++) {
        if (currentIndex - i >= 0) {
          chaptersToPreload.push(chapters.value[currentIndex - i].id);
        }
        if (currentIndex + i < chapters.value.length) {
          chaptersToPreload.push(chapters.value[currentIndex + i].id);
        }
      }

      // 添加到预加载队列
      if (chaptersToPreload.length > 0) {
        addToPreloadQueue(chaptersToPreload);
        startPreload(getChapter);
      }
    };

    // 选择章节
    const selectChapter = async (id, event) => {
      if (event) {
        event.stopPropagation();
      }
      loading.value = true;

      try {
        isDirectoryVisible.value = false;
        isToolBarVisible.value = false;

        let chapter = getFromCache(id);
        if (!chapter) {
          chapter = await getChapter(id);
          addToCache(id, chapter);
        }

        currentChapter.value = {
          id: chapter.id,
          title: chapter.chapterTitle || "未命名章节",
          wordCount: chapter.chapterContent?.length || 0,
        };
        currentContent.value = chapter.chapterContent || "";
        currentAdditionalInfo.value = chapter.additionalInfo || "";
        
        await nextTick();
        document.querySelector(".content-area")?.scrollTo({ top: 0, behavior: "smooth" });
        saveProgress(id);

        // 选择完章节后立即开始预加载
        preloadAdjacentChapters(id);
      } catch (error) {
        console.error(`获取章节 ${id} 失败:`, error);
      } finally {
        loading.value = false;
      }
    };

    // 章节导航
    const showDirectory = (event) => {
      event.stopPropagation();
      isNavBarVisible.value = false;
      isToolBarVisible.value = false;
      isDirectoryVisible.value = true;

      nextTick(() => {
        document.querySelector(".current-chapter")?.scrollIntoView({
          block: "center",
          behavior: "smooth"
        });
      });
    };

    const hideDirectory = () => {
      isDirectoryVisible.value = false;
      isToolBarVisible.value = true;
      isNavBarVisible.value = true;
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
      window.location.href = "/";
    };

    const reverseChapters = () => {
      chapters.value.reverse();
      nextTick(() => {
        document.querySelector(".current-chapter")?.scrollIntoView({
          block: "center",
          behavior: "smooth"
        });
      });
    };

    // 事件处理
    const handleClickOutside = (event) => {
      const directory = document.querySelector(".directory");
      const settings = document.querySelector(".settings");

      if (directory && !directory.contains(event.target) && isDirectoryVisible.value) {
        hideDirectory();
      }
      if (settings && !settings.contains(event.target) && isSettingsVisible.value) {
        hideSettings();
      }
    };

    // 添加触摸事件处理
    const handleTouchEndWrapper = async (event) => {
      if (loading.value) return; // 如果正在加载，不处理滑动
      
      const swipeResult = handleTouchEnd(event);
      if (swipeResult.isHorizontalSwipe) {
        if (swipeResult.direction === 'right') {
          await goToPreviousChapter();
        } else {
          await goToNextChapter();
        }
      }
    };

    const goToPreviousChapter = async () => {
      if (!currentChapter.value.id) return;
      const currentIndex = chapters.value.findIndex(
        (chapter) => chapter.id === currentChapter.value.id
      );
      if (currentIndex > 0) {
        await selectChapter(chapters.value[currentIndex - 1].id);
      }
    };

    const goToNextChapter = async () => {
      if (!currentChapter.value.id) return;
      const currentIndex = chapters.value.findIndex(
        (chapter) => chapter.id === currentChapter.value.id
      );
      if (currentIndex < chapters.value.length - 1) {
        await selectChapter(chapters.value[currentIndex + 1].id);
      }
    };

    const searchQuery = ref("");
    const handleSearch = debounce(() => {}, 300);

    const handleOrientationChange = () => {
      if (window.orientation === 90 || window.orientation === -90) {
        // 如果是横屏，显示提示
        alert('请使用竖屏阅读以获得最佳体验');
      }
    };

    // 生命周期钩子
    onMounted(() => {
      loadSettings();
      fetchChapters();
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchend", handleTouchEndWrapper);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      window.addEventListener("orientationchange", handleOrientationChange);
      // 初始检查屏幕方向
      handleOrientationChange();
      // 延迟一下再尝试进入全屏，确保DOM已经完全加载
      setTimeout(() => {
        tryFullScreen();
      }, 100);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEndWrapper);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
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
      loading,
      toggleNavAndToolBar,
      selectChapter,
      showDirectory,
      hideDirectory,
      goToHome,
      reverseChapters,
      showSettings,
      hideSettings,
      backgroundColor,
      colors,
      changeBackgroundColor,
      pageTurningMode,
      filteredChapters,
      searchQuery,
      handleSearch,
      fullScreenContainer,
      exitFullScreen,
      goToHomeAndExitFullscreen,
    };
  },
};
</script>

<style scoped>
@media screen and (orientation: landscape) {
  .novel-container {
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 100vh;
    height: 100vw;
    position: absolute;
    top: 100%;
    left: 0;
  }
}

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
  height: 71px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  padding-top: 20px;
}

.chapter-title {
  font-size: 14px;
}

.chapter-word-count {
  font-size: 12px;
}

.content-area {
  position: absolute;
  top: 70px;
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
  height: 10vh;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between; /* 修改为space-between以将主页按钮放到左侧 */
  align-items: center;
  padding: 0 10px;
  padding-top: 20px;
}

.toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 14vh;
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

.navbar-hide {
  transform: translateY(-100%); /* 隐藏状态 */
  transition: none; /* 禁用过渡 */
}

.toolbar-hide {
  transform: translateY(100%); /* 隐藏状态 */
  transition: none; /* 禁用过渡 */
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

.page-turning-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.setting-label {
  font-size: 16px;
  color: #333;
}

.radio-group {
  display: flex;
  gap: 10px;
}

.radio-group label {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.radio-group input[type="radio"] {
  margin-right: 5px;
}

.current-chapter {
  color: #4285f4;
  font-weight: bold; /* 可选：让当前章节加粗 */
}

.search-input {
  flex-grow: 1; /* 占用剩余的所有空间 */
  margin-left: 10px;
}
.chapter-title-container {
  display: flex; /* 使用 flexbox */
  align-items: center; /* 垂直居中对齐 */
  color: #666;
}

.chapter-symbol {
  display: inline-block;
  width: 9px; /* 符号宽度 */
  height: 9px; /* 符号高度 */
  background-color: transparent; /* 透明背景 */
  border: 2px solid #666; /* 符号边框颜色 */
  clip-path: polygon(0 0, 100% 0, 0 100%); /* 创建镂空的形状 */
  margin-right: 3px; /* 与标题之间的间距 */
  transform: rotate(315deg); /* 旋转成类似小于号的直角 */
}

.button-content {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 水平居中 */
}

.button-icon {
  font-size: 17px; /* 调整图标大小 */
  margin-bottom: 3px; /* 图标与文字之间的间距 */
}

.button-text {
  font-size: 12px; /* 调整文字大小 */
}

.search-icon {
  margin-right: 10px; /* 添加5px的右边距 */
}
</style>

