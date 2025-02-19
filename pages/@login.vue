<script lang="ts" setup>
const isSuccess = ref(false);
const email = ref('');
const isLoading = ref(false);
const { toastError } = useCustomToast();
const supabase = useSupabaseClient();

useRedirectIfAuthenticated();

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm',
      },
    });

    if (error) {
      throw error;
    }

    isSuccess.value = true;
  } catch (error: any) {
    toastError('登入失敗', '帳號或密碼錯誤!');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UCard v-if="!isSuccess">
    <template #header> 登入 </template>

    <form @submit.prevent="handleLogin">
      <UFormGroup
        class="mb-4"
        label="Email"
        name="email"
        required
        help="您將會收到確認連結的電子郵件"
      >
        <UInput type="email" placeholder="Email" v-model="email" />
      </UFormGroup>
      <div class="flex justify-end">
        <UButton
          type="submit"
          color="black"
          variant="solid"
          :loading="isLoading"
          :disabled="isLoading"
          >登入</UButton
        >
      </div>
    </form>
  </UCard>

  <UCard v-else>
    <div class="text-center">
      <p class="mb-4">
        已寄出電子郵件至 <strong>{{ email }}</strong
        >，請確認連結後登入
      </p>
      <p><strong>注意:</strong> 此連結在 5 分鐘後將會失效</p>
    </div>
  </UCard>
</template>

<style></style>
