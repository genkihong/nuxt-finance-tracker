<script lang="ts" setup>
import { z } from 'zod';

const { toastSuccess, toastError } = useCustomToast();
const supabase = useSupabaseClient();
const redirectUrl = useRuntimeConfig().public.baseUrl

const items = [
  {
    slot: 'login',
    label: '登入',
  },
  {
    slot: 'signup',
    label: '註冊',
  },
];
const loginSchema = z.object({
  email: z.string().email({ message: 'email 格式錯誤!' }),
  password: z.string().min(6, { message: '密碼長度至少6碼' }),
});
const signUpschema = z.object({
  email: z.string().email({ message: 'email 格式錯誤!' }),
  password: z.string().min(6, { message: '密碼長度至少6碼' }),
});
const isLoading = ref(false);
const loginForm = reactive({
  email: '',
  password: '',
});
const signupForm = reactive({
  email: '',
  password: '',
});

useRedirectIfAuthenticated();

const login = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });
    if (error) {
      throw createError({
        statusCode: error.status,
        statusMessage: error.message,
      });
    }
    // const res = await $fetch('/api/login', {
    //   method: 'POST',
    //   body: {
    //     email: loginForm.email,
    //     password: loginForm.password,
    //   },
    // });
    return navigateTo('/');
  } catch (error: any) {
    toastError('登入失敗', '帳號或密碼錯誤!');
  } finally {
    isLoading.value = false;
  }
};
const signUp = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase.auth.signUp({
      email: signupForm.email,
      password: signupForm.password,
      // options: {
      //   emailRedirectTo: `${redirectUrl}/login`,
      // },
    });

    if (error) {
      throw createError({
        statusCode: error.status,
        statusMessage: error.message,
      });
    }
    // const res = await $fetch('/api/signup', {
    //   method: 'POST',
    //   body: {
    //     email: signupForm.email,
    //     password: signupForm.password,
    //   },
    // });

    toastSuccess('註冊成功');
    // reloadNuxtApp();
  } catch (error: any) {
    toastError('註冊失敗', error.statusMessage);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UTabs :items="items" class="w-full max-w-2xl mx-auto">
    <template #default="{ item, selected }">
      <span
        class="truncate text-lg"
        :class="[selected && 'text-blue-500 dark:text-primary-400']"
        >{{ item.label }}</span
      >
    </template>

    <template #login="{ item }">
      <UCard>
        <template #header>
          <h2
            class="text-center font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ item.label }}
          </h2>
        </template>

        <UForm :state="loginForm" :schema="loginSchema" @submit.prevent="login">
          <UFormGroup label="Email" name="email" class="mb-4">
            <UInput
              v-model="loginForm.email"
              icon="i-heroicons-envelope-20-solid"
              required
            />
          </UFormGroup>
          <UFormGroup label="Password" name="password" class="mb-6">
            <UInput
              type="password"
              v-model="loginForm.password"
              icon="i-heroicons-key-20-solid"
              required
            />
          </UFormGroup>

          <UButton
            type="submit"
            color="cyan"
            variant="outline"
            size="xl"
            block
            :loading="isLoading"
            :disabled="isLoading"
          >
            登入
          </UButton>
        </UForm>
      </UCard>
    </template>

    <template #signup="{ item }">
      <UCard>
        <template #header>
          <h2
            class="text-center font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ item.label }}
          </h2>
        </template>

        <UForm
          :state="signupForm"
          :schema="signUpschema"
          @submit.prevent="signUp"
        >
          <UFormGroup
            label="Email"
            name="email"
            class="mb-4"
            help="您將會收到驗證連結電子郵件"
          >
            <UInput
              v-model="signupForm.email"
              icon="i-heroicons-envelope-20-solid"
              required
            />
          </UFormGroup>
          <UFormGroup label="Password" name="password" class="mb-6">
            <UInput
              type="password"
              v-model="signupForm.password"
              icon="i-heroicons-key-20-solid"
              required
            />
          </UFormGroup>

          <UButton
            type="submit"
            color="sky"
            variant="outline"
            size="xl"
            block
            :loading="isLoading"
            :disabled="isLoading"
          >
            註冊
          </UButton>
        </UForm>
      </UCard>
    </template>
  </UTabs>
</template>

<style></style>
