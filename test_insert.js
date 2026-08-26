import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const supabaseUrl = 'https://veineyycewdljbyfkdmb.supabase.co';
const supabaseKey = 'sb_publishable_L14I-tmPEif3KKHbn6Lg2g_iRINofK3';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const content = fs.readFileSync('.data/system_state.json', 'utf-8');
  const systemState = JSON.parse(content);
  const { data, error } = await supabase.from('app_config').insert([{ id: 'test_insert_v1', data: systemState }]);
  console.log('Error:', error);
}
test();
