<script lang="ts" setup>
import { z } from 'zod';
import type { Database } from '~/types/supabase';
import { formatISO } from 'date-fns';

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  transaction: {
    type: Object,
    required: false,
  },
});
const emit = defineEmits(['update:modelValue', 'saved']);
const { isEdit } = toRefs(props);
// console.log('modelValue=>', props.modelValue);

// 驗證金額/描述/日期
const defaultSchema = z.object({
  amount: z.number().positive('金額必須大於 0'),
  description: z.string().optional(),
  created_at: z.string({
    required_error: '日期必填',
    // invalid_type_error: 'Name must be a string',
  }),
});
// 驗證選擇為收入
const incomeSchema = z.object({
  type: z.literal('Income'),
});
// 驗證選擇為支出/支出類別
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(['食物', '衣服', '娛樂', '電器', '生活用品']),
});
// 驗證選擇為投資
const investmentSchema = z.object({
  type: z.literal('Investment'),
});
// 驗證選擇為儲蓄
const savingSchema = z.object({
  type: z.literal('Saving'),
});
const schema = z.intersection(
  z.discriminatedUnion('type', [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);
// 編輯時才會把 transaction 傳進來
// const isEditing = computed(() => !!props.transaction);
// 傳進來的值如有改變要用 emit 傳給父元件(Index)
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    // console.log('value =>', value)
    if (!value) restForm(); // 清除表單
    emit('update:modelValue', value);
  },
});
const form = ref();
const isLoading = ref(false);

// 新增或編輯時 state
const initialState = () => {
  if (isEdit.value) {
    return {
      type: props.transaction?.type,
      amount: props.transaction?.amount,
      created_at: props.transaction?.created_at.substring(0, 10),
      description: props.transaction?.description ?? '',
      category: props.transaction?.category,
    };
  }
  return {
    type: 'Income',
    amount: 0,
    created_at: formatISO(new Date(), { representation: 'date' }),
    description: '',
    category: '',
  };
};
// 表單初始值
const state = reactive({ ...initialState() });
// 恢復表單初始值
const restForm = () => {
  // Object.assign(state, initialState);
  // 清除錯誤訊息
  form.value.clear();
};
const supabase = useSupabaseClient<Database>();
const { toastSuccess, toastError } = useCustomToast();

// 新增/修改交易
const saveTransaction = async () => {
  if (form.value.errors.length > 0) return;
  isLoading.value = true;
  try {
    const { error } = await supabase.from('transactions').upsert({
      id: props.transaction?.id,
      ...state,
    });

    if (error) {
      throw error;
    }

    toastSuccess('新增成功');

    isOpen.value = false;
    emit('saved');
  } catch (error: any) {
    toastError('新增失敗', error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UModal v-model="isOpen" prevent-close>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ isEdit ? '編輯' : '新增' }}記錄
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>

      <UForm
        :state="state"
        :schema="schema"
        ref="form"
        @submit.prevent="saveTransaction"
      >
        <!-- 交易類型 -->
        <UFormGroup class="mb-4" required label="交易類型" name="type">
          <USelect
            placeholder="請輸入交易類型"
            option-attribute="name"
            :options="selectTypes"
            v-model="state.type"
            :disabled="isEdit"
          />
        </UFormGroup>
        <!-- 金額 -->
        <UFormGroup class="mb-4" label="金額" required name="amount">
          <UInput
            type="number"
            placeholder="請輸入金額"
            v-model.number="state.amount"
          />
        </UFormGroup>
        <!-- 日期 -->
        <UFormGroup class="mb-4" label="日期" required name="created_at">
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>
        <!-- 描述 -->
        <UFormGroup class="mb-4" label="描述" hint="非必填" name="description">
          <UInput placeholder="請輸入描述" v-model="state.description" />
        </UFormGroup>
        <!-- 支出類別 -->
        <UFormGroup
          class="mb-4"
          required
          label="支出類別"
          name="category"
          v-if="state.type === 'Expense'"
        >
          <USelect
            placeholder="請輸入支出類別"
            :options="categories"
            v-model="state.category"
          />
        </UFormGroup>
        <div class="flex justify-end">
          <UButton
            type="submit"
            color="black"
            variant="solid"
            label="確定"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<style></style>
