<template>
    <div ref="fullScreenContainer" class="container">
      <p>页面加载后会自动全屏</p>
      <button @click="exitFullScreen">退出全屏</button>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  
  export default {
    setup() {
      const fullScreenContainer = ref(null); // 用于获取 DOM 引用
  
      // 尝试进入全屏
      const tryFullScreen = () => {
        const element = fullScreenContainer.value;
        if (element && element.requestFullscreen) {
          element.requestFullscreen()
            .then(() => {
              console.log("自动进入全屏成功");
            })
            .catch((error) => {
              console.error("自动进入全屏失败: ", error);
            });
        }
      };
  
      // 退出全屏
      const exitFullScreen = () => {
        if (document.exitFullscreen) {
          document.exitFullscreen()
            .then(() => {
              console.log("退出全屏成功");
            })
            .catch((error) => {
              console.error("退出全屏失败: ", error);
            });
        }
      };
  
      // 监听全屏状态变化
      const handleFullscreenChange = () => {
        if (document.fullscreenElement) {
          console.log("当前全屏的元素: ", document.fullscreenElement);
        } else {
          console.log("已退出全屏模式");
        }
      };
  
      // 使用 onMounted 钩子，在组件挂载后执行
      onMounted(() => {
        // 页面加载后尝试全屏
        tryFullScreen();
  
        // 监听全屏状态变化
        document.addEventListener("fullscreenchange", handleFullscreenChange);
      });
  
      // 返回需要在模板中使用的属性和方法
      return {
        fullScreenContainer,
        exitFullScreen
      };
    }
  };
  </script>
  
  <style scoped>
  .container {
    background-color: #409EFF;
    color: white;
    padding: 20px;
    text-align: center;
  }
  </style>
  