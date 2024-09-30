<template>
  <div class="novel-container" @click="toggleNavBar">
    <div class="chapter-info">
      <span class="chapter-title">{{ currentChapter.title }}</span>
      <span class="chapter-word-count">{{ currentChapter.wordCount }} 字</span>
    </div>

    <div class="content-area">
      <div v-html="currentContent"></div>
      <!-- 使用 v-html 渲染内容 -->
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
        <button @click="showSettings">设置</button>
      </div>
    </transition>

    <transition name="slide">
      <div class="directory" v-if="isDirectoryVisible">
        <div class="directory-header">
          <span class="directory-title">目录</span>
          <button class="close-button" @click="hideDirectory">×</button>
        </div>
        <div class="directory-info">
          <span>总章节数: {{ chapters.length }}</span>
          <button @click="toggleOrder">倒序</button>
        </div>
        <ul>
          <li
            v-for="chapter in chapters"
            :key="chapter.id"
            @click="selectChapter(chapter.id)"
          >
            {{ chapter.chapterTitle }}
          </li>
        </ul>
      </div>
    </transition>

    <transition name="slide">
      <div class="settings" v-if="isSettingsVisible">
        <div class="settings-list" @click.stop>
          <div class="setting-item">
            <span class="setting-title">翻页模式设置:</span>
            <button @click="toggleContentMode">切换翻页模式</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { getDirectory, getChapter } from "../utils/api"; // 导入 API 方法

export default {
  setup() {
    const isNavBarVisible = ref(false);
    const isToolBarVisible = ref(true); // 默认显示工具栏
    const isDirectoryVisible = ref(false);
    const isSettingsVisible = ref(false); // 是否显示设置列表
    const chapters = ref([]);
    const currentChapter = ref({ title: "", wordCount: 0 });
    const currentContent = ref(""); // 小说正文内容
    const currentAdditionalInfo = ref(""); // 附加信息内容

    const toggleNavBar = () => {
      // 只有在工具栏和导航栏都收起的情况下才能呼出
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
        const data = await getDirectory(); // 获取章节目录
        chapters.value = data.records; // 保存章节数据
        console.log("获取的章节数据:", chapters.value); // 调试信息
        if (chapters.value.length > 0) {
          selectChapter(chapters.value[0].id); // 默认选择第一章
        }
      } catch (error) {
        console.error("获取章节目录失败:", error);
      }
    };

    const selectChapter = async (id) => {
      try {
        const chapter = await getChapter(id); // 根据 ID 获取章节内容
        // 更新当前章节信息
        currentChapter.value = {
          title: chapter.chapterTitle,
          wordCount: chapter.chapterContent.length,
        };
        // 更新当前章节内容
        currentContent.value = chapter.chapterContent; // 小说正文
        currentAdditionalInfo.value = chapter.additionalInfo; // 附加信息
        console.log("当前章节内容:", currentContent.value); // 调试信息
        console.log("当前章节附加信息:", currentAdditionalInfo.value); // 调试信息
        isDirectoryVisible.value = false; // 选择章节后关闭目录
        isToolBarVisible.value = false; // 选择章节后隐藏工具栏
        isSettingsVisible.value = false; // 隐藏设置列表
      } catch (error) {
        console.error(`获取章节 ${id} 失败:`, error); // 错误处理
      }
    };

    const showDirectory = () => {
      isNavBarVisible.value = false; // 打开目录时收起顶部状态栏
      isToolBarVisible.value = false; // 隐藏工具栏
      isDirectoryVisible.value = true; // 显示目录
      isSettingsVisible.value = false; // 确保设置列表关闭
    };

    const hideDirectory = () => {
      isDirectoryVisible.value = false; // 隐藏目录
      isToolBarVisible.value = true; // 关闭目录时显示工具栏
    };

    const showSettings = (event) => {
      event.stopPropagation(); // 阻止事件冒泡
      isToolBarVisible.value = false; // 隐藏工具栏
      isSettingsVisible.value = true; // 显示设置列表
    };

    const handleClickOutsideSettings = (event) => {
  const settingsElement = document.querySelector(".settings");
  if (settingsElement && !settingsElement.contains(event.target)) {
    hideSettings(); // 调用隐藏设置的方法
    isToolBarVisible.value = false; // 直接隐藏工具栏
  }
};

const hideSettings = () => {
  isSettingsVisible.value = false; // 隐藏设置列表
  // 不再需要在这里设置工具栏可见性
};


    const toggleContentMode = () => {
      // 实现翻页模式切换逻辑
      alert("切换翻页模式！");
    };

    const goToHome = () => {
      // 实现返回主页的逻辑
      alert("返回主页！");
    };

    const toggleOrder = () => {
      chapters.value.reverse(); // 倒序显示章节
    };

    // 组件加载时获取章节数据
    fetchChapters();

    // 组件卸载时移除点击事件监听
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
      isSettingsVisible, // 返回是否显示设置列表的状态
      chapters,
      currentChapter,
      currentContent,
      currentAdditionalInfo, // 返回附加信息
      toggleNavBar,
      selectChapter,
      showDirectory,
      hideDirectory,
      showSettings,
      hideSettings, // 返回隐藏设置列表的方法
      toggleContentMode,
      goToHome,
      toggleOrder, // 返回倒序切换方法
    };
  },
};
</script>

<style scoped>
.novel-container {
  position: fixed; /* 使用 fixed 定位，使其覆盖整个屏幕 */
  top: 0;
  left: 0;
  width: 100vw; /* 设置宽度为视口宽度 */
  height: 100vh; /* 设置高度为视口高度 */
  background-color: white; /* 背景颜色为白色 */
  color: black; /* 字体颜色为黑色 */
  overflow: hidden; /* 隐藏溢出的内容 */
}

.chapter-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px; /* 固定高度 */
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center;
  padding: 0 10px;
  background-color: #f9f9f9; /* 背景颜色 */
}

.chapter-title {
  font-size: 14px; /* 字体较小 */
}

.chapter-word-count {
  font-size: 12px; /* 字体较小 */
}

.content-area {
  position: absolute;
  top: 40px; /* 章节信息区域下方 */
  bottom: 0; /* 设置为 0，确保内容区域填满 */
  left: 0;
  right: 0;
  overflow-y: auto; /* 支持垂直滚动 */
  padding: 10px; /* 内边距 */
}

.additional-info {
  margin-top: 10px; /* 附加信息与内容之间的间距 */
  font-size: 12px; /* 字体较小 */
  color: #666; /* 附加信息的字体颜色 */
}

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #f0f0f0; /* 小差距背景色 */
  display: flex;
  justify-content: space-around; /* 均匀分布 */
  align-items: center;
}

.toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55px;
  background-color: #f0f0f0; /* 小差距背景色 */
  display: flex;
  justify-content: space-around; /* 均匀分布 */
  align-items: center;
}

.directory {
  position: absolute;
  bottom: 0; /* 从底部开始滑出 */
  left: 0;
  right: 0;
  height: calc(100vh - 55px); /* 高度留出工具栏的空间 */
  background-color: #f9f9f9;
  overflow-y: auto; /* 支持垂直滚动 */
  z-index: 10; /* 确保在其他元素之上 */
}

.settings {
  position: absolute;
  bottom: 0; /* 从底部开始滑出 */
  left: 0;
  right: 0;
  height: 150px; /* 设置列表高度为150px */
  background-color: #f9f9f9; /* 设置列表背景颜色 */
  z-index: 10; /* 确保在其他元素之上 */
  overflow-y: auto; /* 支持垂直滚动 */
}

.settings-list {
  display: flex;
  flex-direction: column; /* 垂直排布 */
  padding: 10px; /* 内边距 */
}

.setting-item {
  display: flex; /* 使用 flexbox 排布 */
  justify-content: space-between; /* 左右分布 */
  align-items: center; /* 垂直居中 */
  padding: 10px 0; /* 上下内边距 */
}

.setting-title {
  font-size: 14px; /* 字体大小 */
  flex: 1; /* 左侧设置项标题占据剩余空间 */
}

.directory-header {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center; /* 垂直居中 */
  height: 40px; /* 高度 */
  padding: 0 10px; /* 内边距 */
  background-color: #e0e0e0; /* 背景颜色 */
}

.directory-title {
  font-size: 16px; /* 字体大小 */
}

.close-button {
  border: none; /* 无边框 */
  background: transparent; /* 透明背景 */
  font-size: 20px; /* 字体大小 */
}

.directory-info {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  padding: 0 10px; /* 内边距 */
  height: 30px; /* 高度 */
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter, .slide-leave-to /* .slide-leave-active 在 2.1.8+ */ {
  transform: translateY(100%); /* 从底部滑入 */
}

.slide-leave-to {
  transform: translateY(100%); /* 从底部滑出 */
}
</style>
