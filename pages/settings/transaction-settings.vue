<script lang="ts" setup>
import { z } from 'zod';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useCustomToast();

const VALUES = ['yearly', 'monthly', 'daily'] as const;
const schema = z.object({
  transactionView: z.enum(VALUES),
});

const isLoading = ref(false);
const state = reactive({
  transactionView: user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1].value,
});

const saveSettings = async () => {
  isLoading.value = true;

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.transactionView,
      },
    });
    if (error) throw error;
    toastSuccess('修改成功');
  } catch (error: any) {
    toastError('修改成功', error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UForm :state="state" :schema="schema" @submit.prevent="saveSettings">
    <UFormGroup
      label="交易統計週期"
      class="mb-4"
      help="選擇交易統計週期"
    >
      <USelect
        value-attribute="value"
        option-attribute="name"
        :options="transactionViewOptions"
        v-model="state.transactionView"
      />
    </UFormGroup>
    <div class="flex justify-end items-center">
      <UButton
        type="submit"
        color="sky"
        variant="outline"
        label="確定"
        :isLoading="isLoading"
        :disabled="isLoading"
      />
    </div>
  </UForm>
</template>

<style></style>
