import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* export const getOrders = async () => {
  const token = localStorage.getItem('adminToken');

  if (!token) throw new Error('No admin token found');

  await supabase.auth.setSession({
    access_token: token,
    refresh_token: token,
  });

  const { data, error } = await supabase
    .from('Order')
    .select('*');

  if (error) throw new Error(error.message);
  return data;
}; */
