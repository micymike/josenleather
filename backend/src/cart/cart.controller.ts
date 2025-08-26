import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiProperty } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto, ItemDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

class AddItemDto {
  @ApiProperty({ description: 'Product ID' })
  productId: string;

  @ApiProperty({ description: 'Quantity of the product', type: Number })
  quantity: number;
}

@ApiTags('carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({ status: 201, description: 'Cart created' })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({ status: 200, description: 'List of carts' })
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cart by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Cart found' })
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cart by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'Cart updated' })
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete cart by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Cart deleted' })
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddItemDto })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  addItem(
    @Param('id') cartId: string,
    @Body() body: AddItemDto
  ) {
    return this.cartService.addItem(cartId, body.productId, body.quantity);
  }

  @Delete(':id/items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({ status: 200, description: 'Item removed from cart' })
  removeItem(
    @Param('id') cartId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.removeItem(cartId, productId);
  }
}
