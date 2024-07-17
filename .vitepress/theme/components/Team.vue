<template>
  <div class="team-members">
    <!-- 页面顶部标题 -->
    <h1 class="team-title">我们</h1>
    <!-- 标题下方描述 -->
    <p class="team-description">这是我们团队的小伙伴</p>

    <!-- 分组显示成员列表 -->
    <div
      v-for="(group, index) in groupedMembers"
      :key="index"
      class="team-group"
    >
      <h2 class="group-title">{{ group.class_name }}</h2>
      <p class="group-description">{{ group.descr }}</p>

      <!-- 成员卡片列表 -->
      <div class="member-cards">
        <div
          v-for="(member, idx) in group.link_list"
          :key="idx"
          class="member-card"
        >
          <div class="member-avatar">
            <img :src="member.avatar" alt="avatar" />
          </div>
          <p class="member-name">{{ member.name }}</p>
          <p class="member-info">{{ member.descr }}</p>
          <p class="member-message">{{ member.message }}</p>
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
      // 模拟从 YAML 文件中获取的数据
      links: teamData,
    };
  },
  computed: {
    // 根据 links 数据分组处理成员列表
    groupedMembers() {
      let grouped = {};
      this.links.forEach((group) => {
        grouped[group.class_name] = {
          class_name: group.class_name,
          descr: group.descr,
          link_list: group.link_list,
        };
      });
      return Object.values(grouped);
    },
  },
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

.member-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 5px; /* 设置卡片之间的间隔 */
}

.member-card {
  width: 200px;
  height: auto;
  background-color: rgb(246, 246, 247);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin: 0 auto; /* 确保卡片居中 */
}

.member-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 10px;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.member-info {
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
    padding: 0 20px;
  }

  .member-cards {
    flex-direction: column;
    align-items: center;
  }

  .member-card {
    width: 100%;
    max-width: 300px;
    margin: 10px 0; /* 确保卡片上下有间隔 */
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
