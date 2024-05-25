/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  purchaseOption: { type: String, enum: ['buy', 'rent'], required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  customization: { type: Map, of: String },
});

export const CartSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [CartItemSchema],
  createdAt: { type: Date, default: Date.now },
});
