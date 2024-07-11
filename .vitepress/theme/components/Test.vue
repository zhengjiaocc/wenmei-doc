<template>
  <div>
    <h2>百度统计数据</h2>
    <div v-if="loading">加载中...</div>
    <div v-else>
      <p>浏览量(PV): {{ pvCount }}</p>
      <p>访客数(UV): {{ visitorCount }}</p>
      <p>IP数: {{ ipCount }}</p>
      <p>跳出率: {{ bounceRatio }}%</p>
      <p>平均访问时长: {{ avgVisitTime }}秒</p>
      <p>转化次数: {{ transCount }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      pvCount: 0,
      visitorCount: 0,
      ipCount: 0,
      bounceRatio: 0,
      avgVisitTime: 0,
      transCount: 0
    };
  },
  mounted() {
    // 在这里发送请求获取数据
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('https://api.baidu.com/json/tongji/v1/ReportService/getData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "header": {
              "userName": "zhengjiaocc",
              "accessToken": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhY2MiLCJhdWQiOiLnmb7luqbnu5_orqEiLCJ1aWQiOjU2OTQ3MDg3LCJhcHBJZCI6IjEzYmQ1MDQ5YTY3NmQxMDczNzk1OTkzMjEwMmVjNTU3IiwiaXNzIjoi5ZWG5Lia5byA5Y-R6ICF5Lit5b-DIiwicGxhdGZvcm1JZCI6IjQ5NjAzNDU5NjU5NTg1NjE3OTQiLCJleHAiOjE3MjMyMzI0MjYsImp0aSI6Ijg3ODQ2NzkzMzU2MDY2NDA2NzkifQ.bP9Gcv1HwdXdczF7wo2i56B2exrmxTktB4Xpz3Cr3TLd_3wG3k6MB-Eb5zmp90IM",
              "account_type": 1
            },
            "body": {
              "site_id": "20767045",
              "start_date": "20240711",
              "end_date": "20240712",
              "metrics": "pv_count,visitor_count,ip_count,bounce_ratio,avg_visit_time,trans_count",
              "method": "overview/getTimeTrendRpt"
            }
          })
        });

        const data = await response.json();
        const items = data.body.data[0].result.items;

        // 解析数据
        this.pvCount = items[1][0][0];
        this.visitorCount = items[1][0][1];
        this.ipCount = items[1][0][2];
        this.bounceRatio = items[1][0][3];
        this.avgVisitTime = items[1][0][4];
        this.transCount = items[1][0][5];

        this.loading = false;
      } catch (error) {
        console.error('Failed to fetch Baidu stats:', error);
      }
    }
  }
};
</script>
