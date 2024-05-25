// src/dto/edit-credit-card.dto.ts
export class EditCreditCardDto {
  readonly index: number;
  readonly cardNumber: string;
  readonly cardholderName: string;
  readonly expirationDate: string;
  readonly cvv: string;
}
