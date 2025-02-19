<script lang="ts" setup>
const props = defineProps<{
  title: string;
  // 現在一年/月/日總金額
  amount: number;
  // 過去一年/月/日總金額
  // lastAmount: number | undefined;
  color: string;
  loading: Boolean;
}>();
// const { amount } = toRefs(props);
const amount = computed(() => {
  return props.amount ?? 0;
});
// const lastAmount = computed(() => {
//   return props.lastAmount ?? 0;
// });
//幣值格式化
const { currency } = useCurrency(amount);
//趨勢是否為上升
// const trandingUp = computed(() => amount.value >= lastAmount.value);
//圖示
// const icon = computed(() =>
//   trandingUp.value
//     ? 'i-heroicons-arrow-trending-up'
//     : 'i-heroicons-arrow-trending-down'
// );
//計算上升或下降百分比
// const percentageTrend = computed(() => {
//   if (amount.value === 0 || lastAmount.value === 0) return '0%';
//   const bigger = Math.max(amount.value, lastAmount.value);
//   const lower = Math.min(amount.value, lastAmount.value);
//   const ratio = ((bigger - lower) / lastAmount.value) * 100;
//   // console.log(bigger, lower, ratio, Math.ceil(ratio));
//   return `${Math.ceil(ratio)}%`;
// });
</script>

<template>
  <div>
    <div class="font-bole" :class="color">{{ title }}</div>
    <div class="text-2xl font-exrabold text-black dark:text-white mb-2">
      <USkeleton class="h-8 w-full" v-if="loading" />
      <div v-else>{{ currency }}</div>
    </div>
    <!-- <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="[trandingUp ? 'green' : 'red']"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageTrend }} vs last period
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
