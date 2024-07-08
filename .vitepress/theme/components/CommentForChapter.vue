<template>  
  <div class="twikoo-container">  

    <!-- <p class="warm-tip-text">  
      温馨提示：建议使用QQ邮箱，QQ邮箱能正确显示头像，其他邮箱大概率头像空白！  
    </p>  

    <p class="warm-tip-text2">  
      疑问解答：留言的实现用的是Twikoo，部署在国外，会有延迟，请稍等一会...  
    </p>   -->

    <div class="comment-section">  
      <Twikoo/>  
    </div>  
  </div>  
</template>  
  
<script>  
export default {  
  data() {  
    return {  
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
  padding: 20px;  
  margin: 0 auto;  
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
  color: black;  
  font-size: 24px;  
  text-align: left;  
  margin-bottom: 20px;  
}  

.warm-tip-text {  
  color: #666;  
  font-size: 14px;  
  line-height: 1.6;  
  padding: 10px;  
  background-color: #f9f9f9;  
  border-left: 4px solid #ff0000;  
  margin-top: 10px;  
}  

.warm-tip-text2 {  
  color: #666;  
  font-size: 14px;  
  line-height: 1.6;  
  padding: 10px;  
  background-color: #f9f9f9;  
  border-left: 4px solid #00d5ff;  
  margin-top: 5px;  
}  
</style>
