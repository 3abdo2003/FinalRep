/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../interface/order.interface';
import { Cart } from '../interface/cart.interface';
import { CartItem } from '../interface/cart.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>, // Inject CartModel
  ) {}

  async createOrder(userEmail: string, items: CartItem[]): Promise<Order> {
    const order = new this.orderModel({
      userEmail,
      items,
      createdAt: new Date(),
    });
    await this.cartModel.deleteOne({ userEmail }); // Clear the cart after creating the order
    return await order.save();
  }

  async getOrdersByUserEmail (userEmail: string): Promise<Order[]> {
    const orders = await this.orderModel.find({ userEmail }).exec();
    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found for the user.');
    }
    return orders;
  }

  
}
