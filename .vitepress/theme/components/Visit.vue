<template>
  <div class="statistics">
    <div class="header">网站数据概况</div>
    <div class="data">
      <p><span class="label">今日访问人数:</span> <span class="value">{{ todayVisitors }}</span></p>
      <p><span class="label">今日访问量:</span> <span class="value">{{ todayVisits }}</span></p>
      <p><span class="label">昨日访问人数:</span> <span class="value">{{ yesterdayVisitors }}</span></p>
      <p><span class="label">昨日访问量:</span> <span class="value">{{ yesterdayVisits }}</span></p>
      <p><span class="label">本月访问量:</span> <span class="value">{{ monthlyVisits }}</span></p>
      <p><span class="label">总访问量:</span> <span class="value">{{ totalVisits }}</span></p>
      <div v-if="loading" class="loading-message">数据加载中...</div>
    </div>
    <div v-if="error" class="error-message">数据加载失败 请稍后重试</div>
    <div class="footer">
      <p>本站数据来源于百度统计</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      error: false,
      todayVisitors: 0,
      todayVisits: 0,
      yesterdayVisitors: 0,
      yesterdayVisits: 0,
      monthlyVisits: 0,
      totalVisits: 0
    };
  },
  mounted() {
    this.fetchStatistics(); // 页面加载后立即拉取一次数据
    setInterval(this.fetchStatistics, 30 * 60 * 1000); // 每30分钟触发一次数据拉取
  },
  methods: {
    async fetchStatistics() {
      try {
        const response = await axios.get('https://tj.zhengjiao.cc/proxy/baidu/base');
        const data = response.data;
        this.todayVisitors = data['今日访问人数'];
        this.todayVisits = data['今日访问量'];
        this.yesterdayVisitors = data['昨日访问人数'];
        this.yesterdayVisits = data['昨日访问量'];
        this.monthlyVisits = data['本月访问量'];
        this.totalVisits = data['总访问量'];
        this.loading = false; // 数据加载完成，显示数据
      } catch (error) {
        console.error('获取统计数据失败:', error);
        this.error = true; // 显示错误消息
        this.loading = false; // 停止加载状态
      }
    }
  }
};
</script>

<style scoped>
.statistics {
  border: 2px solid #1230c6bb;
  border-radius: 9px;
  font-family: Arial, sans-serif;
  width: 100%;
  padding: 10px;
  height: 333px;
  position: relative; /* 设置相对定位 */
}

.loading-message,
.error-message {
  text-align: center;
  font-weight: bold;
  position: absolute;
  color: rgba(255, 0, 0, 0.529);
  top: 50%; /* 居中垂直 */
  left: 50%; /* 居中水平 */
  transform: translate(-50%, -50%); /* 居中 */
  width: 100%; /* 宽度占满父容器 */
}

.data {
  position: relative; /* 设置相对定位 */
}

.data p {
  margin: 8px 0;
  font-size: 16px;
  color: #333;
  display: flex;
  justify-content: space-between;
}

.label {
  font-weight: bold;
  color: #999;
}

.value {
  font-weight: bold;
  color: #000;
  text-align: right;
}

.footer {
  position: absolute; /* 设置绝对定位 */
  bottom: 10px; /* 距离底部的距离 */
  left: 0;
  right: 0;
  text-align: center; /* 文字居中 */
  font-weight: bold;
  color: #555;
}

.footer p {
  margin: 0;
  margin: 0 10px;
border-top: 1px solid rgba(128, 128, 128, 0.656);
}

.header {
  font-weight: bold;
}
</style>
