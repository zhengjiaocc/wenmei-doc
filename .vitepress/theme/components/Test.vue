<template>
  <div>
    <button @click="fetchTimeTrendData">A获取网站概况趋势数据</button>
    <p v-if="timeTrendData">网站概况趋势数据：{{ timeTrendData }}</p>
    <!-- 其他统计数据展示 -->
  </div>
</template>

<script>
import { getTimeTrendRpt } from "../utils/baiduStats"; // 导入统计数据请求模块

export default {
  data() {
    return {
      timeTrendData: null,
      // 其他数据状态
    };
  },
  methods: {
    fetchTimeTrendData() {
      const siteId = "20767045"; // 替换成你的网站ID
      const startDate = "20240711"; // 替换成开始日期，格式为 "YYYYMMDD"
      const endDate = "20240712"; // 替换成结束日期，格式为 "YYYYMMDD"

      getTimeTrendRpt(siteId, startDate, endDate)
        .then((response) => {
          this.timeTrendData = response.body.data[0].result.items;
          console.log("获取到网站概况趋势数据:", this.timeTrendData);
        })
        .catch((error) => {
          console.error("获取网站概况趋势数据失败:", error);
        });
    },
    // 其他获取统计数据的方法
  },
  mounted() {
    this.fetchTimeTrendData();
  },
};
</script>

<!-- 样式和其他模板 -->

