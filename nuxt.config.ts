// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/supabase'],
  typescript: {
    typeCheck: true,
  },
  supabase: {
    redirect: false,
    // redirectOptions: {
    //   login: '/signup',
    //   callback: '/confirm',
    // },
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    },
  },
  colorMode: {
    preference: 'dark'
  }
});
