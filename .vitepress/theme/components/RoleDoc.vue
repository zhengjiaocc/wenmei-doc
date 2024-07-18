<template>  
  <div class="profile-container">  
    <header class="profile-header">  
      <h1>{{ name }}</h1>  
      <p>基本信息</p>  
      <div class="basic-info">  
        <p>年龄：{{ age }}岁</p>  
        <p>身高：{{ height }}cm</p>  
        <p>体重：{{ weight }}斤</p>  
        <p>首次出场：第1章 后妈如妹，妹似后妈</p>  
      </div>  
    </header>  
  
    <section class="family-relations">  
      <h2>家庭关系</h2>  
      <ul>  
        <li>哥哥：楚南（异母异父，但关系深厚）</li>  
        <li>爸爸：楚文博（继父）</li>  
        <li>妈妈：冬小雨（后妈）</li>  
      </ul>  
    </section>  
  
    <section class="social-relations">  
      <h2>社交关系</h2>  
      <ul>  
        <li>闺蜜：东方怜人、萧一可（两人与楚缘关系亲密，共同度过了许多时光）</li>  
      </ul>  
    </section>  
  
    <section class="appearance-and-personality">  
      <h2>外貌与性格</h2>  
      <p>外貌：长相完美，身材匀称，但对自己的胸部有一定自卑。</p>  
      <p>性格：表面孤傲自大，少言寡语，生性怪癖；实则单纯可爱，温柔体贴，聪明痴情。</p>  
    </section>  
  
    <section class="experience-and-evaluation">  
      <h2>经历与评价</h2>  
      <article>  
        <h3>童年经历</h3>  
        <p>楚缘刚出生便被亲生父母抛弃，五岁前每晚独自睡在空荡荡的房间里...</p>  
          
        <h3>成长环境</h3>  
        <p>在楚南的家庭中，尽管没有血缘关系，但楚缘得到了正常的亲情关爱...</p>  
  
        <h3>情感纠葛</h3>  
        <p>楚缘从小便爱慕哥哥楚南，但这份感情一直未能得到明确的回应...</p>  
  
        <h3>网友评价</h3>  
        <div class="quotes">  
          <p>“书里的楚缘，傲娇，任性...” - 小可就是这样</p>  
          <p>“以前我觉得，这是小屁孩的幼稚...” - 茶道赛高</p>  
          <p>“童年阴影，让她孤僻...” - 花伤泪雨甜</p>  
        </div>  
      </article>  
    </section>  
  </div>  
</template>  
  
<script>  
export default {  
  data() {  
    return {  
      name: '楚缘',  
      age: '16',  
      height: '166',  
      weight: '85',  
    };  
  },  
};  
</script>  
  
<style scoped>  
.profile-container {  
  font-family: Arial, sans-serif;  
  color: #333;  
  margin: 20px;  
}  
  
.profile-header {  
  border-bottom: 2px solid #ccc;  
  padding-bottom: 10px;  
  margin-bottom: 20px;  
}  
  
.basic-info p {  
  margin: 5px 0;  
}  
  
section h2 {  
  color: #666;  
}  
  
.quotes p {  
  font-style: italic;  
  margin: 5px 0;  
}  
</style>