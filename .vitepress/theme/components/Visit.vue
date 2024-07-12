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
    </div>
    <div class="footer">
      本站数据来源于百度统计
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
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
    setInterval(this.fetchStatistics, 30 * 60 * 1000); // 每3分钟触发一次数据拉取
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
      } catch (error) {
        console.error('获取统计数据失败:', error);
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
  width: 100%; /* 设置宽度为100% */
  padding: 10px;
  height: 333px;
}

.header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left; /* 标题居中 */
}

.data p {
  margin: 8px 0;
  font-size: 16px;
  color: #333;
  display: flex;
  justify-content: space-between; /* 文字靠左，数据值靠右 */
}

.label {
  font-weight: bold;
  color: #999; /* 设置数据提示文字为浅色 */
}

.value {
  font-weight: bold;
  color: #000; /* 设置数据值为深色 */
  text-align: right;
}

.footer {
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
  color: #555;
  border-top: 1px solid #dcdcdc;
  padding-top: 10px;
}
</style>
