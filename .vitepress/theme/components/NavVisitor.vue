<template>
  <div class="visitor">
    <svg
      width="80"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
      style="border-radius: 5px"
    >
      <rect width="42" height="18" fill="rgb(83, 83, 83)" rx="4 0 0 4" />
      <!-- 左侧矩形 -->
      <rect
        x="41"
        width="42"
        height="18"
        fill="rgb(58, 120, 175)"
        rx="0 4 4 0"
      />
      <!-- 右侧矩形 -->
      <!-- 调整访客位置，进一步靠左，字体放大并居中 -->
      <text
        x="12"
        y="13"
        fill="white"
        font-size="10"
        font-family="Arial"
        text-anchor="start"
      >
        访客
      </text>
      <!-- 调整数字位置，字体放大并居中 -->
      <text
        x="73"
        y="13"
        fill="white"
        font-size="10"
        font-family="Arial"
        text-anchor="end"
      >
        {{ totalVisitors }}
      </text>
    </svg>
  </div>
</template>
  
  <script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const totalVisitors = ref(0);
async function fetchTotalVisitors() {
  try {
    const response = await axios.get(
      "https://tj.zhengjiao.cc/proxy/baidu/base"
    );
    totalVisitors.value = response.data["总访问人数"];
  } catch (error) {
    console.error("获取总访问人数失败:", error);
  }
}

onMounted(() => {
  fetchTotalVisitors(); // 组件挂载后请求数据
});
</script>
  
  <style scoped>
/* 针对平板设备隐藏 .visitor 元素 */
@media (min-width: 768px) and (max-width: 920px) {
  .visitor {
    display: none;
  }
}
.visitor {
  margin-left: 3px;
}

/* 针对手机端增加左侧 margin */
@media (max-width: 767px) {
  .visitor {
    margin-left: 16px; /* 根据需要调整这个值 */

  }
}
</style>
  