<template>
  <div class="team-members">
    <!-- 页面顶部标题 -->
    <h1 class="team-title">致谢</h1>

    <!-- 引言盒子 -->
    <div class="team-introduction">
      <h2 class="introduction-title">引言：</h2>
      <p>
        缘字诀，几番轮回，我们因《问题妹妹恋上我》一书相聚，共同走过了这段不凡的旅程。
      </p>
      <p>
        在这里，我们想要特别感谢那些一直以来默默支持、积极讨论、热情分享的书迷朋友们。
      </p>
      <p>
        为了表达我们最真挚的感激之情，特此列出致谢列表（虽无法详尽，但每一份支持都重如泰山）。
      </p>
    </div>

    <!-- 按照等级显示致谢列表 -->
    <div
      v-for="(level, levelIndex) in levels"
      :key="levelIndex"
      class="team-group"
    >
      <div class="group-header">
        <h2 class="group-title">{{ level.level_name }}</h2>
        <button class="toggle-button" @click="toggleLevel(levelIndex)">
          {{ level.open ? "收起" : "展开" }}
        </button>
      </div>

      <!-- 展开和收起控制整个等级的内容 -->
      <div v-if="level.open" class="group-content">
        <div
          v-for="(group, groupIndex) in level.groups"
          :key="groupIndex"
          class="group-box"
        >
          <div class="group-platform-header">
            <h3 class="group-description">{{ group.platform }}</h3>
            <button
              class="toggle-button platform-toggle-button"
              @click="toggleGroup(levelIndex, groupIndex)"
            >
              {{ group.open ? "收起" : "展开" }}
            </button>
          </div>

          <!-- 展开和收起控制具体组别的内容 -->
          <div v-if="group.open" class="member-cards">
            <div
              v-for="(member, memIdx) in group.members"
              :key="memIdx"
              class="member-card"
              :class="{ flip: member.flipped }"
              @mouseenter="hoverMember(member)"
              @mouseleave="unhoverMember(member)"
            >
              <div class="card-content">
                <!-- 正面 -->
                <div class="member-info front" v-if="!member.flipped">
                  <div class="member-avatar">
                    <img :src="member.avatar" alt="avatar" />
                  </div>
                  <div class="member-details">
                    <div>
                      <p class="member-name">{{ member.name }}</p>
                      <p class="member-motto">{{ member.motto }}</p>
                      <p class="member-description">{{ member.descr }}</p>
                    </div>
                    <div class="member-tags">
                      <span
                        v-for="(tag, tagIdx) in member.tags"
                        :key="tagIdx"
                        class="tag"
                        >{{ tag }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- 背面 -->
                <div class="member-info back" v-if="member.flipped">
                  <p class="member-details-title">资料详情</p>
                  <p>{{ member.details.info }}</p>
                  <ul>
                    <li
                      v-for="(link, linkIdx) in member.details.links"
                      :key="linkIdx"
                    >
                      <a :href="link.url">{{ link.text }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  
  
  <script>
import thanksData from "../data/thanks.json";

export default {
  data() {
    return {
      levels: thanksData.levels.map((level) => ({
        ...level,
        open: true, // 默认开启每个级别
        groups: level.groups.map((group) => ({
          ...group,
          open: true, // 默认开启每个组
        })),
      })),
    };
  },
  methods: {
    // 切换每个级别的展开/收起状态
    toggleLevel(levelIndex) {
      this.levels[levelIndex].open = !this.levels[levelIndex].open;
    },
    // 切换每个组的展开/收起状态
    toggleGroup(levelIndex, groupIndex) {
      this.levels[levelIndex].groups[groupIndex].open =
        !this.levels[levelIndex].groups[groupIndex].open;
    },
    // 当鼠标移到成员卡片上时翻转
    hoverMember(member) {
      if (member.details) {
        member.flipped = true;
      }
    },
    // 当鼠标离开成员卡片时恢复
    unhoverMember(member) {
      if (member.details) {
        member.flipped = false;
      }
    },
  },
};
</script>
  
  <style scoped>
/* 整体布局样式 */
.team-members {
  padding: 20px;
}

/* 页面标题和描述 */
.team-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.team-description {
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

/* 引言盒子样式 */
.team-introduction {
  text-align: left;
  font-size: 14px; /* 字体较小 */
  color: #666; /* 字体颜色稍淡 */
  margin: 30px 0;
  padding: 20px; /* 增加适当的 padding，左右上下各20px */
  background-color: #f5f5f7; /* 苹果风格浅灰色背景 */
  border-radius: 16px; /* 圆角 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* 轻微阴影 */
  max-width: 100%; /* 宽度与卡片容器对齐 */
  margin-left: 70px; /* 左侧对齐卡片容器 */
  margin-right: 70px; /* 右侧对齐卡片容器 */
}

.team-introduction p {
  margin-bottom: 12px; /* 每段之间的间距 */
  padding: 0 20px;
}

.introduction-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px; /* 标题与内容间隔 */
  color: #333; /* 标题颜色略深 */
}

/* 分组显示布局 */
.team-group {
  padding: 20px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  margin: 20px 70px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 标语样式 */
.group-slogan {
  font-size: 16px;
  color: #999;
  margin-bottom: 15px;
}

.group-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

/* 卡片容器布局 */
.member-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 卡片之间的间距 */
  justify-content: flex-start; /* 从左到右对齐 */
  margin-left: 0; /* 去除容器左边距 */
  margin-right: 0; /* 去除容器右边距 */
  padding-left: 0; /* 去除容器左内边距 */
  padding-right: 0; /* 去除容器右内边距 */
}

/* 成员卡片布局 */
/* 卡片容器布局 */
.member-card {
  background-color: rgb(246, 246, 247);
  width: calc(25% - 15px); /* 每行显示4个卡片 */
  height: 140px;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.6s;
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.flip {
  transform: rotateY(180deg); /* 卡片翻转 */
}

.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.front,
.back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

/* 鼠标悬停时让卡片浮起 */
.member-card:hover {
  transform: translateY(-5px);
}

/* 卡片内部信息布局 */
.member-info {
  display: flex;
  align-items: center;
}

.member-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}

.member-details {
  flex: 1;
}

.member-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.member-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

/* 标签设置 */
.member-tags {
  position: absolute;
  top: 0px;
  right: 0px;
}

.member-tags .tag {
  background-color: #3498db;
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 5px;
}

/* 背面样式 */
.back {
  display: none; /* 初始状态隐藏背面 */
  font-size: 14px;
}

.flip .back {
  display: block; /* 翻转后显示背面 */
}
.toggle-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-button:hover {
  background-color: #2980b9;
}

/* 为组别和平台的内容部分添加适当的间距 */
.group-content {
  margin-left: 20px;
  margin-top: 10px;
}

.group-box {
  margin-bottom: 20px; /* 为每个组之间增加下方间距 */
  padding-bottom: 10px; /* 增加内间距让内容更加通透 */
}

.group-platform-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.platform-toggle-button {
  margin-left: auto; /* 确保按钮与标题右对齐 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .team-group {
    padding: 20px 20px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    margin: 5px 0;
  }

  .team-introduction {
    margin-left: 20px;
    margin-right: 20px;
    padding: 20px;
  }

  .member-cards {
    flex-direction: column;
    align-items: center;
  }

  .member-card {
    width: 100%;
  }
}
</style>