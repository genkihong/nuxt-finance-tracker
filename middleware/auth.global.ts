export default defineNuxtRouteMiddleware((to, from) => {
  // console.log(to)
  if (to.path === '/login') {
    return;
  }
  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo('/login');
  }
});
