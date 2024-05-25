/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface CartItem extends Document {
  readonly productId: string;
  readonly quantity: number;
  readonly rentalStartDate?: Date;
  readonly rentalEndDate?: Date;
  readonly customizableOptions?: { label: string, options: string[] }[];
}
