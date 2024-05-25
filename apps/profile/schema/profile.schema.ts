import { Schema, Document } from 'mongoose';

export interface CreditCard {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  cvv: string;
}

export interface Review {
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date; // Optional updatedAt field
}

export interface Profile extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
  addresses: string[];
  password: string;
  Token: string;
  createdAt: Date;
  updatedAt: Date;
  creditCards: CreditCard[];
  reviews: Review[]; // New field for reviews
}

export type ProfileDocument = Profile & Document;

export const ReviewSchema = new Schema({
  productId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date }, // Optional updatedAt field
});

export const CreditCardSchema = new Schema({
  cardNumber: { type: String, required: true },
  cardholderName: { type: String, required: true },
  expirationDate: { type: String, required: true },
  cvv: { type: String, required: true },
});

export const ProfileSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    company: { type: String, required: true },
    addresses: { type: [String], required: true },
    password: { type: String, required: true, select: false },
    Token: { type: String },
    creditCards: { type: [CreditCardSchema], default: [] },
    reviews: { type: [ReviewSchema], default: [] }, // New field for reviews
  },
  { timestamps: true },
);
