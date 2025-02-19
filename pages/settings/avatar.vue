<script lang="ts" setup>
import { format } from 'date-fns';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useCustomToast();
const { url } = useAvatarUrl();

const uploading = ref(false);
const fileInput = ref();

const avatarUrl = computed(() => {
  return url.value ?? '';
});
// 取得圖片副檔名，建立新檔名
const getFileName = (file: any) => {
  // console.log(file);
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar_${format(new Date(), 'yyyyMMddHHmmss')}.${fileExt}`;
  // console.log('upload', fileName);
  return fileName;
};
// 更新使用者圖片
const updateAvatarImage = async (fileName: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });
    if (error) throw error;
  } catch (error: any) {
    toastError('更新圖片錯誤!', error.message);
  }
};
// 刪除舊圖片
const removeAvatarImage = async (currentAvatarUrl: string) => {
  try {
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarUrl]);
      if (error) throw error;
    }
  } catch (error: any) {
    toastError('刪除圖片錯誤!', error.message);
  }
};
// 上傳圖片
const uploadAvatarImage = async () => {
  try {
    uploading.value = true;
    const file = fileInput.value.input.files[0];

    if (!file) {
      toastError('請選擇圖片');
      return;
    }

    // 取得圖片副檔名，建立新檔名
    const fileName = getFileName(file);
    // 上傳圖片
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (error) throw error;
    // 更新使用者圖片
    updateAvatarImage(fileName);
    // 目前使用者圖片
    const currentAvatarUrl = user.value?.user_metadata?.avatar_url;
    // 刪除舊圖片
    if (currentAvatarUrl) {
      removeAvatarImage(currentAvatarUrl);
    }

    fileInput.value.input.value = null;
    toastSuccess('上傳圖片成功');
  } catch (error: any) {
    toastError('上傳圖片錯誤!', error.message);
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div>
    <UFormGroup class="mb-4">
      <UAvatar :src="avatarUrl" size="3xl" />
    </UFormGroup>
    <UFormGroup
      label="上傳圖片"
      class="mb-4"
      name="avatar"
      help="圖片容量須小於 2 MB"
    >
      <UInput type="file" ref="fileInput" icon="i-heroicons-folder" />
    </UFormGroup>
    <div class="flex justify-end items-center">
      <UButton
        type="submit"
        color="sky"
        variant="outline"
        label="上傳"
        :loading="uploading"
        :disabled="uploading"
        @click="uploadAvatarImage"
      />
    </div>
  </div>
</template>

<style></style>
