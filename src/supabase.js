import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtoahvrajhjytmjhurjb.supabase.co';
const supabaseAnonKey = 'sb_publishable_ngyKixxJIvDfeS9EdMT7sw_GkcBdF7K';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
