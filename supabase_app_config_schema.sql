-- Run this script in the Supabase SQL Editor to enable persistent cloud storage for your React Admin Panel

-- 1. Create the application configuration table
CREATE TABLE IF NOT EXISTS public.app_config (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies to allow the backend to read/write using the Anon key
-- Since the frontend accesses this strictly via the secure Express API, we allow public reads/updates 
-- on this specific table so the server.ts backend can sync state automatically.
CREATE POLICY "Allow public read access to config" 
ON public.app_config 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to config" 
ON public.app_config 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to config" 
ON public.app_config 
FOR UPDATE 
USING (true) 
WITH CHECK (true);
