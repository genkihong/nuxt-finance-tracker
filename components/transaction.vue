<script setup>
const props = defineProps({
  transaction: Object,
});

const emit = defineEmits(['edited', 'deleted']);

const amount = computed(() => {
  return props.transaction.amount;
});

const { currency } = useCurrency(amount);

const isIncome = computed(() => props.transaction.type === 'Income');
const icon = computed(() =>
  isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
);
const iconColor = computed(() =>
  isIncome.value ? 'text-green-600' : 'text-red-600'
);

const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useCustomToast();
// 刪除
const deleteTransaction = async () => {
  isLoading.value = true;
  try {
    await supabase.from('transactions').delete().eq('id', props.transaction.id);

    toastSuccess('刪除成功');

    emit('deleted', props.transaction.id);
  } catch (error) {
    toastError('刪除失敗');
  } finally {
    isLoading.value = false;
  }
};
const isOpen = ref(false);
// 下拉式按鈕群組
const items = [
  [
    {
      label: '編輯',
      class: 'text-blue-500',
      iconClass: 'text-blue-500',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => {
        isOpen.value = true;
      },
    },
    {
      label: '刪除',
      class: 'text-red-500',
      iconClass: 'text-red-500',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction,
    },
  ],
];
</script>

<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between col-span-2">
      <!-- 描述 -->
      <div class="flex items-center space-x-1">
        <!-- 圖示 -->
        <UIcon :name="icon" :class="iconColor" />
        <div>{{ transaction.description }}</div>
      </div>
      <!-- 類別 -->
      <div class="min-w-fit">
        <UBadge color="white" v-if="transaction.category">
          {{ transaction.category }}
        </UBadge>
      </div>
    </div>

    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <!-- 下拉式按鈕 -->
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <!-- 編輯/刪除按鈕 -->
        <UButton
          color="white"
          variant="ghost"
          trailing-icon="i-heroicons-ellipsis-horizontal"
          :loading="isLoading"
        />
        <TransactionModal
          v-model="isOpen"
          :transaction="transaction"
          :isEdit="true"
          @saved="emit('edited')"
        />
      </UDropdown>
    </div>
  </div>
</template>
