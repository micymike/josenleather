import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { supabase } from '../supabase/supabase.client';

@Injectable()
export class CartService {
  constructor() {}

  async create(createCartDto: CreateCartDto) {
    const { userId, items } = createCartDto;
    // Create cart
    const { data: cart, error: cartError } = await supabase
      .from('cart')
      .insert([{ userId }])
      .select()
      .single();
    if (cartError) throw new Error(cartError.message);

    // Insert items
    if (items && items.length > 0) {
      const itemsToInsert = items.map((item) => ({
        cartId: cart.id,
        productId: item.productId,
        quantity: item.quantity,
      }));
      const { error: itemsError } = await supabase
        .from('cart_item')
        .insert(itemsToInsert);
      if (itemsError) throw new Error(itemsError.message);
    }

    return this.findOne(cart.id);
  }

  async findAll() {
    // Fetch all carts
    const { data: carts, error: cartsError } = await supabase.from('cart').select('*');
    if (cartsError) throw new Error(cartsError.message);

    // Fetch all cart items
    const { data: items, error: itemsError } = await supabase.from('cart_item').select('*');
    if (itemsError) throw new Error(itemsError.message);

    // Fetch all products
    const { data: products, error: productsError } = await supabase.from('product').select('*');
    if (productsError) throw new Error(productsError.message);

    // Attach items and products to carts
    return carts.map((cart) => ({
      ...cart,
      items: items
        .filter((item) => item.cartId === cart.id)
        .map((item) => ({
          ...item,
          product: products.find((p) => p.id === item.productId) || null,
        })),
    }));
  }

  async findOne(id: string) {
    // Fetch cart
    const { data: cart, error: cartError } = await supabase
      .from('cart')
      .select('*')
      .eq('id', id)
      .single();
    if (cartError || !cart) throw new Error('Cart not found');

    // Fetch items
    const { data: itemsRaw, error: itemsError } = await supabase
      .from('cart_item')
      .select('*')
      .eq('cartId', id);
    if (itemsError) throw new Error(itemsError.message);
    const items: any[] = itemsRaw || [];

    // Fetch products for items
    const productIds: string[] = items.map((item) => item.productId);
    let products: any[] = [];
    if (productIds.length > 0) {
      const { data: productsData, error: productsError } = await supabase
        .from('product')
        .select('*')
        .in('id', productIds);
      if (productsError) throw new Error(productsError.message);
      products = productsData || [];
    }

    // Attach products to items
    const itemsWithProducts: any[] = items.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId) || null,
    }));

    return {
      ...cart,
      items: itemsWithProducts,
    };
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const { items, userId } = updateCartDto;
    // Update cart
    const { data: cart, error: cartError } = await supabase
      .from('cart')
      .update({ userId })
      .eq('id', id)
      .select()
      .single();
    if (cartError) throw new Error(cartError.message);

    // Delete all existing items
    const { error: deleteError } = await supabase
      .from('cart_item')
      .delete()
      .eq('cartId', id);
    if (deleteError) throw new Error(deleteError.message);

    // Insert new items
    if (items && items.length > 0) {
      const itemsToInsert = items.map((item) => ({
        cartId: id,
        productId: item.productId,
        quantity: item.quantity,
      }));
      const { error: itemsError } = await supabase
        .from('cart_item')
        .insert(itemsToInsert);
      if (itemsError) throw new Error(itemsError.message);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    // Delete all items
    const { error: itemsError } = await supabase
      .from('cart_item')
      .delete()
      .eq('cartId', id);
    if (itemsError) throw new Error(itemsError.message);

    // Delete cart
    const { data, error } = await supabase
      .from('cart')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async addItem(cartId: string, productId: string, quantity: number) {
    // Check if item exists
    const { data: existingItem, error: findError } = await supabase
      .from('cart_item')
      .select('*')
      .eq('cartId', cartId)
      .eq('productId', productId)
      .single();

    if (findError && findError.details !== 'The result contains 0 rows') throw new Error(findError.message);

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_item')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_item')
        .insert([{ cartId, productId, quantity }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  }

  async removeItem(cartId: string, productId: string) {
    // Find item
    const { data: itemToRemove, error: findError } = await supabase
      .from('cart_item')
      .select('*')
      .eq('cartId', cartId)
      .eq('productId', productId)
      .single();

    if (findError || !itemToRemove) throw new Error('Item not found in cart');

    // Delete item
    const { data, error } = await supabase
      .from('cart_item')
      .delete()
      .eq('id', itemToRemove.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}
