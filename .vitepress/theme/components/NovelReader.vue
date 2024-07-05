<template>
  <div class="novel-reader">
    <!-- 章节导航 -->
    <div class="chapter-navigation">
      <ul>
        <li v-for="(chapter, index) in chapters" :key="index">
          <button @click="loadChapter(index)">
            {{ chapter.title }}
          </button>
        </li>
      </ul>
    </div>

    <!-- 章节内容 -->
    <div class="chapter-content">
      <h1>{{ currentChapter.title }}</h1>
      <p v-html="currentChapter.content"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NovelReader',
  props: {
    novelData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chapters: [],
      currentChapterIndex: 0
    };
  },
  computed: {
    currentChapter() {
      return this.chapters[this.currentChapterIndex] || {};
    }
  },
  mounted() {
    // 初始化章节数据
    this.chapters = this.novelData.chapters;
    // 默认加载第一章
    this.loadChapter(0);
  },
  methods: {
    loadChapter(index) {
      this.currentChapterIndex = index;
    }
  }
};
</script>

<style scoped>
/* 样式可以根据需要进行调整 */
.chapter-navigation {
  margin-bottom: 20px;
}
.chapter-navigation ul {
  list-style-type: none;
  padding: 0;
}
.chapter-navigation li {
  margin-bottom: 5px;
}
.chapter-navigation button {
  background: #f0f0f0;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
.chapter-content {
  margin-top: 20px;
}
.chapter-content h1 {
  font-size: 24px;
  margin-bottom: 10px;
}
.chapter-content p {
  font-size: 16px;
  line-height: 1.6;
}
</style>

