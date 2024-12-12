<script setup>
import { computed } from 'vue';
import { FRIEND_DATA } from '../data/friend-data';
import { slugify } from '@mdit-vue/shared';

const { title, items } = FRIEND_DATA;

const formatTitle = computed(() => slugify(title));
</script>

<template>
  <div class="friend-links-container pt-8">
    <div class="friend-links">
      <div
        v-for="item in items"
        :key="item.link"
        class="friend-link"
      >
        <a :href="item.link" target="_blank" rel="noopener noreferrer" class="friend-link-content">
          <div class="friend-link-header">
            <div class="friend-link-icon-box">
              <img :src="item.icon" alt="icon" class="friend-link-icon" />
            </div>
            <div class="friend-link-name">{{ item.title }}</div>
          </div>
          <div class="friend-link-description">
            <p class="description-p">{{ item.desc }}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friend-links-container {
  width: 100%;
  padding: 2rem 0;
}

.friend-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); /* 自适应卡片数量 */
  grid-gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

@media (min-width: 500px) {
  .friend-links {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

@media (min-width: 640px) {
  .friend-links {
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  }
}

@media (min-width: 768px) {
  .friend-links {
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  }
}

@media (min-width: 960px) {
  .friend-links {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
}

@media (min-width: 1440px) {
  .friend-links {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

.friend-link {
  background-color: #f6f6f7; /* 卡片背景颜色 */
  padding: 12px; /* 调整为12px */
  border-radius: 8px;
  border: 2px solid transparent; /* 初始边框透明 */
  text-align: center;
  transition: border-color 0.3s ease; /* 只改变边框颜色 */
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
}

.friend-link:hover {
  border-color: rgb(215, 102, 164); /* 鼠标悬浮时边框颜色变 */
}

.friend-link-content {
  display: block;
  color: #333;
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.friend-link-header {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 0.5rem; /* 缩小上下部分间距 */
}

.friend-link-icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  border-radius: 6px;
  width: 40px;
  height: 40px;
  background-color: #e5e5e5;
  transition: background-color 0.25s;
}

.friend-link-icon {
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 4px;
}

.friend-link-name {
  flex: 1;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: left;
}

.friend-link-description {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多显示两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  margin-top: 4px; /* 更小的上边距 */
  margin-bottom: 4px; /* 更小的下边距 */
  line-height: 1.5;
  font-size: 12px;
  color: #777;
  text-align: left; /* 描述文字靠左 */
}

.description-p {
    margin: 0 !important;
}
</style>
