// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// These variables are pulled from your .env.local file.
// The "!" tells TypeScript that we are sure these values will exist.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This creates a single, reusable Supabase client for your entire application.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)