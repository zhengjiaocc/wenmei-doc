<template>
  <div class="danmu-container">
    <div id="danmu" class="danmu"></div>
    <!-- <div id="danmuBtn" class="danmu-buttons">
      <button class="showBtn" @click="showDanmu">显示弹幕</button>
      <button class="hideBtn" @click="hideDanmu">隐藏弹幕</button>
    </div> -->
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import EasyDanmaku from "../utils/easyDanmaku"; // 根据实际路径进行调整

export default {
  setup() {
    const danmakuInstance = ref(null); // 弹幕实例的引用

    onMounted(async () => {
      try {
        danmakuInstance.value = new EasyDanmaku({
          el: "#danmu",
          line: 10,
          speed: 20,
          hover: true,
          loop: true,
          wrapperStyle: "default-style", // 设置默认样式类名
        });

        await loadDataAndSendDanmaku(); // 等待数据加载和弹幕发送完成后再执行后续操作
      } catch (error) {
        console.error("初始化弹幕实例失败：", error);
      }
    });

    async function loadDataAndSendDanmaku() {
      try {
        let data;
        if (true) {
          console.log("开始从服务器获取数据");
          const response = await fetch("https://twikoo-wm.zhengjiao.cc/", {
            method: "POST",
            body: JSON.stringify({
              event: "COMMENT_GET",
              includeReply: false,
              pageSize: 100,
              url: window.TWIKOO_MAGIC_PATH,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const { data: fetchedData } = await response.json();
          data = fetchedData.map((i) => ({
            avatar:
              i.avatar ||
              "https://cravatar.cn/avatar/d615d5793929e8c7d70eab5f00f7f5f1?d=mp",
            content: `${i.nick}：${formatDanmaku(i.comment)}`,
            url: `${i.url}#${i.id}`,
          }));
        }
        if (danmakuInstance.value) {
          console.log(1);
          danmakuInstance.value.batchSend(data, true);
          console.log("加载弹幕数据：", data);
          danmakuInstance.value.play();
        }
      } catch (error) {
        console.error("加载弹幕数据失败：", error);
      }
    }

    function formatDanmaku(str) {
      str = str.replace(/<\/*br>|[\s\uFEFF\xA0]+/g, "");
      str = str.replace(/<img.*?>/g, "<img>"); // 保留图片标签
      str = str.replace(/<a.*?>.*?<\/a>/g, (match) => {
        const url = match.match(/href="(.*?)"/)[1];
        const content = match.replace(/<.*?>(.*?)<\/.*?>/g, "$1");
        return `<a href="${url}" target="_blank">${content}</a>`;
      });
      str = str.replace(/<pre.*?>.*?<\/pre>/g, "[代码块]");
      str = str.replace(/<.*?>/g, ""); // 去除其他标签
      return str;
    }

    const showDanmu = () => {
      document.getElementById("danmu").classList.remove("hidedanmu");
    };

    const hideDanmu = () => {
      document.getElementById("danmu").classList.add("hidedanmu");
    };

    return {
      showDanmu,
      hideDanmu,
    };
  },
};
</script>

<style>
#danmu {
  background-color: rgba(0, 0, 0, 0.174);
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  z-index: 9999;
  pointer-events: none;
}

.hidedanmu {
  opacity: 0;
}

.hidedanmu * {
  pointer-events: none !important;
}

.showBtn,
.hideBtn {
  padding: 10px 20px;
  margin: 0 10px;
  color: white;
  border: none;
  border-radius: 100px; /* 圆角按钮 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.showBtn:hover,
.hideBtn:hover {
  background-color: rgba(0, 0, 0, 0.7); /* 按钮悬停时的背景色 */
}

.default-style {
  color: #eee !important;
  align-items: center;
  display: flex;
  pointer-events: all;
  cursor: pointer;
  font-size: 16px;
  border-radius: 100px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.27);
  padding: 6px 16px 6px 6px;
  margin: 2px;
}
.default-style a {
  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.3s;
  color: #eee !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px 6px 6px;
  text-decoration: none !important;
}
.default-style p {
  line-height: 1;
  pointer-events: none;
  margin: 0 !important;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.default-style img {
  pointer-events: none;
  height: 30px;
  width: 30px;
  margin: 0 5px 0 0 !important;
  border-radius: 50% !important;
}
</style>
