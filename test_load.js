import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://veineyycewdljbyfkdmb.supabase.co';
const supabaseKey = 'sb_publishable_L14I-tmPEif3KKHbn6Lg2g_iRINofK3';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('app_config').select('data').eq('id', 'sp_studio_config_v1').single();
  console.log('Data:', data);
  console.log('Error:', error);
}
test();
