<template>
  <div class="statistics">
    <div class="header">网站数据概况</div>
    <div class="data">
      <p><span class="label">最近活跃访客:</span> <span class="value">{{ recentVisitors }}</span></p>
      <p><span class="label">今日访问人数:</span> <span class="value">{{ todayVisitors }}</span></p>
      <p><span class="label">今日访问量:</span> <span class="value">{{ todayVisits }}</span></p>
      <p><span class="label">昨日访问人数:</span> <span class="value">{{ yesterdayVisitors }}</span></p>
      <p><span class="label">昨日访问量:</span> <span class="value">{{ yesterdayVisits }}</span></p>
      <p><span class="label">本月访问量:</span> <span class="value">{{ monthlyVisits }}</span></p>
      <p><span class="label">总访问量:</span> <span class="value">{{ totalVisits }}</span></p>
    </div>
    <div class="footer">
      百度统计
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recentVisitors: 100,
      todayVisitors: 500,
      todayVisits: 10000,
      yesterdayVisitors: 486,
      yesterdayVisits: 9952,
      monthlyVisits: 325014,
      totalVisits: 6252348
    };
  }
};
</script>

<style scoped>
.statistics {
  border: 1px solid #1230c6bb;
  padding: 20px;
  border-radius: 8px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  width: 100%; /* 设置宽度为100% */

}

.header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center; /* 标题居中 */
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
}

.value {
  font-weight: normal;
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
