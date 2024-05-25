/* eslint-disable prettier/prettier */
// order.schema.ts
import { Schema } from 'mongoose';

export const OrderSchema = new Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      purchaseOption: { type: String, required: true },
      startDate: { type: Date },
      endDate: { type: Date },
      customization: { type: Map, of: String }, // Update to use Map
    },
  ],
  createdAt: { type: Date, default: Date.now },
});