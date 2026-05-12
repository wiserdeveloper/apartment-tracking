import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quqspfzcuicajvczkork.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cXNwZnpjdWljYWp2Y3prb3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzQwNTMsImV4cCI6MjA5NDExMDA1M30.nIYElVTITEW36m7tEDF_itZQFvKtD68YmHfNf5_6ugs';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);