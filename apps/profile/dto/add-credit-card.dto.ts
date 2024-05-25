// src/dto/add-credit-card.dto.ts
export class AddCreditCardDto {
  readonly cardNumber: string;
  readonly cardholderName: string;
  readonly expirationDate: string;
  readonly cvv: string;
}
