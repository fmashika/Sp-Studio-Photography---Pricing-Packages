import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://veineyycewdljbyfkdmb.supabase.co';
const supabaseKey = 'sb_publishable_L14I-tmPEif3KKHbn6Lg2g_iRINofK3';

export const supabase = createClient(supabaseUrl, supabaseKey);
