/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface Product extends Document {
  readonly category: 'Standard Plastic Pallets' | 'Heavy-Duty Plastic Pallets' | 'Hygienic Plastic Pallets' | 'Nestable Plastic Pallets';
  readonly name: string;
  readonly description: string;
  readonly images: string[];
  readonly price: number;
  readonly originalPrice?: number;
  readonly discount?: number;
  readonly availability: boolean;
  readonly specifications: Map<string, string>;
  readonly customizableOptions: { label: string, options: string[] }[];
  readonly reviews: Review[];
  readonly createdAt: Date;
  topOffer: boolean;
}

export interface Review {
  user: string; // This can be a reference to the User model
  rating: number;
  comment: string;
  createdAt: Date;
}

