<template>
    <div id="app">
      <div ref="fullScreenContainer" class="container">
        <p>这是一个全屏的 Vue 组件示例</p>
        <button @click="enterFullScreen">进入全屏</button>
        <button @click="exitFullScreen">退出全屏</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FullScreenComponent",
    methods: {
      // 进入全屏
      enterFullScreen() {
        const element = this.$refs.fullScreenContainer;
        if (element.requestFullscreen) {
          element.requestFullscreen()
            .then(() => {
              console.log("进入全屏成功");
            })
            .catch((error) => {
              console.error("进入全屏失败: ", error);
            });
        }
      },
      
      // 退出全屏
      exitFullScreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen()
            .then(() => {
              console.log("退出全屏成功");
            })
            .catch((error) => {
              console.error("退出全屏失败: ", error);
            });
        }
      },
      
      // 监听全屏状态变化
      handleFullscreenChange() {
        if (document.fullscreenElement) {
          console.log("当前全屏的元素: ", document.fullscreenElement);
        } else {
          console.log("已退出全屏模式");
        }
      }
    },
    
    mounted() {
      // 监听全屏状态变化
      document.addEventListener("fullscreenchange", this.handleFullscreenChange);
    },
    
    beforeDestroy() {
      // 移除事件监听器
      document.removeEventListener("fullscreenchange", this.handleFullscreenChange);
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
  