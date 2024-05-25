import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: [true, 'Email already exists'] })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ default: '' })
  company: string;

  @Prop()
  address: string;

  @Prop()
  password: string;

  @Prop()
  Token: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
