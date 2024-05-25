/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface CartItem {
  productId: string;
  quantity: number;
  purchaseOption: 'buy' | 'rent';
  startDate?: Date;
  endDate?: Date;
  customization?: { [key: string]: string };
}

export interface Cart extends Document {
  userEmail: string;
  items: CartItem[];
  createdAt: Date;
}
