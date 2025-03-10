<script lang="ts" setup>
import { format } from 'date-fns';
// definePageMeta({
//   middleware: 'auth',
// });

const isOpen = ref(false);

const user = useSupabaseUser();
// console.log(user.value);
const selectedView = ref(
  user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1].value
);
const selectedCycle = computed(() => {
  if (selectedView.value === 'yearly') return `${format(new Date(), 'yyyy')} 年`;
  if (selectedView.value === 'monthly') return `${format(new Date(), 'yyyy-MM')} 月`;
  return `${format(new Date(), 'yyyy-MM-dd')} `;
});

// 依年/月/日選單取得開始和結束時間
const { current, previous } = useSelectPeriod(selectedView);
// 當年/月/日交易記錄
const {
  isLoading,
  refresh,
  transactions: {
    groupedBydate,
    incomeCount,
    incomeTotal,
    expenseCount,
    expenseTotal,
  },
} = useFetchTransactions(current);

await refresh();

// const {
//   refresh: refreshPrevious,
//   transactions: {
//     incomeTotal: prevIncomeTotal,
//     expenseTotal: prevExpenseTotal,
//   },
// } = useFetchTransactions(previous);

// await Promise.all([refreshCurrent(), refreshPrevious()]);

/* 此寫法會請求二次
const { data, error } = await supabase
  .from('transactions')
  .select()
*/
// console.log('groupedBydate', groupedBydate.value);
</script>

<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="text-4xl font-extrabold">{{ selectedCycle }}總計</h1>
    <div>
      <USelectMenu
        value-attribute="value"
        option-attribute="name"
        :options="transactionViewOptions"
        v-model="selectedView"
      />
    </div>
  </section>

  <!-- <ClientOnly> -->
  <!-- 計算收入/支出/投資/儲蓄趨勢 -->
  <section class="grid grid-cols-1 sm:grid-cols-2 sm:gap-16 mb-10">
    <Trend
      color="green"
      title="收入"
      :amount="incomeTotal"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="支出"
      :amount="expenseTotal"
      :loading="isLoading"
    />
    <!-- <Trend
        color="green"
        title="投資"
        :amount="4000"
        :last-amount="3000"
        :loading="isLoading"
      />
      <Trend
        color="red"
        title="儲蓄"
        :amount="4000"
        :last-amount="4100"
        :loading="isLoading"
      /> -->
  </section>
  <!-- 總收入及支出筆數 -->
  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">總收入及支出筆數</h2>
      <div class="text-gray-500 dark:text-gray-400">
        <span class="mr-4">總收入: {{ incomeCount }} 筆</span>
        <span>總支出: {{ expenseCount }} 筆</span>
      </div>
    </div>
    <!-- 新增交易 Modal -->
    <div>
      <TransactionModal v-model="isOpen" :isEdit="false" @saved="refresh" />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="新增"
        @click="isOpen = true"
      />
    </div>
  </section>
  <!-- 依日期群組交易統計 -->
  <section v-if="!isLoading">
    <!-- v-for="(value, key, index) in myObject" -->
    <div
      v-for="(transactionOnDay, date) of groupedBydate"
      :key="date"
      class="mb-10"
    >
      <!-- 每日總計 -->
      <DailyTransactionSummary :date="date" :transactions="transactionOnDay" />
      <!-- 當日所有交易記錄 -->
      <Transaction
        v-for="transaction of transactionOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @edited="refresh"
        @deleted="refresh"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i of 4" :key="i" />
  </section>
  <!-- </ClientOnly> -->
</template>

<style></style>
