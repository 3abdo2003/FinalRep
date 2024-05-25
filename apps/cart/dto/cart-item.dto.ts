/* eslint-disable prettier/prettier */
import { IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDTO {
  @IsString()
  productId: string;

  @IsInt()
  quantity: number;

  @IsString()
  purchaseOption: string;

  @IsOptional()
  @IsString()
  startDate?: Date;

  @IsOptional()
  @IsString()
  endDate?: Date;

  @IsOptional()
  customization?: Record<string, string>; // Use Record<string, string> for key-value pairs
}

export class CreateCartDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  items: CartItemDTO[];
}
