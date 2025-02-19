export const useCurrency = (amount: Ref<number>) => {
  // console.log('useCurrency amount is ref', isRef(amount));
  const currency = computed(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount.value);
    // .format(isRef(amount) ? amount.value : amount);
  });
  return {
    currency,
  };
};
