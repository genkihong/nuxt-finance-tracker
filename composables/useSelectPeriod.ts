import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  sub,
} from 'date-fns';

export const useSelectPeriod = (period: Ref<string>) => {
  const current = computed(() => {
    // 每年
    if (period.value === 'yearly') {
      return {
        from: startOfYear(new Date()), // 今年第一天 2025/01/01 00:00:00
        to: endOfYear(new Date()), // 今年最後一天 2025/12/31 23:59:59
      };
    }
    // 每月
    if (period.value === 'monthly') {
      return {
        from: startOfMonth(new Date()), // 今年當月第一天 2025/02/01 00:00:00
        to: endOfMonth(new Date()), // 今當月最後一天 2025/02/28 23:59:59
      };
    }
    // 每日
    return {
      from: startOfDay(new Date()), // 當天 00:00:00
      to: endOfDay(new Date()), // 當天 23:59:59
    };
  });

  const previous = computed(() => {
    // 每年
    if (period.value === 'yearly') {
      return {
        from: startOfYear(sub(new Date(), { years: 1 })), // 去年第一天 2024/01/01 00:00:00
        to: endOfYear(sub(new Date(), { years: 1 })), // 去年最後一天 2024/12/31 23:59:59
      };
    }
    // 每月
    if (period.value === 'monthly') {
      return {
        from: startOfMonth(sub(new Date(), { months: 1 })), // 今年上月第一天 2024/01/01 00:00:00
        to: endOfMonth(sub(new Date(), { months: 1 })), // 今年上月最後一天 2024/01/31 23:59:59
      };
    }
    // 每日
    return {
      from: startOfDay(sub(new Date(), { days: 1 })), // 昨天 00:00:00
      to: endOfDay(sub(new Date(), { days: 1 })), // 昨天 23:59:59
    };
  });

  return { current, previous };
};
