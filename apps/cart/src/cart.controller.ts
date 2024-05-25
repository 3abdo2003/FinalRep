/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, UseGuards, Req, Delete, Param, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDTO } from '../dto/create-cart.dto';
import { Cart } from '../interface/cart.interface';
import { Order } from '../interface/order.interface';
import { AuthenticationGuard } from 'apps/authentication/src/authentication.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async addToCart(@Req() request, @Body() createCartDTO: CreateCartDTO): Promise<Cart> {
    const userEmail = request.decodedData.email;
    return this.cartService.addToCart(userEmail, createCartDTO);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async getCart(@Req() request): Promise<Cart> {
    const userEmail = request.decodedData.email;
    return this.cartService.getCartByUserEmail(userEmail);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('delete-item/:productId')
  async deleteCartItem(@Req() request, @Param('productId') productId: string): Promise<Cart> {
    const userEmail = request.decodedData.email;
    return this.cartService.deleteCartItem(userEmail, productId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('orders')
  async getOrders(@Req() request): Promise<Order[]> {
    const userEmail = request.decodedData.email;
    return this.cartService.getOrdersByUserEmail(userEmail);
  }

  @UseGuards(AuthenticationGuard)
  @Post('place-order')
  async placeOrder(@Req() request): Promise<Order> {
    const userEmail = request.decodedData.email;
    return this.cartService.placeOrder(userEmail);
  }

  @UseGuards(AuthenticationGuard)
  @Post('apply-coupon')
  async applyCoupon(@Req() request, @Body('couponCode') couponCode: string): Promise<number> {
    const userEmail = request.decodedData.email;
    return this.cartService.applyCoupon(userEmail, couponCode);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('update-quantity')
  async updateQuantity(@Req() request, @Body('productId') productId: string, @Body('quantity') quantity: number): Promise<Cart> {
    const userEmail = request.decodedData.email;
    return this.cartService.updateQuantity(userEmail, productId, quantity);
  }
}
