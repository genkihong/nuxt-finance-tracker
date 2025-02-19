<script lang="ts" setup>
const links = [
  {
    label: '個人資料',
    to: '/settings/profile',
  },
  {
    label: '個人頭像',
    to: '/settings/avatar',
  },
  {
    label: '交易週期',
    to: '/settings/transaction-settings',
  },
];
</script>

<template>
  <div class="grid grid-cols-6 gap-8">
    <!-- 左側選單 -->
    <UVerticalNavigation :links="links" class="col-span-2" />
    <div class="col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>

<style></style>
