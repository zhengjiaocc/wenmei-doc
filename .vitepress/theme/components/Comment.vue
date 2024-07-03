<template>  
  <div class="twikoo-container">  
     <p class="title">🏳‍🌈留言须知</p>
     
    <div class="notice">  
        
      <p>您可以在这里留言，但请确保您已阅读并理解以下须知：</p>  
      <ul class="notice-list">  
        <li>  
          <input type="checkbox" id="notice1" v-model="notices.notice1" disabled>  
          <label for="notice1">请保持友善和尊重。</label>  
        </li>  
        <li>  
          <input type="checkbox" id="notice2" v-model="notices.notice2" disabled>  
          <label for="notice2">禁止发布违法、色情、暴力内容。</label>  
        </li>  
        <li>  
          <input type="checkbox" id="notice3" v-model="notices.notice3" disabled>  
          <label for="notice3">我们保留删除不当留言的权利。</label>  
        </li>  
      </ul>  
    </div>  

    
    <p class="confirmation">确认您已阅读并理解上述须知后，请继续留言：</p>  
 
 <p class="warm-tip-text">  
      温馨提示：建议使用QQ邮箱，能正确显示头像，其他邮箱大概率头像空白！  
    </p>  


    <div class="comment-section">  
      <!-- 假设Twikoo是一个Vue组件，用于显示和提交评论 -->  
      <Twikoo/>  
    </div>  
  </div>  
</template>  
  
<script>  
export default {  
  data() {  
    return {  
      // 由于复选框被禁用，这里的数据仅用于演示  
      notices: {  
        notice1: true,  
        notice2: true,  
        notice3: true  
      }  
    };  
  }  
};  
</script>  
  
<style scoped>  
.twikoo-container {  
  padding:  20px;  
  margin: 30px auto;  
  /* max-width: 800px;   */
  font-family: Arial, sans-serif;  
  background-color: #fff;  
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  
  border-radius: 8px;  
}  
  
.notice {  
  background-color: #f8f9fa;  
  padding: 15px;  
  border-radius: 5px;  
  margin-bottom: 20px;  
  border: 1px solid #ddd;  
}  
  
.notice p {  
  margin-bottom: 10px;  
}  
  
.notice-list {  
  list-style-type: none;  
  padding: 0;  
}  
  
.notice-list li {  
  margin-bottom: 10px;  
}  
  
.notice-list input[type="checkbox"] {  
  margin-right: 10px;  
  vertical-align: middle;  
}  
  
.notice-list label {  
  cursor: pointer;  
  font-weight: normal;  
}  
  
.confirmation {  
  font-style: italic;  
  color: #666;  
}  
  
.comment-section {  
  margin-top: 20px;  
}  

.title {  
  color: black; /* 字体颜色 */  
  font-size: 24px; /* 字体大小 */  
  text-align:left; /* 文本居中 */  
  margin-bottom: 20px; /* 下边距 */  
  /* 可以添加更多样式，如边框、背景色等 */  
} 

.warm-tip-text {  
  color: #666; /* 灰色文本 */  
  font-size: 14px; /* 字体大小 */  
  line-height: 1.6; /* 行高，使文本更易读 */  
  padding: 10px; /* 内边距，为文本周围添加一些空间 */  
  background-color: #f9f9f9; /* 浅灰色背景，可选 */  
  border-left: 4px solid #ff0000; /* 红色左边框，作为高亮，可选 */  
  margin-top: 10px; /* 与上方内容的间距 */  
  /* border-radius: 4px; 边框圆角，可选   */
}  


</style>