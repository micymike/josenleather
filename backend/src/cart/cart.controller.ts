import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  @Post(':id/items')
  addItem(
    @Param('id') cartId: string,
    @Body() body: { productId: string; quantity: number }
  ) {
    return this.cartService.addItem(cartId, body.productId, body.quantity);
  }

  @Delete(':id/items/:productId')
  removeItem(
    @Param('id') cartId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.removeItem(cartId, productId);
  }
}
