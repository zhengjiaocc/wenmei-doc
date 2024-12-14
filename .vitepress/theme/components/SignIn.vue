<template>
  <div class="sign-in-container">
    <!-- 简化头部，改为左对齐 -->
    <div class="sign-in-header">
      <div class="header-left">
        <div class="header-title">签到榜</div>
        <div class="header-subtitle">{{ totalUsers }}人已加入</div>
      </div>
      <div class="header-stats">
        <div class="today-sign">今日已有 {{ totalSignIns }} 人签到</div>
      </div>
    </div>

    <!-- 改进列表布局 -->
    <div class="sign-in-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>正在加载签到数据...</span>
      </div>

      <!-- 无数据状态 -->
      <div v-else-if="signInUsers.length === 0" class="empty-state">
        暂无签到数据
      </div>

      <!-- 有数据时显示列表 -->
      <template v-else>
        <!-- 前三名特殊展示 -->
        <div class="top-three-section">
          <div v-for="user in topThreeUsers" 
            :key="user.id"
            class="top-user-card"
            :class="`rank-${user.rank}`">
            <div class="rank-number">{{ user.rank }}</div>
            <div class="user-avatar">
              <img :src="user.avatar" :alt="user.name" />
              <div class="days-badge">{{ user.days }}天</div>
            </div>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="level-badge" :class="`level-${getLevelNumber(user.days)}`">
                LV{{ getLevelNumber(user.days) }}
              </div>
              <div class="user-description">
                {{ getUserDescription(user.days, user.rank) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 其他用户列表 -->
        <div class="sign-in-list">
          <div v-for="user in otherUsers"
            :key="user.id"
            class="sign-in-card"
            :class="`level-${getLevelNumber(user.days)}`">
            <div class="user-avatar">
              <img :src="user.avatar" :alt="user.name" />
              <div class="days-badge">{{ user.days }}天</div>
            </div>
            <div class="user-info">
              <div class="user-name-row">
                <div class="user-name">{{ user.name }}</div>
                <div class="level-badge" :class="`level-${getLevelNumber(user.days)}`">
                  LV{{ getLevelNumber(user.days) }}
                </div>
              </div>
              <div class="user-stats">
                {{ user.description || '这个人很懒，什么都没写' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getSignInData } from '../utils/api/sign.js';

const signInUsers = ref([]);
const totalSignIns = ref(0);
const totalUsers = ref(0);
const currentPage = ref(1);
const pageSize = ref(30);
const loading = ref(false);

// 修改等级判断函数
const getLevelNumber = (days) => {
  if (days >= 90) return 5;
  if (days >= 80) return 4;
  if (days >= 70) return 3;
  if (days >= 60) return 2;
  return 1;
};

// 计算前三名用户
const topThreeUsers = computed(() => {
  return signInUsers.value.slice(0, 3);
});

// 计算其他用户
const otherUsers = computed(() => {
  return signInUsers.value.slice(3);
});

// 获取签到数据
const fetchSignInData = async () => {
  try {
    loading.value = true;
    const response = await getSignInData(pageSize.value, currentPage.value);
    if (response.code === 200 && response.data) {
      // 转式
      signInUsers.value = response.data.map((item, index) => ({
        id: item.uid,
        name: item.nick,
        avatar: item.avatar,
        days: item.signCount,
        rank: index + 1,
        description: item.description
      }));
      
      // 更新统计数据
      totalUsers.value = signInUsers.value.length;
      totalSignIns.value = totalUsers.value;
    }
  } catch (error) {
    console.error('获取签到数据失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSignInData();
});

// 修改用户描述生成方法
const getUserDescription = (days, rank) => {
  // 使用用户自己的描述
  const user = signInUsers.value.find(u => u.rank === rank);
  return user?.description || "这个人很懒，什么都没写";
};
</script>

<style scoped>
/* 基础布局 */
.sign-in-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

/* 内容区域 */
.sign-in-content {
  padding: 20px 0;
  background: linear-gradient(135deg, #f5f7ff, #f8f9ff);
  border-radius: 20px;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.9),
    0 4px 20px rgba(134, 168, 231, 0.12);
}

/* 头部样式 */
.sign-in-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #7F7FD5, #86A8E7);
  border-radius: 12px;
  color: white;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.header-subtitle {
  font-size: 13px;
  opacity: 0.8;
}

.today-sign {
  font-size: 14px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}

/* 卡片基础样式 */
.sign-in-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  height: 92px;
  border: 1px solid rgba(134, 168, 231, 0.15);
  box-shadow: 0 4px 6px rgba(134, 168, 231, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  padding-bottom: 28px;
}

.sign-in-card:hover {
  transform: translateY(-2px);
  border-color: rgba(134, 168, 231, 0.25);
  box-shadow: 
    0 6px 12px rgba(134, 168, 231, 0.15),
    0 12px 24px rgba(134, 168, 231, 0.12);
}

/* 头像容器 */
.sign-in-card .user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  flex-shrink: 0;
}

/* 头像图片容器 */
.sign-in-card .user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 0 0 2px rgba(134, 168, 231, 0.2);
}

.level-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 9px;
  font-size: 9px;
  color: white;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 4px rgba(127, 127, 213, 0.1);
  opacity: 0.9;
  transition: all 0.3s ease;
  line-height: 1;
  display: flex;
  align-items: center;
  height: 14px;
  font-weight: bold;
}

/* 不同等级的背景色 */
.level-badge.level-5 {
  background: #FFB619;
}

.level-badge.level-4 {
  background: #7F7FD5;
}

.level-badge.level-3 {
  background: #CD7F32;
}

.level-badge.level-2 {
  background: #9E9E9E;
}

.level-badge.level-1 {
  background: #86A8E7;
}

.sign-in-card:hover .level-badge {
  opacity: 1;
  transform: scale(1.05);
}

/* 前三名区域 */
.top-three-section {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding: 0 ;
}

/* 前三名卡片样式 */
.top-user-card {
  flex: 1;
  max-width: calc(33.33% - 11px);
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  position: relative;
  height: 100px;
  box-shadow: 0 6px 16px rgba(134, 168, 231, 0.15);
  border: 1px solid rgba(134, 168, 231, 0.2);
  overflow: hidden;
  gap: 16px;
  position: relative;
}

/* 扫光动画 */
.top-user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 182, 25, 0.2),
    transparent
  );
  animation: shine 3s infinite linear;
}

@keyframes shine {
  to {
    left: 200%;
  }
}

.top-user-card .user-avatar {
  position: relative;
  z-index: 1;
  width: 40px;
  height: 40px;
}

.top-user-card .user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #FFB619;
  box-shadow: 
    0 0 0 2px rgba(255, 182, 25, 0.3),
    0 0 10px rgba(255, 182, 25, 0.2);
  transition: all 0.3s ease;
}

.top-user-card:hover .user-avatar img {
  transform: scale(1.05);
  border-color: #FFD700;
  box-shadow: 
    0 0 0 2px rgba(255, 215, 0, 0.4),
    0 0 15px rgba(255, 215, 0, 0.3);
}

/* 调整前三名不同的头像边框颜色 */
.rank-1 .user-avatar img {
  border-color: #FFB619;
  box-shadow: 
    0 0 0 2px rgba(255, 182, 25, 0.3),
    0 0 10px rgba(255, 182, 25, 0.2);
}

.rank-2 .user-avatar img {
  border-color: #9E9E9E;
  box-shadow: 
    0 0 0 2px rgba(158, 158, 158, 0.3),
    0 0 10px rgba(158, 158, 158, 0.2);
}

.rank-3 .user-avatar img {
  border-color: #CD7F32;
  box-shadow: 
    0 0 0 2px rgba(205, 127, 50, 0.3),
    0 0 10px rgba(205, 127, 50, 0.2);
}

.top-user-card .user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

.top-user-card .user-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-description {
  font-size: 13px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 20px;
  word-break: break-all;
  opacity: 0.8;
}

/* 排名样式优化 */
.rank-number {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式布局 */
.sign-in-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.9),
    0 2px 8px rgba(134, 168, 231, 0.08);
  border: 1px solid rgba(134, 168, 231, 0.1);
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .sign-in-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .sign-in-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .sign-in-list {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .top-three-section {
    gap: 12px;
    padding: 0 12px;
  }

  .top-user-card {
    max-width: calc(33.33% - 8px);
  }
}

@media (max-width: 768px) {
  .top-three-section {
    flex-direction: column;
    gap: 12px;
    padding: 0;
  }

  .top-user-card {
    max-width: none;
    height: 92px;
    padding: 12px;
    flex-direction: row;
  }

  .top-user-card .user-avatar,
  .top-user-card .user-avatar img {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 576px) {
  .sign-in-list {
    grid-template-columns: 1fr;
  }

  .sign-in-card {
    height: 92px;
    gap: 12px;
  }

  .sign-in-card .user-avatar {
    gap: 6px;
  }
}

/* 普通卡片的天数样式 */
.days-badge {
  font-size: 12px;
  color: #666;
  font-weight: bold;
  font-style: italic;
  position: absolute;
  bottom: -34px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

/* 特殊卡片的天数样式 */
.top-days {
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #666;
  font-weight: bold;
  font-style: italic;
}

.user-stats {
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 11px;
  color: #666;
  line-height: 1.4;
  word-break: break-all;
  margin-bottom: 4px;
  height: calc(11px * 1.4 * 2); /* 强制两行高度：字体大小 * 行高 * 2行 */
  min-height: calc(11px * 1.4 * 2);
}

/* 用户信息区域 */
.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  height: 100%;
}

/* 用户名样式 */
.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  padding-top: 4px;
}

/* 描述文本样式 */
.user-stats {
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 11px;
  color: #666;
  line-height: 1.4;
  word-break: break-all;
  max-height: 32px;
  margin-top: 13px;
}

/* 头像容器样式 */
.user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 8px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0; /* 防止图片被压缩 */
}

/* 悬浮效果 */
.sign-in-card:hover .user-avatar img,
.top-user-card:hover .user-avatar img {
  transform: scale(1.05);
  box-shadow: 0 0 0 2px rgba(134, 168, 231, 0.3);
}

/* 添加过渡效果 */
.user-avatar img {
  transition: all 0.3s ease;
}

.user-description {
  font-size: 13px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  word-break: break-all;
  opacity: 0.8;
  height: calc(13px * 1.4 * 2); /* 强制两行高度：字体大小 * 行高 * 2行 */
  min-height: calc(13px * 1.4 * 2);
}
</style> 