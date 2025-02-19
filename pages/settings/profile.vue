<script lang="ts" setup>
import { z } from 'zod';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useCustomToast();
// 驗證name, email
const schema = z.object({
  name: z.string().min(2, { message: '姓名長度至少2個字' }).optional(),
  email: z.string().email({ message: 'email 格式錯誤!' }),
});

const isLoading = ref(false);
const state = reactive({
  name: user.value?.user_metadata?.full_name ?? '',
  email: user.value?.email ?? '',
});
// 更新使用者
const updateUser = async () => {
  isLoading.value = true;
  try {
    const userData = {
      email: '',
      data: {
        full_name: state.name,
      },
    };

    if (state.email !== user.value?.email) {
      userData.email = state.email;
    }
    // console.log(userData);
    const { error } = await supabase.auth.updateUser(userData);

    if (error) throw error;

    toastSuccess('修改成功', '個人資料已經更新');
  } catch (error: any) {
    toastError('修改失敗', error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UForm :state="state" :schema="schema" @submit.prevent="updateUser">
    <UFormGroup class="mb-4" label="名稱" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup
      class="mb-4"
      label="Email"
      name="email"
      help="如果更改電子郵件，您將會在新電子郵件和舊電子郵件收到確認信"
    >
      <UInput v-model="state.email" />
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
