import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vxnxixwawtdhkjdsivak.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bnhpeHdhd3RkaGtqZHNpdmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3ODE3NDEsImV4cCI6MjA5NjM1Nzc0MX0.t-UTAXhvHCeRTvTchhBS-MhbQw7wJ9Spx9O9jlSAVWQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
