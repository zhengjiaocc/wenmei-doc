<template>
  <div class="chapter-test">
    <h1>章节接口测试</h1>

    <!-- 根据ID获取章节 -->
    <div class="section">
      <h2>根据ID获取章节</h2>
      <input v-model="chapterId" placeholder="输入章节ID" />
      <button @click="fetchChapterById">查询</button>
    </div>

    <!-- 获取所有章节目录 -->
    <div class="section">
      <h2>获取所有章节目录</h2>
      <button @click="fetchAllChapterDirectory">获取章节目录</button>
    </div>

    <!-- 批量查询章节 -->
    <div class="section">
      <h2>批量查询章节</h2>
      <input v-model="chapterIds" placeholder="输入章节ID，逗号分隔" />
      <button @click="fetchChaptersByIds">查询</button>
    </div>

    <!-- 根据起始ID和长度查询章节 -->
    <div class="section">
      <h2>根据起始ID和长度查询章节</h2>
      <input v-model="startId" placeholder="输入起始ID" />
      <input v-model="length" placeholder="输入章节数量" />
      <button @click="fetchChaptersByRange">查询</button>
    </div>

    <!-- 结果展示 -->
    <div class="section">
      <h2>结果</h2>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script>
import {
  getChapter,
  getAllChapterDirectory,
  getChaptersByIds,
  getChaptersByRange,
} from "../utils/api"; // 根据项目结构调整路径

export default {
  data() {
    return {
      chapterId: "", // 单个章节查询ID
      chapterIds: "", // 批量查询章节ID列表
      startId: "", // 范围查询起始ID
      length: "", // 范围查询长度
      result: "", // 结果展示
    };
  },
  methods: {
    // 根据章节ID获取单个章节
    async fetchChapterById() {
      try {
        const data = await getChapter(this.chapterId);
        this.result = JSON.stringify(data, null, 2); // 格式化JSON结果
      } catch (error) {
        this.result = `获取章节失败: ${error}`;
      }
    },

    // 获取所有章节目录
    async fetchAllChapterDirectory() {
      try {
        const data = await getAllChapterDirectory();
        this.result = JSON.stringify(data, null, 2); // 格式化JSON结果
      } catch (error) {
        this.result = `获取所有章节目录失败: ${error}`;
      }
    },

    // 批量查询章节
    async fetchChaptersByIds() {
      try {
        const idsArray = this.chapterIds.split(",").map((id) => id.trim()); // 将逗号分隔的字符串转换为数组
        const data = await getChaptersByIds(idsArray);
        this.result = JSON.stringify(data, null, 2); // 格式化JSON结果
      } catch (error) {
        this.result = `批量查询章节失败: ${error}`;
      }
    },

    // 根据起始ID和长度查询章节
    async fetchChaptersByRange() {
      try {
        const data = await getChaptersByRange(this.startId, this.length);
        this.result = JSON.stringify(data, null, 2); // 格式化JSON结果
      } catch (error) {
        this.result = `根据起始ID和长度查询章节失败: ${error}`;
      }
    },
  },
};
</script>

<style scoped>
.chapter-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.section {
  margin-bottom: 20px;
}
h1 {
  text-align: center;
  color: #4caf50;
}
input {
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background-color: #45a049;
}
pre {
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ccc;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
