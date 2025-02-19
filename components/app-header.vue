<script lang="ts" setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { url } = useAvatarUrl();
const avatarUrl = computed(() => {
  return url.value ?? '';
});
const items: any = [
  [
    {
      // label: user.value?.email,
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: '設定',
      icon: 'i-heroicons-cog-8-tooth',
      click: () => navigateTo('/settings/profile'),
    },
    {
      label: '登出',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: async () => {
        await supabase.auth.signOut();
        return navigateTo('/login');
      },
    },
  ],
];
</script>

<template>
  <header class="flex justify-between items-center">
    <NuxtLink to="/" class="text-xl font-bold">Finance Tracker</NuxtLink>
    <div>
      <UDropdown
        :items="items"
        :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
        v-if="user"
      >
        <UAvatar :src="avatarUrl" alt="Avatar" />
        <template #account>
          <div class="text-left">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ user.email }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>
          <UIcon
            :name="item.icon"
            class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
          />
        </template>
      </UDropdown>
    </div>
  </header>
</template>

<style></style>
