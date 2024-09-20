<template>
    <div class="quote-container">
      <!-- 显示语句，独立一行 -->
      <div class="quote-text">
        <span v-for="(char, index) in displayedText" :key="index">{{ char }}</span>
        <!-- 光标始终闪烁 -->
        <span class="blinking-cursor">|</span>
      </div>
      <!-- 显示角色名和章节，独立一行 -->
      <div class="quote-meta" v-if="metaDisplayed">
        —— <span class="quote-character">{{ currentQuote.character }}</span>，
        <span class="quote-chapter">{{ currentQuote.chapter }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import quotesData from "../data/quote.json"; // 导入 JSON 文件
  
  const quotes = ref(quotesData); // 使用导入的 JSON 数据
  const displayedText = ref(""); // 当前打字效果显示的文本
  const currentQuote = ref({}); // 当前显示的语录
  const typingSpeed = 110; // 每个字符显示的速度（毫秒）
  const deletingSpeed = 70; // 每个字符删除的速度（毫秒）
  const metaDisplayed = ref(false); // 控制角色和章节信息的显示
  const quoteIndex = ref(0); // 当前语录的索引
  
  // 打字机效果函数
  const typeSentence = (sentence) => {
    displayedText.value = ""; // 清空当前显示的文本
    metaDisplayed.value = false; // 隐藏角色和章节信息
    let i = 0;
  
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (i < sentence.length) {
          displayedText.value += sentence[i];
          i++;
        } else {
          clearInterval(interval); // 语句显示完，清除计时器
          resolve(); // 打字结束，返回成功的 Promise
        }
      }, typingSpeed);
  
      // 在语句开始显示 300ms 后，显示角色名和章节
      setTimeout(() => {
        metaDisplayed.value = true;
      }, 100);
    });
  };
  
  // 删除句子函数，从后往前删除
  const deleteSentence = (sentence) => {
    let i = sentence.length;
  
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (i > 0) {
          displayedText.value = sentence.slice(0, --i);
        } else {
          clearInterval(interval); // 删除完成，清除计时器
          resolve(); // 删除结束，返回成功的 Promise
        }
      }, deletingSpeed);
    });
  };
  
  // 显示下一条语录
  const showNextQuote = async () => {
    currentQuote.value = quotes.value[quoteIndex.value];
    await typeSentence(currentQuote.value.sentence); // 等待打字完成
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 停顿1秒
    await deleteSentence(currentQuote.value.sentence); // 等待删除完成
    quoteIndex.value = (quoteIndex.value + 1) % quotes.value.length; // 循环显示
    setTimeout(showNextQuote, 100); // 延迟0.5秒再显示下一条
  };
  
  onMounted(() => {
    showNextQuote(); // 初始化时开始显示语录
  });
  </script>
  
  <style scoped>
  /* 默认设置为手机端，居中对齐 */
  .quote-container {
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center; /* 手机端默认居中 */
  font-family: "Arial", sans-serif;
  padding: 0;
  margin: 0;
  margin-top: 10px;
  margin-bottom: -45px;
  background: linear-gradient(to right, rgba(246, 246, 247, 1), rgba(246, 246, 247, 0.6)); /* 从左到右渐变，右侧透明 */
  border-radius: 8px;
}

  
  .quote-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: #333;
    margin-bottom: 8px; /* 让语句与角色/章节有一些间距 */
  }
  
  .quote-meta {
    font-size: 0.85rem;
    color: #777;
  }
  
  .quote-character {
    font-weight: 600;
    color: #555;
  }
  
  .quote-chapter {
    color: #999;
  }
  
  /* 电脑端样式，屏幕宽度大于768px时 */
  @media (min-width: 768px) {
    .quote-container {
      text-align: left; /* 电脑端靠左对齐 */
      padding-left: 10px; /* 增加左侧的内边距 */
      display: flex;
    }
  }
  
 /* 调整闪烁光标的样式 */
.blinking-cursor {
  font-weight: 100;
  font-size: 14px;
  color: #333;
  animation: blink 1s steps(1) infinite; /* 使用steps优化动画 */
  display: inline-block; /* 确保光标在不同设备上的一致显示 */
  vertical-align: text-bottom; /* 修改为 baseline，与文本底线对齐 */
  line-height: inherit; /* 确保光标与文本的行高一致 */
  margin-left: 2px; /* 增加一些左侧的间距，避免光标太紧贴文本 */
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

  </style>
  