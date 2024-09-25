<script setup lang="ts">
import { ref, onMounted } from "vue";

// 当前公告的ID
const currentBulletinId = "2024091906"; // 示例公告ID
const visible = ref(false); // 控制公告的可见性
const closeMessage = ref(false); // 控制是否显示关闭提示信息
const showAccelerateButton = ref(true); // 控制是否显示加速访问按钮

// 页面加载时执行
onMounted(() => {
  const storedBulletinId = localStorage.getItem("bulletinId");

  // 如果存储的公告ID与当前不一致，则显示公告
  if (!storedBulletinId || storedBulletinId !== currentBulletinId) {
    visible.value = true;
  }

  // 判断当前域名，如果是 wm.zhengjiao.cc，则不显示加速访问按钮
  if (window.location.hostname === "wm.zhengjiao.cc") {
    showAccelerateButton.value = false;
  }
});

// 关闭公告并更新 localStorage
function closeBulletin() {
  localStorage.setItem("bulletinId", currentBulletinId);
  visible.value = false;
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
    <transition name="fade">
      <div v-if="visible" class="bulletin-wrapper" style="width: 300px">
        <div class="bulletin-title">
          <span class="bulletin-icon left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              class="bulletin-icon"
              style="width: 20px; height: 20px; color: white;"
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
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            width="22"
            height="22"
          >
            <path
              d="M512 34.133333a486.4 486.4 0 1 0 486.4 486.4A486.4 486.4 0 0 0 512 34.133333z m209.4848 632.8064l-55.6032 55.466667-151.517867-151.125333-151.517866 151.1168-55.6032-55.466667 151.517866-151.108267L307.242667 364.714667l55.6032-55.466667 151.517866 151.125333 151.517867-151.1168 55.6032 55.466667-151.517867 151.099733z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        <div class="bulletin-content">
          <h3 class="bulletin-h3">本次更新：</h3>
          <p style="color: red">章节1900至1910已经更新</p>
          <p><a href="/docs/resources/resources" style="text-decoration: underline">Bug反馈、建议请留言</a></p>
          <hr />
          <p>活动</p>
          <a href="https://tieba.baidu.com/p/8395119444" style="text-decoration: underline;">投票:选择你最喜爱的妹妹</a>
          <hr />
          <p>粉丝加群,优先选择</p>
          <p>2群-->261599177</p>
          <p>4群-->546542165</p>

          <hr />
          <!-- 加速访问按钮 -->
          <div v-if="showAccelerateButton" class="btn-group">
            <a class="btn" href="https://wm.zhengjiao.cc" target="_blank">加速访问</a>
          </div>
        </div>
      </div>
    </transition>

    <!-- 关闭提示信息 -->
    <transition name="fade">
      <div v-if="closeMessage" class="close-message">
        本次关闭后将会在公告更新后弹出。
      </div>
    </transition>
  </div>
</template>

<style scoped>
.bulletin-wrapper {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 30;
  border-radius: 1.2rem;
  background-color: #1b1446;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  overflow-y: auto;
}

.bulletin-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding: 1rem;
}

.btn-close {
  cursor: pointer;
  fill: currentColor;
}

.bulletin-content {
  padding: 1.5rem 2rem;
  background-color: #fff;
}

.bulletin-h3 {
  margin: 0.5rem 0;
  font-size: 19px;
  font-weight: bold;
}

hr {
  margin: 1.5rem 0;
  border-top: 1px solid #1b1446;
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
  color: white;
  line-height: 3.5rem;
  text-align: center;
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
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
