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
      </div>
      <p class="group-slogan">{{ level.slogan }}</p>
      <!-- 添加级别的slogan -->

      <!-- 展开和收起控制具体平台的内容 -->
      <div class="group-content">
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

          <p class="group-slogan">{{ group.slogan }}</p>
          <!-- 添加平台的slogan -->

          <!-- 展开和收起控制具体组别的内容 -->
          <div v-if="group.open" class="member-cards">
            <div
              v-for="member in group.members"
              :key="member.id"
              :class="['member-card', `member-card-level-${level.level_id}`]"
            >
              <div
                class="card-content"
                :class="{ flip: member.flipped }"
                @click="toggleFlip(member)"
              >
                <!-- 正面 -->
                <div class="member-info front" v-if="!member.flipped">
                  <!-- 判断是否显示年份和描述，根据level_id控制 -->
                  <div
                    class="member-avatar-wrapper"
                    :class="{ 'no-margin-top': level.level_id === 2 }"
                  >
                    <div class="member-avatar">
                      <img :src="member.avatar" alt="avatar" />
                    </div>
                    <div v-if="level.level_id === 1" class="member-join-time">
                      {{ member.year }}
                    </div>
                  </div>

                  <div class="member-details">
                    <div>
                      <p class="member-name">{{ member.name }}</p>
                      <p class="member-motto">{{ member.motto }}</p>
                      <p v-if="level.level_id === 1" class="member-description">
                        {{ member.descr }}
                      </p>
                    </div>
                    <!-- 标签部分，根据 level_id 控制显示 -->
                    <div class="member-tags" v-if="level.level_id === 1">
                      <span
                        v-for="(tagId, tagIdx) in member.tags
                          .sort((a, b) => a - b)
                          .slice(0, 3)"
                        :key="tagIdx"
                        class="tag"
                        :style="{ backgroundColor: getTagColor(tagId) }"
                      >
                        {{ tagsMapping[tagId] }}
                      </span>
                    </div>

                    <!-- 当 level_id 为 2 时，显示 qq_group 代替 Tags -->
                    <div
                      class="member-tags"
                      v-if="level.level_id === 2 && member.qq_group.length"
                    >
                      <span
                        class="tag"
                        :style="{ backgroundColor: getQqGroupTagColor() }"
                      >
                        {{ getQqGroupDisplay(member.qq_group) }}
                      </span>
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
import pinyin from "js-pinyin";
export default {
  data() {
    return {
      flippedMember: null, // 存储当前翻转的成员
      tagsMapping: thanksData.tags_mapping, // 引入标签映射
      // 其他数据...
      levels: thanksData.levels.map((level) => ({
        ...level,
        groups: level.groups.map((group) => ({
          ...group,
          members: group.members.sort((a, b) => {
            const aPinyin = pinyin.getCamelChars(a.name);
            const bPinyin = pinyin.getCamelChars(b.name);
            return aPinyin.localeCompare(bPinyin);
          }),
          open: true,
        })),
      })),
      tagColors: {
        1: "#3498db", // 淡蓝色
        2: "#1abc9c", // 青绿色
        3: "#e67e22", // 橙色
        4: "#E6A57E",
        5: "#1abc9c", // 青绿色
      },
    };
  },
  methods: {
    // 切换每个平台组的展开/收起状态
    toggleGroup(levelIndex, groupIndex) {
      this.levels[levelIndex].groups[groupIndex].open =
        !this.levels[levelIndex].groups[groupIndex].open;
    },

    // 点击时翻转成员卡片
    toggleFlip(member) {
      if (member.flipped === false||member.flipped=='') {
        // 如果成员不允许翻转，直接返回
        return;
      }

      if (this.flippedMember && this.flippedMember !== member) {
        this.flippedMember.flipped = false; // 将之前翻转的卡片翻转回去
      }

      member.flipped = !member.flipped; // 切换当前成员的翻转状态
      this.flippedMember = member.flipped ? member : null; // 更新当前翻转的成员
    },

    // 获取显示的标签颜色
    getTagColor(style) {
      return this.tagColors[style] || "#3498db"; // 默认使用淡蓝色
    },

    // 获取QQ群显示样式
    getQqGroupTagColor() {
      return "#1abc9c"; // 绿色标签
    },

    // 根据QQ群组信息获取排序和连接后的字符串
    getQqGroupDisplay(groups) {
      if (groups.length === 0) return null;
      return groups.sort().join(" - ");
    },
    // 获取QQ群显示样式
    getQqGroupTagColor() {
      return "#1abc9c"; // 青色标签
    },

    // 根据QQ群组信息获取排序和连接后的字符串
    getQqGroupDisplay(groups) {
      if (groups.length === 0) return null;
      return groups.sort((a, b) => a - b).join(" - ");
    },
  },
};
</script>

  
<style scoped>
/* 整体布局样式 */
.team-members {
  padding: 20px 0;
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
  background-color: rgb(0 0 0 / 6%); /* 苹果风格浅灰色背景 */
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

/* 引言标题 */
.introduction-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px; /* 标题与内容间隔 */
  color: #333; /* 标题颜色略深 */
}

/* 分组显示布局 */
.team-group {
  padding: 20px;
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
}

/* 卡片容器布局 */
.member-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 卡片之间的间距 */
  justify-content: flex-start; /* 从左到右对齐 */
  margin: 0; /* 去除容器左右边距 */
  padding: 0; /* 去除容器内边距 */
}

/* 成员卡片布局 */
.member-card {
  background-color: rgb(246, 246, 247);
  width: calc(25% - 15px); /* 每行显示4个卡片 */
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 14%);
  perspective: 1000px; /* 让子元素有3D效果 */
  transition: transform 0.3s ease-in-out; /* 添加平滑的悬浮动画 */
}
/* 等级1卡片样式 */
.member-card-level-1 {
  height: 130px; /* 原高度 */
}
.member-card-level-1 .member-description,
.member-card-level-1 .member-join-time {
  display: block;
}

/* 等级2卡片样式 */
.member-card-level-2 {
  height: 100px; /* 调整高度 */
}

.member-card-level-2 .member-description,
.member-card-level-2 .member-join-time {
  display: none; /* 隐藏年份和描述 */
}
.member-card:hover {
  transform: translateY(-5px); /* 悬停效果 */
}

/* 卡片内容翻转效果 */
.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d; /* 保持3D效果 */
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.flip {
  transform: rotateX(180deg); /* 改为上下翻转 */
}

.front,
.back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* 隐藏背面和正面 */
}

.front {
  z-index: 2; /* 确保正面在翻转时显示在上层 */
  transform: rotateX(0deg); /* 正面保持不变 */
}

.back {
  display: none; /* 初始状态隐藏背面 */
  font-size: 14px;
  /* background-color: #f0f0f0; */
  border-radius: 5px;
  transform: rotateX(180deg); /* 背面上下翻转 */
  z-index: 1;
}

.flip .back {
  display: block; /* 翻转后显示背面 */
}

/* 卡片内部信息布局 */
.member-info {
  display: flex;
  align-items: center;
  width: 100%; /* 确保宽度占满 */
}

/* 新增的外层盒子样式 */
.member-avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 修改为 center，确保上下居中对齐 */
  width: 64px;
  height: 100%;
  margin-right: 20px;
}

/* 头像样式 */
.member-avatar {
  display: flex;
  flex-direction: column; /* 让子元素垂直排列 */
  justify-content: space-between; /* 在主轴上分散对齐，内容分别靠上和靠下 */
  height: 100%; /* 确保有足够的高度来显示分散的效果 */
}

.member-avatar img {
  margin-top: 6px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

/* 加入时间样式 */
.member-join-time {
  color: #666;
  text-align: center;
  flex: 0;
  font-weight: 300px;
}

.member-details {
  flex: 1; /* 剩余空间占满 */
  display: flex;
  flex-direction: column;
  height: 100%; /* 占满父元素高度 */
}

.member-name,
.member-motto {
  flex: 1 1 20%; /* 各占20%的高度 */
  margin-bottom: 5px;
  line-height: 30px; /* 垂直居中 */
  font-size: 13px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 显示最多1行 */
  overflow: hidden;
}

.member-name {
  font-size: 16px;
  font-weight: bold;
}

.member-description {
  flex: 2 1 60%; /* 占据60%的高度 */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 显示最多两行 */
  line-height: 20px; /* 每行高度 */
  font-size: 13px;
}

/* 标签设置 */
.member-tags {
  position: absolute;
  top: 0;
  right: 0;
}

.member-tags .tag {
  background-color: #3498db;
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 5px;
}

/* 按钮样式 */
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
  border: 1px solid #e0e0e09c; /* 添加淡灰色边框 */
  padding: 10px; /* 添加内边距使内容不紧贴边框 */
  border-radius: 11px; /* 可选，增加圆角效果 */
  margin-bottom: 10px;
}

.platform-toggle-button {
  margin-left: auto; /* 确保按钮与标题右对齐 */
}
.member-tags .tag {
  color: #fff; /* 字体颜色 */
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 5px;
}

.member-tags .tag {
  background-color: #1abc9c; /* 青色背景 */
  color: #fff; /* 字体颜色 */
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 5px;
}


.member-avatar-wrapper.no-margin-top img {
  margin-top: 0; /* 取消上边距 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .team-group {
    margin: 10px;
  }

  .team-introduction {
    margin-left: 10px;
    margin-right: 10px;
    padding: 20px 10px 10px 20px;
  }

  .member-cards {
    flex-direction: column; /* 纵向布局 */
    align-items: center; /* 水平居中对齐 */
  }

  .member-card {
    width: 100%; /* 卡片宽度设置为 100%，适应小屏幕 */
    max-width: 400px; /* 添加一个最大宽度，避免过宽 */
    margin-bottom: 0;
    transform: none; /* 取消悬浮效果的transform */
    transition: none; /* 禁用动画过渡 */
    border-radius: 11px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 16%);
  }

  .member-introduction p {
    padding: 0;
  }

  .group-content {
    padding: 0;
    margin: 0;
  }

  .member-card:hover {
    transform: none; /* 禁用 hover 的位移效果 */
  }

  .team-introduction p {
    padding: 0 10px;
  }
}
</style>