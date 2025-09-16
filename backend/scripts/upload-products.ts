// backend/scripts/upload-products.ts

import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MOCK_PRODUCTS = [
  {
    name: "Leather Bag",
    price: 15900,
    imageFiles: ["brown_bag.jpg"],
    description: "Premium brown leather bag with elegant design",
    category: "bags"
  },
  {
    name: "Premium Leather Bag",
    price: 18700,
    imageFiles: ["blue_bag.jpg"],
    description: "Elegant blue leather bag with premium craftsmanship",
    category: "bags"
  },
  {
    name: "Classic Leather Belt",
    price: 4200,
    imageFiles: ["belt.jpg"],
    description: "Full-grain leather with silver buckle",
    category: "belts"
  },
  {
    name: "Premium Leather Belt",
    price: 5200,
    imageFiles: ["hero4.jpg"],
    description: "Handcrafted premium leather belt with polished brass buckle. Made from full-grain Italian leather, this belt combines durability with sophisticated style. Perfect for both formal and casual occasions, featuring precise stitching and a timeless design that complements any wardrobe.",
    category: "belts"
  },
  {
    name: "Classic Dark Brown Leather Belt",
    price: 4500,
    imageFiles: ["dark_brown_belt.jpg"],
    description: "Timeless classic dark brown leather belt with a sleek design. Made from high-quality full-grain leather, this belt is perfect for both formal and casual wear. Its durable construction ensures it will last for years, while the elegant buckle adds a touch of sophistication.",
    category: "belts"
  }
];

const IMAGE_DIR = path.resolve(__dirname, '../../frontend/public');
const BUCKET = 'product';

async function uploadImage(fileName: string): Promise<string | null> {
  const filePath = path.join(IMAGE_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`Image file not found: ${filePath}`);
    return null;
  }
  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage.from(BUCKET).upload(fileName, fileBuffer, {
    upsert: true,
    contentType: 'image/jpeg'
  });
  if (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
    return null;
  }
  // Get public URL
  const { publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(fileName).data;
  return publicUrl;
}

async function ensureBucketExists() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET);
  
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
    if (error) {
      console.error('Error creating bucket:', error.message);
      throw error;
    }
    console.log(`Created bucket: ${BUCKET}`);
  }
}

async function main() {
  await ensureBucketExists();
  
  for (const product of MOCK_PRODUCTS) {
    // Upload images and get URLs
    const imageUrls: string[] = [];
    for (const imageFile of product.imageFiles) {
      const url = await uploadImage(imageFile);
      if (url) imageUrls.push(url);
    }

    // Insert product into DB
    const { error } = await supabase
      .from('product')
      .insert([{
        name: product.name,
        price: product.price,
        imageUrls,
        description: product.description,
        category: product.category,
        stock: 0,
        class: null,
        subClass: null,
        material: null,
        videoUrl: null,
        seoTitle: null,
        seoDesc: null,
        metaTags: null
      }]);
    if (error) {
      console.error(`Error inserting product "${product.name}":`, error.message);
    } else {
      console.log(`Inserted product: ${product.name}`);
    }
  }
}

main().catch((err) => {
  console.error('Script error:', err);
});
