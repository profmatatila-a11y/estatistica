
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase credentials. Interactions with the database will fail.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
