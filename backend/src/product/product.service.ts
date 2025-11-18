import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SupabaseService } from '../supabase/supabase.client';

@Injectable()
export class ProductService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createProductDto: CreateProductDto, images: Array<Express.Multer.File>) {
    const supabase = this.supabaseService.client;
    let imageUrls: string[] = [];

    if (images && images.length > 0) {
      for (const file of images) {
        // Generate a unique filename
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        // Upload to Supabase Storage bucket 'product'
        const { data, error } = await supabase.storage
          .from('product')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          throw new Error(`Failed to upload image: ${error.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('product')
          .getPublicUrl(fileName);

        if (publicUrlData && publicUrlData.publicUrl) {
          imageUrls.push(publicUrlData.publicUrl);
        }
      }
    }

    // Set imageUrls in DTO
    const productData = {
      name: createProductDto.name,
      description: createProductDto.description,
      price: typeof createProductDto.price === 'string' ? parseFloat(createProductDto.price) : createProductDto.price,
      stock: typeof createProductDto.stock === 'string' ? parseInt(createProductDto.stock, 10) : createProductDto.stock,
      category: createProductDto.category,
      class: createProductDto.class,
      subClass: createProductDto.subClass,
      material: createProductDto.material,
      imageUrls: imageUrls.length > 0 ? imageUrls : [],
      videoUrl: createProductDto.videoUrl,
      seoTitle: createProductDto.seoTitle,
      seoDesc: createProductDto.seoDesc,
      metaTags: createProductDto.metaTags,
    };

    const { data, error } = await supabase
      .from('product')
      .insert([productData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.client;
    const { data, error } = await supabase.from('product').select('*');
    if (error) throw new Error(error.message);
    console.log('findAll products:', data ? data.length : 0);
    return data;
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.client;
    const { data, error } = await supabase
      .from('product')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, updateProductDto: UpdateProductDto, images?: Array<Express.Multer.File>) {
    const supabase = this.supabaseService.client;
    let imageUrls: string[] = [];

    if (images && images.length > 0) {
      for (const file of images) {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('product')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          throw new Error(`Failed to upload image: ${error.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('product')
          .getPublicUrl(fileName);

        if (publicUrlData && publicUrlData.publicUrl) {
          imageUrls.push(publicUrlData.publicUrl);
        }
      }
    }

    // Prepare update data with proper type conversion
    const updateData = {
      ...updateProductDto,
      price: updateProductDto.price ? (typeof updateProductDto.price === 'string' ? parseFloat(updateProductDto.price) : updateProductDto.price) : undefined,
      stock: updateProductDto.stock ? (typeof updateProductDto.stock === 'string' ? parseInt(updateProductDto.stock, 10) : updateProductDto.stock) : undefined,
    };

    // If new images were uploaded, set imageUrls
    if (imageUrls.length > 0) {
      updateData.imageUrls = imageUrls;
    }

    const { data, error } = await supabase
      .from('product')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);

    if (!data) throw new Error('Product not found')
    return data;
  }

  async remove(id: string) {
    const supabase = this.supabaseService.client;
    const { data, error } = await supabase
      .from('product')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async count() {
    const supabase = this.supabaseService.client;
    const { count, error } = await supabase
      .from('product')
      .select('id', { count: 'exact', head: true });
    if (error) throw new Error(error.message);
    console.log('count products:', count);
    return count;
  }
}
