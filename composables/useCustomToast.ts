export const useCustomToast = () => {
  const toast = useToast();
  return {
    toastSuccess: (title: string, description: any = null) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-check-circle',
        color: 'green',
        timeout: 1000,
      });
    },
    toastError: (title: string, description: any = null) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
        timeout: 3000,
      });
    },
  };
};
