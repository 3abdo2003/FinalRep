/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  rentalStartDate: { type: Date },
  rentalEndDate: { type: Date },
  customizableOptions: [{
    label: String,
    options: [String]
  }],
});
