import { IBuyer, TPayment } from '../../types/index';

export class Buyer {
   private payment: TPayment = 'card';
   private email: string = '';
   private phone: string = '';
   private address: string = '';

  constructor() {
        this.payment = 'card';
        this.email = '';
        this.phone = '';
        this.address = '';
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
    this.payment = 'card';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): Record<string, string> | null {
    const errors: Record<string, string> = {};

    if (!this.email.trim()) {
      errors.email = 'Email не может быть пустым';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Телефон не может быть пустым';
    }
    if (!this.address.trim()) {
      errors.address = 'Адрес не может быть пустым';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}