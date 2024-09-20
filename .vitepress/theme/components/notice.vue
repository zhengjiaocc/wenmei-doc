<script setup lang="ts">
import { ref, onMounted } from "vue";

// 当前公告的ID
const currentBulletinId = "2024091903"; // 示例公告ID
const visible = ref(false); // 初始设置为 false，等拿到存储后再决定
const closeMessage = ref(false); // 控制是否显示关闭提示信息
const showAccelerateButton = ref(true); // 控制是否显示加速访问按钮

// 页面加载时执行
onMounted(() => {
  console.log("hostname:", window.location.hostname);

  // 从本地存储获取上次公告ID
  const storedBulletinId = localStorage.getItem("bulletinId");

  // 在拿到存储的公告ID后，才决定是否显示公告
  if (storedBulletinId !== currentBulletinId) {
    visible.value = true;
  }

  // 判断当前域名，如果是 wm.zhengjiao.cc，则不显示加速访问按钮
  if (window.location.hostname === "wm.zhengjiao.cc") {
    showAccelerateButton.value = false;
  }
});

function closeBulletin() {
  // 将当前公告ID存储到本地存储
  localStorage.setItem("bulletinId", currentBulletinId);

  // 隐藏公告
  visible.value = false;

  // 显示关闭提示信息
  closeMessage.value = true;

  // 6秒后自动隐藏提示信息
  setTimeout(() => {
    closeMessage.value = false;
  }, 6000);
}
</script>

<template>
  <div>
    <!-- 公告弹窗 -->
    <div v-if="visible" class="bulletin-wrapper" style="width: 300px">
      <div class="bulletin-title">
        <span class="bulletin-icon left">
          <svg
            class="bulletin-icon"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
            style="
              width: 20px;
              height: 20px;
              font-size: 20px;
              color: rgb(255, 255, 255);
            "
          >
            <path
              d="M27.16 8.08l-1.53 1.29a10 10 0 0 1-.29 13.23l1.47 1.4a12 12 0 0 0 .35-15.88z"
              fill="currentColor"
            ></path>
            <path
              d="M21.58 12a6 6 0 0 1-.18 7.94l1.47 1.36a8 8 0 0 0 .23-10.59z"
              fill="currentColor"
            ></path>
            <path
              d="M18 30a1 1 0 0 1-.71-.3L9.67 22H3a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h6.67l7.62-7.7a1 1 0 0 1 1.41 0a1 1 0 0 1 .3.7v26a1 1 0 0 1-1 1zM4 20h6.08a1 1 0 0 1 .71.3L17 26.57V5.43l-6.21 6.27a1 1 0 0 1-.71.3H4z"
              fill="currentColor"
            ></path>
          </svg>
          <span>公告</span>
        </span>
        <svg
          class="btn-close"
          @click="closeBulletin"
          t="1573745677073"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4448"
          width="22"
          height="22"
        >
          <path
            d="M512 34.133333a486.4 486.4 0 1 0 486.4 486.4A486.4 486.4 0 0 0 512 34.133333z m209.4848 632.8064l-55.6032 55.466667-151.517867-151.125333-151.517866 151.1168-55.6032-55.466667 151.517866-151.108267L307.242667 364.714667l55.6032-55.466667 151.517866 151.125333 151.517867-151.1168 55.6032 55.466667-151.517867 151.099733z m0 0"
            p-id="4449"
          ></path>
        </svg>
      </div>

      <div class="bulletin-content">
        <h3 class="bulletin-h3">本次更新：</h3>

        <p style="color: red">章节1900至1910已经更新</p>
        <p style="">
          <a href="/docs/resources/resources" style="text-decoration: underline"
            >Bug反馈、建议请留言</a
          >
        </p>
        <hr>
        <p>活动</p>
        <a style="text-decoration: underline;"
          href="https://tieba.baidu.com/p/8395119444?share=9105&fr=sharewise&see_lz=0&share_from=post&sfc=weixin&client_type=2&client_version=12.59.1.0&st=1726824954&is_video=false&unique=6EB8F54DEBF82338F8F5F3F97A9E9A25&source=12_16_sharecard_a"
          >投票:选择你最喜爱的妹妹</a
        >
        <hr />
        <p>粉丝加群,优先选择</p>
        <p>2群-->261599177</p>
        <p>4群-->546542165</p>

        <hr />
        <!-- 加速访问按钮，只有在 showAccelerateButton 为 true 时显示 -->
        <div class="btn-group" v-if="showAccelerateButton">
          <a class="btn" href="https://wm.zhengjiao.cc" target="_blank"
            >加速访问</a
          >
        </div>
      </div>
    </div>

    <!-- 关闭提示信息 -->
    <div v-if="closeMessage" class="close-message">
      本次关闭后将会在公告更新后弹出。
    </div>
  </div>
</template>

<style>
.bulletin-wrapper {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 30;
  box-sizing: border-box;
  border-radius: 1.2rem;
  overflow-y: auto;
  background-color: #1b1446;
  box-shadow: 0 10px 30px 0 rgb(0 0 0 / 40%);
}
.bulletin-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgb(255 255 255);
  padding: 1rem;
}
.bulletin-icon {
  display: inline-flex;
}
.bulletin-icon.left {
  flex-direction: row;
  align-items: center;
}
.bulletin-icon.left > svg {
  margin-right: 0.375rem;
}
.btn-close {
  cursor: pointer;
  fill: currentColor;
}
.bulletin-content {
  padding: 1.5rem 2rem;
  background-color: #ffffff;
}
.bulletin-h3 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: #000000;
  font-size: 19px;
  font-weight: bolder;
}
.bulletin-p {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: #000000;
  font-size: 16px;
}
.bulletin-link {
  color: red;
}
.bulletin-img {
  width: 100%;
}
hr {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-top-width: 1px;
  border-style: solid;
  border-color: #1b1446;
}
.btn-group {
  text-align: center;
}
.btn {
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 5px;
  background-color: #1b1446cc;
  text-align: center;
  line-height: 3.5rem;
  color: #ffffff;
}
.close-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background-color: #1b1446;
  color: white;
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 40;
  animation: fade-in-out 3s ease forwards;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(100%);
  }
}
</style>
