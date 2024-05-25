/* eslint-disable prettier/prettier */
// home.interface.ts
import { Document } from 'mongoose';

export interface Favorite extends Document {
  userEmail: string; // Change userId to userEmail
  productId: string;
  createdAt: Date;
}