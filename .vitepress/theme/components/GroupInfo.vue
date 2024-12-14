<template>
  <div class="group-info-container">
    <!-- 左侧总览信息 -->
    <div class="overview-section">
      <h3 class="section-title">群组总览</h3>
      <div class="overview-stats">
        <div class="stat-item">
          <div class="stat-icon">🏠</div>
          <div class="stat-content">
            <div class="stat-value">{{ groups.length }}</div>
            <div class="stat-label">群组数</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalMembers }}</div>
            <div class="stat-label">总人数</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">✨</div>
          <div class="stat-content">
            <div class="stat-value">{{ signInCount }}</div>
            <div class="stat-label">今日签到</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧群组列表 -->
    <div class="groups-section">
      <h3 class="section-title">群组列表</h3>
      <div class="group-list">
        <div v-for="group in groups" 
          :key="group.groupId" 
          class="group-card">
          <div class="group-name">{{ group.groupName }}</div>
          <div class="group-stats">
            <div class="member-count">
              <span class="current">{{ group.memberCount }}</span>
              <span class="separator">/</span>
              <span class="max">{{ group.maxMemberCount }}</span>
            </div>
            <div class="group-id">{{ group.groupId }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getGroupInfo, getSignInData } from '../utils/api/sign.js';

const groups = ref([]);
const signInCount = ref(0);

const totalMembers = computed(() => {
  return groups.value.reduce((sum, group) => sum + parseInt(group.memberCount), 0);
});

const fetchData = async () => {
  try {
    // 获取群组信息
    const groupResponse = await getGroupInfo();
    if (groupResponse.code === 200) {
      groups.value = groupResponse.data;
    }

    // 获取签到信息
    const signInResponse = await getSignInData(1, 1);
    if (signInResponse.code === 200) {
      signInCount.value = signInResponse.data.length;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.group-info-container {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 20px;
}

/* 左侧总览区域 */
.overview-section {
  flex: 0 0 280px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(134, 168, 231, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.overview-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7ff, #f8f9ff);
  border-radius: 8px;
  border: 1px solid rgba(134, 168, 231, 0.15);
}

.stat-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(134, 168, 231, 0.1);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #7F7FD5;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

/* 右侧群组列表 */
.groups-section {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(134, 168, 231, 0.1);
}

.group-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.group-card {
  padding: 16px;
  background: linear-gradient(135deg, #f5f7ff, #f8f9ff);
  border-radius: 8px;
  border: 1px solid rgba(134, 168, 231, 0.15);
  transition: all 0.3s ease;
}

.group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(134, 168, 231, 0.15);
}

.group-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.group-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.member-count {
  font-size: 13px;
  color: #666;
}

.member-count .current {
  color: #7F7FD5;
  font-weight: 500;
}

.member-count .separator {
  margin: 0 4px;
  color: #999;
}

.member-count .max {
  color: #999;
}

.group-id {
  font-size: 13px;
  color: #7F7FD5;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .group-info-container {
    flex-direction: column;
  }

  .overview-section {
    flex: none;
  }

  .overview-stats {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .group-list {
    grid-template-columns: 1fr;
  }

  .overview-stats {
    flex-direction: column;
  }

  .stat-item {
    width: 100%;
  }
}
</style> 