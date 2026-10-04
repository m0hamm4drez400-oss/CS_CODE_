```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://xehgutuoaokqnfwbgmdp.supabase.co';
// کلید Publishable key رو که کپی کردی این پایین بذار:
const SUPABASE_ANON_KEY = 'sb_publishable_8zSTVhmtI35r7E9fxooqcQ_b6hb2uTO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// تابع ارسال پیام به دیتابیس آنلاین
export async function sendInboxMessage(name, email, message) {
    const { data, error } = await supabase
        .from('inbox')
        .insert([{ name, email, message }]);
    
    if (error) {
        console.error('Database Error:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data };
}
```