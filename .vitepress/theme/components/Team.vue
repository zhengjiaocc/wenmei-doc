<template>
  <div class="team-members">
    <!-- 页面顶部标题 -->
    <h1 class="team-title">我们</h1>
    <!-- 标题下方描述 -->
    <p class="team-description">这是我们缘盟的小伙伴</p>

    <!-- 分组显示成员列表 -->
    <div
      v-for="(group, index) in groupedMembers"
      :key="index"
      class="team-group"
    >
      <div class="group-header">
        <h2 class="group-title">{{ group.class_name }}</h2>
        <button class="toggle-button" @click="toggleGroup(index)">
          {{ group.open ? "收起" : "展开" }}
        </button>
      </div>
      <p class="group-description">{{ group.descr }}</p>

      <!-- 成员卡片列表 -->
      <div v-if="group.open" class="member-cards">
        <div
          v-for="(member, idx) in group.link_list"
          :key="idx"
          class="member-card"
        >
          <div class="member-info">
            <div class="member-avatar">
              <img :src="member.avatar" alt="avatar" />
            </div>
            <div class="member-details">
              <p class="member-name">{{ member.name }}</p>
              <p class="member-description">{{ member.descr }}</p>
              <p class="member-message">{{ member.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import teamData from '../data/team.json';

export default {
  data() {
    return {
      // 模拟从 JSON 文件中获取的数据
      links: teamData,
      // 添加一个状态来控制每个组是否展开，第一组默认展开
      groupedMembers: teamData.map((group, index) => ({
        ...group,
        open: index === 0  // 第一组默认展开
      }))
    };
  },
  methods: {
    // 点击按钮切换展开状态
    toggleGroup(index) {
      this.groupedMembers[index].open = !this.groupedMembers[index].open;
    }
  }
};
</script>

<style scoped>
.team-members {
  padding: 20px;
}

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

.team-group {
  margin-bottom: 40px;
  padding: 0 70px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.group-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
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

.member-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0; /* 设置卡片之间的间隔 */
}

.member-card {
  width: 100%; /* 卡片宽度填满父容器 */
  max-width: 300px; /* 最大宽度为300px */
  background-color: rgb(246, 246, 247);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.member-info {
  display: flex;
  align-items: center;
}

.member-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px; /* 头像与文字之间的间距 */
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-details {
  flex: 1; /* 文字部分占据剩余空间 */
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

.member-message {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .team-group {
    padding: 0 20px; /* 缩小手机端的左右内边距 */
    position: relative;
  }

  .member-cards {
    flex-direction: column; /* 手机端改为上下布局 */
    align-items: center; /* 居中对齐 */
    gap: 0;
  }

  .member-card {
    width: 100%; /* 卡片宽度填满父容器 */
    max-width: 100%; /* 最大宽度为100% */
  }

  .member-info {
    flex-direction: row; /* 手机端改为左右布局 */
    justify-content: flex-start; /* 左对齐 */
    align-items: center; /* 居中对齐 */
  }

  .member-avatar {
    margin-right: 20px; /* 调整头像与文字之间的间距 */
    margin-bottom: 0; /* 取消下方间距 */
  }

  .toggle-button {
    position: absolute;
    top: 0;
    right: 0;
  }
}

/* 大屏幕响应式设计 */
@media (min-width: 769px) {
  .member-cards {
    justify-content: flex-start; /* 卡片靠左对齐 */
  }

  .member-card {
    margin: 10px; /* 保持每个卡片周围有一定的间隔 */
  }
}
</style>
