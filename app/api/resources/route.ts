import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('pantries')
            .select('*');


        if (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}