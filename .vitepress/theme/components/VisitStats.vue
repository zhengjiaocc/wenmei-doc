<!-- .vitepress/theme/components/VisitStats.vue -->
<template>
  <div id="visit-stats">
    <p>正在加载访问统计信息...</p>
  </div>
</template>

<script>
export default {
  mounted() {
    const script1 = document.createElement('script');
    script1.src = 'https://sdk.51.la/perf/js-sdk-perf.min.js';
    script1.crossOrigin = 'anonymous';
    script1.onload = () => {
      new LingQue.Monitor().init({ id: '3IvoPPmE0AosBws2' });

      // Custom logic to fetch and display visit stats
      fetch('https://api.51.la/stats?id=3IvoPPmE0AosBws2')
        .then(response => response.json())
        .then(data => {
          document.getElementById('visit-stats').innerHTML = `
            <p>今日访问量: ${data.todayVisits}</p>
            <p>总访问量: ${data.totalVisits}</p>
          `;
        })
        .catch(error => console.error('Error fetching visit stats:', error));
    };
    document.head.appendChild(script1);
  }
};
</script>
