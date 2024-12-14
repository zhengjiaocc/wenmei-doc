<template>
  <div class="group-info-container">
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGroupInfo } from '../utils/api/sign.js';

const groups = ref([]);

const fetchGroupInfo = async () => {
  try {
    const response = await getGroupInfo();
    if (response.code === 200) {
      groups.value = response.data;
    }
  } catch (error) {
    console.error('获取群组信息失败:', error);
  }
};

onMounted(() => {
  fetchGroupInfo();
});
</script>

<style scoped>
.group-info-container {
  margin-bottom: 24px;
  padding: 20px ;
}

.group-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.group-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 4px 6px rgba(134, 168, 231, 0.1);
  border: 1px solid rgba(134, 168, 231, 0.15);
  transition: all 0.3s ease;
}

.group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(134, 168, 231, 0.15);
}

.group-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.group-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.member-count {
  font-size: 14px;
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
  font-size: 14px;
  color: #7F7FD5;
  font-weight: 500;
}

@media (max-width: 768px) {
  .group-card {
    min-width: 150px;
  }
}
</style> 