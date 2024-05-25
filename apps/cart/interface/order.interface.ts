/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

// order.interface.ts
export interface OrderItem {
  productId: string;
  quantity: number;
  purchaseOption: string;
  startDate?: Date;
  endDate?: Date;
  customization?: Record<string, string>; // Update to use Record<string, string>
}

export interface Order extends Document {
  userEmail: string;
  items: OrderItem[];
  createdAt: Date;
}
