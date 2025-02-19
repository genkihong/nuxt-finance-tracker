import { formatISO } from 'date-fns';
import type { Period, Transaction } from '~/types/type';

export const useFetchTransactions = (period: Ref<Period>) => {
  const supabase = useSupabaseClient();
  // const transactions = ref<Transaction[]>([]);
  const transactions = useState<Transaction[]>('transaction', () => []);
  const isLoading = ref(false);

  // console.log('useTransactions period is ref', isRef(period));
  // console.log('from ISO', period.value.from.toISOString())
  // console.log('from =>', period.value.from);
  // console.log('from 2', formatISO(period.value.from));
  // console.log('to ISO', period.value.to.toISOString())
  // console.log('to =>', period.value.to);
  //收入
  const income = computed(() =>
    transactions.value.filter((item: Transaction) => item.type === 'Income')
  );
  //總收入
  const incomeTotal = computed(() => {
    return income.value.reduce(
      (sum: number, transaction: Transaction) => sum + transaction.amount,
      0
    );
  });
  //支出
  const expense = computed(() =>
    transactions.value.filter((item: Transaction) => item.type === 'Expense')
  );
  //總支出
  const expenseTotal = computed(() => {
    return expense.value.reduce(
      (sum: number, transaction: Transaction) => sum + transaction.amount,
      0
    );
  });
  //收入筆數
  const incomeCount = computed(() => income.value.length);
  //支出筆數
  const expenseCount = computed(() => expense.value.length);

  // 依日期取得 transactions 資料
  const { data, refresh } = useAsyncData(
    `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
    async () => {
      const { data } = await supabase
        .from('transactions')
        .select()
        .gte(
          'created_at',
          formatISO(period.value.from, { representation: 'date' })
        )
        .lte(
          'created_at',
          formatISO(period.value.to, { representation: 'date' })
        )
        .order('created_at', { ascending: false });

      transactions.value = data as Transaction[];
      return data as Transaction[];
    },
    {
      watch: [period],
    }
  );

  // const refreshData = async () => {
  //   await refresh();
  //   transactions.value = data.value as any;
  // };

  // watch(period, async () => {
  //   await refreshData();
  // });

  //#region
  // const fetchTransactions = async <Transaction>() => {
  //   isLoading.value = true;
  //   try {
  //     const { data } = await useAsyncData(
  //       `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
  //       async () => {
  //         const { data, error } = await supabase
  //           .from('transactions')
  //           .select()
  //           .gte(
  //             'created_at',
  //             formatISO(period.value.from, { representation: 'date' })
  //           )
  //           .lte(
  //             'created_at',
  //             formatISO(period.value.to, { representation: 'date' })
  //           )
  //           .order('created_at', { ascending: false });

  //         if (error) return [];
  //         transactions.value = data;
  //         // console.log('data =>', data);
  //         return data as Transaction[];
  //       },
  //       {
  //         watch: [period],
  //       }
  //     );

  //     return data.value as Transaction[];
  //     // console.log('data value =>', data.value);
  //     // console.log('transactions =>', transactions.value);
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };
  //#endregion
  //#region
  // const getTransactions = async () => {
  //   isLoading.value = true;
  //   try {
  //     const data = await $fetch('/api/transactions', {
  //       method: 'get',
  //       query: {
  //         from: formatISO(period.value.from, { representation: 'date' }),
  //         to: formatISO(period.value.to, { representation: 'date' }),
  //       },
  //     });
  //     // console.log('fetch transactions =>', data);
  //     transactions.value = data as any;
  //     // console.log('transactions =>', transactions.value)
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };
  // const refresh = async () =>
  //   (transactions.value = await fetchTransactions<Transaction>());
  //#endregion
  // 依日期群組
  const transactionsGroupedByDate = computed(() => {
    const grouped: { [key: string]: Transaction[] } = {}; //{2025-01-01:[{id:1,type:'Income',category:'',amount:0,description:'',created_at:''}]}
    // console.log('transactions', transactions.value);
    for (const transaction of transactions.value) {
      // 取出年月日
      const date = transaction.created_at.substring(0, 10);
      // console.log('date', date);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    }

    return grouped;
    //#region sort on frontend
    // const sortedKeys = Object.keys(grouped).sort().reverse()
    // const sortedGrouped = {}
    // for (const key of sortedKeys) {
    //   sortedGrouped[key] = grouped[key]
    // }
    // return sortedGrouped
    //#endregion
  });

  return {
    isLoading,
    transactions: {
      income,
      incomeCount,
      incomeTotal,
      expense,
      expenseCount,
      expenseTotal,
      list: transactions,
      groupedBydate: transactionsGroupedByDate,
    },
    refresh,
  };
};
