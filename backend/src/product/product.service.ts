import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service'; // Uncomment when PrismaService is available
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  // constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // return this.prisma.product.create({ data: createProductDto });
    return 'This action adds a new product';
  }

  async findAll() {
    // return this.prisma.product.findMany();
    return 'This action returns all products';
  }

  async findOne(id: string) {
    // return this.prisma.product.findUnique({ where: { id } });
    return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // return this.prisma.product.update({ where: { id }, data: updateProductDto });
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    // return this.prisma.product.delete({ where: { id } });
    return `This action removes a #${id} product`;
  }
}
