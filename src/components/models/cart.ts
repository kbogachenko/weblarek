import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Cart {
  private items: IProduct[] = [];
  private events: IEvents;

  constructor(events: IEvents, items: IProduct[] = []) {
      this.items = items;
      this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('cart:changed');
  }

  removeItem(product: IProduct): void {
    const wasRemoved = this.hasItem(product.id);
    this.items = this.items.filter(item => item.id !== product.id);
    if (wasRemoved) {
        this.events.emit('cart:changed');
    }
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed');
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}