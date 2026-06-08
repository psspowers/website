import { createClient } from '@supabase/supabase-js';

// Fallbacks prevent module-level crashes on serverless cold-starts when env vars
// haven't been baked in (e.g. Netlify Lambda initializing the SSR bundle).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
