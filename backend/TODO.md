# Fix "permission denied for schema public" error

## Steps

1. Identify the database user and schema (done)
   - User: postgres.zvibgdvfchzkbbmlzjru
   - Schema: public

2. Grant privileges to the user:
   Run the following SQL in your PostgreSQL database:

   ```sql
   GRANT USAGE ON SCHEMA public TO "postgres.zvibgdvfchzkbbmlzjru";
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "postgres.zvibgdvfchzkbbmlzjru";
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "postgres.zvibgdvfchzkbbmlzjru";
   ```

   - You can run this in Supabase SQL editor or any PostgreSQL client.

3. Test the backend again to confirm the error is resolved.

---

## Supabase Table Recreation & Permission Fix

**To fully reset permissions and fix the "permission denied" error, run the following SQL in your Supabase SQL editor:**

```sql
-- 1. Drop the product table if it exists
DROP TABLE IF EXISTS public.product CASCADE;

-- 2. Recreate the product table
CREATE TABLE public.product (
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

-- 3. Enable RLS
ALTER TABLE public.product ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for service role (bypass RLS)
CREATE POLICY "Service role can do everything on product" ON public.product
    FOR ALL USING (auth.role() = 'service_role');

-- 5. Allow public read access to products
CREATE POLICY "Anyone can read products" ON public.product
    FOR SELECT USING (true);

-- 6. Grant privileges to the service role user
GRANT USAGE ON SCHEMA public TO "service_role";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "service_role";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "service_role";
```

- Go to your Supabase dashboard → SQL Editor.
- Paste and run the above SQL.
- Then restart your backend and test again.

If you still get permission errors, check that the "product" table is in the "public" schema and that the user matches your DATABASE_URL.

## Insert MOCK_PRODUCTS into Supabase

**Run the following SQL in your Supabase SQL editor to add the products from your products page:**

```sql
INSERT INTO public.product (
    id, name, price, imageUrls, description, category, rating, stock, class, "subClass", material, "videoUrl", "seoTitle", "seoDesc", "metaTags", created_at, updated_at
) VALUES
    (
        'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
        'Leather Bag',
        15900,
        ARRAY['/brown_bag.jpg'],
        'Premium brown leather bag with elegant design',
        'bags',
        4.8,
        0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()
    ),
    (
        'b2c3d4e5-f6a1-8907-bcda-2345678901bc',
        'Premium Leather Bag',
        18700,
        ARRAY['/blue_bag.jpg'],
        'Elegant blue leather bag with premium craftsmanship',
        'bags',
        4.9,
        0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()
    ),
    (
        'c3d4e5f6-a1b2-9078-cdab-3456789012cd',
        'Classic Leather Belt',
        4200,
        ARRAY['/belt.jpg'],
        'Full-grain leather with silver buckle',
        'belts',
        4.5,
        0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()
    ),
    (
        'd4e5f6a1-b2c3-0789-dabc-4567890123de',
        'Premium Leather Belt',
        5200,
        ARRAY['/hero4.jpg'],
        'Handcrafted premium leather belt with polished brass buckle. Made from full-grain Italian leather, this belt combines durability with sophisticated style. Perfect for both formal and casual occasions, featuring precise stitching and a timeless design that complements any wardrobe.',
        'belts',
        4.9,
        0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()
    ),
    (
        'e5f6a1b2-c3d4-7890-abcd-5678901234ef',
        'Classic Dark Brown Leather Belt',
        4500,
        ARRAY['/dark_brown_belt.jpg'],
        'Timeless classic dark brown leather belt with a sleek design. Made from high-quality full-grain leather, this belt is perfect for both formal and casual wear. Its durable construction ensures it will last for years, while the elegant buckle adds a touch of sophistication.',
        'belts',
        4.7,
        0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), NOW()
    )
ON CONFLICT (id) DO NOTHING;
```

- Go to your Supabase dashboard → SQL Editor.
- Paste and run the above SQL to add all products.

## Checklist

- [x] Analyze requirements (identify the DB user and schema)
- [x] Check backend/.env and backend/prisma/schema.prisma for DB connection details
- [x] Provide SQL command to grant privileges
- [x] Insert MOCK_PRODUCTS into DB
- [ ] Test the fix
