-- Run this script in the Supabase SQL Editor to set up the database structure and security

-- 1. Create the packages table
CREATE TABLE public.packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) on the table to protect it
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Policy A: Allow public read access (so a frontend website could freely read and display packages)
CREATE POLICY "Enable read access for all users" 
ON public.packages 
FOR SELECT 
USING (true);

-- Policy B: Allow insert operations ONLY for authenticated users (Admin login required)
CREATE POLICY "Enable insert for authenticated users only" 
ON public.packages 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy C: Allow update operations ONLY for authenticated users
CREATE POLICY "Enable update for authenticated users only" 
ON public.packages 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Policy D: Allow delete operations ONLY for authenticated users
CREATE POLICY "Enable delete for authenticated users only" 
ON public.packages 
FOR DELETE 
TO authenticated 
USING (true);
