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
            <div class="shine"></div>
            <div class="user-avatar">
              <img :src="user.avatar" :alt="user.name" />
            </div>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-stats">
                <span class="top-level">Level {{ getLevelNumber(user.days) }}</span>
                <span class="top-days">{{ user.days }}天</span>
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
            class="sign-in-card">
            <div class="level-badge">Level {{ getLevelNumber(user.days) }}</div>
            <div class="user-avatar">
              <img 
                :src="user.avatar"
                :alt="user.name"
              />
            </div>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-stats">
                <span class="stats-badge">
                  <span class="days-number">{{ user.days }}</span>
                  <span class="days-label">天</span>
                </span>
                <span class="time-divider">·</span>
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
  if (days >= 900) return 5;
  if (days >= 600) return 4;
  if (days >= 300) return 3;
  if (days >= 100) return 2;
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
      // 转格式
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 内容区域 */
.sign-in-content {
  padding: 20px;
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
  position: relative;
  height: 85px;
  border: 1px solid rgba(134, 168, 231, 0.15);
  box-shadow: 
    0 4px 6px rgba(134, 168, 231, 0.1),
    0 8px 16px rgba(134, 168, 231, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.sign-in-card:hover {
  transform: translateY(-2px);
  border-color: rgba(134, 168, 231, 0.25);
  box-shadow: 
    0 6px 12px rgba(134, 168, 231, 0.15),
    0 12px 24px rgba(134, 168, 231, 0.12);
}

.user-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.level-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 1px 6px;
  font-size: 12px;
  color: #7F7FD5;
  background: linear-gradient(135deg, rgba(127, 127, 213, 0.15), rgba(134, 168, 231, 0.15));
  border-radius: 6px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 4px rgba(127, 127, 213, 0.1);
  font-size: 11px;
}

/* 前三名区域 */
.top-three-section {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding: 0 20px;
}

/* 前三名卡片样式 */
.top-user-card {
  flex: 1;
  max-width: calc(33.33% - 11px);
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  height: 205px;
  box-shadow: 
    0 6px 16px rgba(134, 168, 231, 0.15),
    0 12px 24px rgba(134, 168, 231, 0.1);
  border: 1px solid rgba(134, 168, 231, 0.2);
  overflow: hidden;
}

.top-user-card:hover {
  transform: translateY(-3px);
  border-color: rgba(134, 168, 231, 0.3);
  box-shadow: 
    0 8px 20px rgba(134, 168, 231, 0.2),
    0 16px 32px rgba(134, 168, 231, 0.15);
}

.top-user-card .user-avatar {
  width: 56px;
  height: 56px;
  margin-bottom: 12px;
}

.top-user-card .user-info {
  height: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  padding: 0 12px;
}

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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rank-1 .rank-number { color: #FFB619; }
.rank-2 .rank-number { color: #9E9E9E; }
.rank-3 .rank-number { color: #CD7F32; }

/* 用户信息样式 */
.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-stats {
  height: 36px; /* 固定高度为两行文本 */
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #666;
  line-height: 18px;
}

.user-stats > :last-child {
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.stats-badge {
  padding: 2px 8px;
  background: rgba(134, 168, 231, 0.08);
  border-radius: 6px;
  color: #7F7FD5;
  white-space: nowrap;
}

.user-description {
  height: 40px; /* 固定高度为两行文本 */
  font-size: 13px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 20px;
  word-break: break-all;
}

/* 响应式布局 */
.sign-in-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
    max-width: calc(33.33% - 8px); /* 调整间距 */
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
  }
}

@media (max-width: 576px) {
  .sign-in-list {
    grid-template-columns: 1fr;
  }

  .top-user-card {
    min-height: 100px;
    flex-direction: row;
    padding: 12px;
  }
  
  .top-user-card .user-avatar {
    margin-bottom: 0;
    margin-right: 12px;
  }
  
  .top-user-card .user-info {
    height: 100%;
    padding: 0;
    justify-content: center;
  }
  
  .sign-in-card {
    min-height: 64px;
  }

  .user-description {
    height: 20px; /* 移动端只显示一行 */
    -webkit-line-clamp: 1;
  }
}
</style> 