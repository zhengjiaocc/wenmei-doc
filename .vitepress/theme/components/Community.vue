<template>
  <div class="community-container">
    <!-- 群组信息 -->
    <GroupInfo />
    
    <!-- 签到榜 -->
    <SignIn />
  </div>
</template>

<script setup>
import GroupInfo from './GroupInfo.vue';
import SignIn from './SignIn.vue';
</script>

<style scoped>
.community-container {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
}
</style>