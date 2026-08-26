import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://veineyycewdljbyfkdmb.supabase.co';
const supabaseKey = 'sb_publishable_L14I-tmPEif3KKHbn6Lg2g_iRINofK3';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: existing } = await supabase.from('app_config').select('id').eq('id', 'sp_studio_config_v1').single();
  console.log('Existing:', existing);
  const res = await supabase.from('app_config').update({ data: { a: 1 }, updated_at: new Date().toISOString() }).eq('id', 'sp_studio_config_v1');
  console.log('Update res:', res);
  
  const { data: after } = await supabase.from('app_config').select('data').eq('id', 'sp_studio_config_v1').single();
  console.log('After:', after);
}
test();
