import type { Database } from '~~/types/supabase';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);
  const { from, to } = query;

  const { data, error } = await client
    .from('transactions')
    .select()
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at', { ascending: false });

  if (error) return [];

  return data;
});
