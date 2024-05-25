/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  category: { type: String, enum: ['Standard Plastic Pallets', 'Heavy-Duty Plastic Pallets', 'Hygienic Plastic Pallets', 'Nestable Plastic Pallets'], required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number },
  availability: { type: Boolean, default: true },
  specifications: { type: Map, of: String },
  customizableOptions: [{
    label: String,
    options: [String]
  }],
  reviews: [{
    user: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  topOffer: { type: Boolean, default: false }
});
