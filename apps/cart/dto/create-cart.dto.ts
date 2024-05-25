/* eslint-disable prettier/prettier */
export class CartItemDTO {
    readonly productId: string;
    readonly quantity: number;
    readonly purchaseOption: 'buy' | 'rent';
    readonly startDate?: Date;
    readonly endDate?: Date;
    readonly customization?: { [key: string]: string };
  }
  
  export class CreateCartDTO {
    readonly items: CartItemDTO[];
  }
  