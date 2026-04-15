import { IBuyer, TPayment, TBuyerErrors } from '../../types/index';

export class Buyer {
   private payment: TPayment | null = null;
   private email: string = '';
   private phone: string = '';
   private address: string = '';

  constructor() {
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (this.payment === null) {
      errors.payment = 'Способ оплаты обязателен';
    }
    if (!this.email.trim()) {
      errors.email = 'Email не может быть пустым';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Телефон не может быть пустым';
    }
    if (!this.address.trim()) {
      errors.address = 'Адрес не может быть пустым';
    }

    return errors;
  }
}