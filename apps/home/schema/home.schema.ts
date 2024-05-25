/* eslint-disable prettier/prettier */
// home.schema.ts
import * as mongoose from 'mongoose';

export const FavoriteSchema = new mongoose.Schema({
  userEmail: { type: String }, // Change userId to userEmail and type to String
  productId: { type: mongoose.Schema.Types.ObjectId},
  createdAt: { type: Date, default: Date.now }
});