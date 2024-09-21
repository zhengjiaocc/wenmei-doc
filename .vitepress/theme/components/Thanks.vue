<template>
    <div class="team-members">
      <!-- 页面顶部标题 -->
      <h1 class="team-title">致谢页面</h1>
      <p class="team-description">衷心感谢在此期间支持我们的人</p>
  
      <!-- 按照等级显示致谢列表 -->
      <div v-for="(level, index) in levels" :key="index" class="team-group">
        <div class="group-header">
          <h2 class="group-title">{{ level.level_name }}</h2>
        </div>
  
        <!-- 新增标语展示 -->
        <div class="group-slogan">{{ level.slogan }}</div>
  
        <!-- 按照平台显示类别组 -->
        <div v-for="(group, idx) in level.groups" :key="idx">
          <h3 class="group-description">{{ group.platform }}</h3>
  
          <!-- 成员卡片列表 -->
          <div class="member-cards">
            <div
              v-for="(member, memIdx) in group.members"
              :key="memIdx"
              :class="['member-card', { flip: (level.level_name !== '衷心感谢') }]"
              @mouseenter="hoverMember(member)"
              @mouseleave="unhoverMember(member)"
            >
              <div class="card-content">
                <!-- 正面 -->
                <div class="member-info front" v-if="!member.flipped || level.level_name === '衷心感谢'">
                  <div class="member-avatar">
                    <img :src="member.avatar" alt="avatar" />
                  </div>
                  <div class="member-details">
                    <p class="member-name">{{ member.name }}</p>
                    <p class="member-motto">{{ member.motto }}</p>
                    <p class="member-description">{{ member.descr }}</p>
                  </div>
                  <div class="member-tags">
                    <span v-for="(tag, tagIdx) in member.tags" :key="tagIdx" class="tag">{{ tag }}</span>
                  </div>
                </div>
  
                <!-- 背面 -->
                <div class="member-info back" v-if="member.flipped && level.level_name !== '衷心感谢'">
                  <p class="member-details-title">资料详情</p>
                  <p>{{ member.details.info }}</p>
                  <ul>
                    <li v-for="(link, linkIdx) in member.details.links" :key="linkIdx">
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
  </template>
  
  <script>
  import thanksData from '../data/thanks.json';
  
  export default {
    data() {
      return {
        levels: thanksData.levels
      };
    },
    methods: {
      hoverMember(member) {
        if (member.details) {
          member.flipped = true;
        }
      },
      unhoverMember(member) {
        if (member.details) {
          member.flipped = false;
        }
      }
    }
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
  
  /* 分组显示布局 */
  .team-group {
    margin-bottom: 40px;
    padding: 0 70px;
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
  
  /* 新增的标语样式 */
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
    flex-wrap: wrap; /* 当宽度不足时换行 */
    gap: 20px; /* 增加卡片间距 */
    justify-content: flex-start;
  }
  
  /* 成员卡片布局 */
  .member-card {
    background-color: rgb(246, 246, 247);
    width: calc(33.333% - 20px); /* 三列布局，卡片占1/3宽度，留出间距 */
    max-width: 300px;
    height: 150px; /* 固定高度为190px */
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 增加阴影 */
    transition: transform 0.3s ease; /* 翻转效果 */
    position: relative; /* 为标签绝对定位提供参考 */
  }
  
  .member-card:hover {
    transform: translateY(-5px); /* 鼠标悬停时轻微抬起，避免抖动 */
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
  
  /* 标签设置 */
  .member-tags {
    position: absolute;
    top: 10px;
    right: 10px;
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
  }
  
  .flip .back {
    display: block; /* 翻转后显示背面 */
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .team-group {
      padding: 0 20px; /* 缩小手机端的左右内边距 */
    }
  
    .member-cards {
      flex-direction: column; /* 小屏幕下纵向排列 */
      align-items: center; /* 居中对齐 */
    }
  
    .member-card {
      width: 100%; /* 手机端卡片占满宽度 */
    }
  }
  </style>
  