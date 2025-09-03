import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { supabase } from '../supabase/supabase.client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, images: Array<Express.Multer.File>) {
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
      ...createProductDto,
      imageUrls,
      price: typeof createProductDto.price === 'string' ? parseFloat(createProductDto.price) : createProductDto.price,
      stock: typeof createProductDto.stock === 'string' ? parseInt(createProductDto.stock, 10) : createProductDto.stock,
    };

    return this.prisma.product.create({ data: productData });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data: updateProductDto });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
