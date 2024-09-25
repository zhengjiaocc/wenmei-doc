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
      —— <span class="quote-character">{{ currentQuote.character }}</span> ，
      <span class="quote-chapter">{{ currentQuote.chapter }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import quotesData from "../data/quote.json"; // 导入 JSON 文件

// 定义引用变量
const quotes = ref([...quotesData]);
const displayedText = ref(""); // 显示打字效果的文本
const currentQuote = ref({}); // 当前显示的语录
const metaDisplayed = ref(false); // 控制角色和章节信息显示
const typingSpeed = 110; // 每个字符显示的速度（毫秒）
const deletingSpeed = 55; // 每个字符删除的速度（毫秒）

let shuffledQuotes = [];
let quoteIndex = 0;

// 使用 Fisher-Yates 洗牌算法，随机打乱语录数组
const shuffleQuotes = () => {
  shuffledQuotes = [...quotes.value];
  for (let i = shuffledQuotes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuotes[i], shuffledQuotes[j]] = [shuffledQuotes[j], shuffledQuotes[i]];
  }
};

// 初始化：页面加载时显示第一条语录
const initQuote = () => {
  shuffleQuotes();
  currentQuote.value = shuffledQuotes[quoteIndex];
  displayedText.value = currentQuote.value.sentence; // 直接显示第一句，无打字效果
  metaDisplayed.value = true;
};

// 获取下一条语录
const getNextQuote = () => {
  quoteIndex++;
  if (quoteIndex >= shuffledQuotes.length) {
    quoteIndex = 0;
    shuffleQuotes(); // 所有语录显示完后重新打乱
  }
  return shuffledQuotes[quoteIndex];
};

// 打字效果函数
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
        clearInterval(interval); // 显示完成
        resolve();
      }
    }, typingSpeed);

    // 在显示前一小段时间后显示角色和章节信息
    setTimeout(() => {
      metaDisplayed.value = true;
    }, 100);
  });
};

// 删除句子效果，从后往前删除
const deleteSentence = (sentence) => {
  let i = sentence.length;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (i > 0) {
        displayedText.value = sentence.slice(0, --i);
      } else {
        clearInterval(interval); // 删除完成
        resolve();
      }
    }, deletingSpeed);
  });
};

// 循环显示下一条语录
const showNextQuote = async () => {
  currentQuote.value = getNextQuote();
  await typeSentence(currentQuote.value.sentence); // 打字显示句子
  await new Promise((resolve) => setTimeout(resolve, 3000)); // 停顿3秒
  await deleteSentence(currentQuote.value.sentence); // 删除句子
  setTimeout(showNextQuote, 100); // 稍作延迟后再显示下一条
};

// 页面加载时，初始化第一句并延迟开始打字效果
onMounted(() => {
  setTimeout(initQuote, 100); // 延迟初始化以减少首屏渲染压力
  setTimeout(showNextQuote, 3000); // 3秒后启动打字循环
});
</script>

<style scoped>
/* 手机端默认居中 */
.quote-container {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-family: "Arial", sans-serif;
  margin: 10px 0 -45px 0;
  background: linear-gradient(to right, rgba(246, 246, 247, 1), rgba(246, 246, 247, 0.6));
  border-radius: 10px;
}

.quote-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* 电脑端样式，居左对齐 */
@media (min-width: 768px) {
  .quote-container {
    height: 90px;
    text-align: left;
    padding-left: 10px;
  }
}

/* 闪烁光标 */
.blinking-cursor {
  font-weight: 100;
  font-size: 14px;
  color: #333;
  animation: blink 1s steps(1) infinite;
  display: inline-block;
  vertical-align: text-bottom;
  line-height: inherit;
  margin-left: 2px;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
