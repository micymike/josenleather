-- Enable RLS on product table if not already enabled
ALTER TABLE product ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to read products
CREATE POLICY "Allow anonymous read access to products" ON product
FOR SELECT
TO anon
USING (true);

-- If you also need authenticated users to read products
CREATE POLICY "Allow authenticated read access to products" ON product
FOR SELECT
TO authenticated
USING (true);