import type { Database } from '~~/types/supabase';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);
  // console.log(body);
  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      emailRedirectTo: 'http://localhost:3000/signup',
    },
  });
  if (error) {
    throw createError({
      statusCode: error.status,
      statusMessage: error.message,
    });
  }
  return data;
});
