import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zyuaohrxgedzlzyrxalw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dWFvaHJ4Z2Vkemx6eXJ4YWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzkxMDksImV4cCI6MjA5ODgxNTEwOX0.0lBlfz5Er_9UBJJVVhxD1_YRNfpOGdWGu-DzkJfziBo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);