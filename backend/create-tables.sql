-- Create product table
CREATE TABLE IF NOT EXISTS public.product (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category TEXT,
    class TEXT,
    "subClass" TEXT,
    material TEXT,
    "imageUrls" TEXT[],
    "videoUrl" TEXT,
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "metaTags" TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User table if it doesn't exist
CREATE TABLE IF NOT EXISTS public."User" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.product ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (bypass RLS)
CREATE POLICY "Service role can do everything on product" ON public.product
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on User" ON public."User"
    FOR ALL USING (auth.role() = 'service_role');

-- Allow public read access to products
CREATE POLICY "Anyone can read products" ON public.product
    FOR SELECT USING (true);

-- Insert sample products

ON CONFLICT DO NOTHING;