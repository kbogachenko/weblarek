import { IProduct } from '../../types/index';

export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor() {
  }

  saveProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct {
    return this.products.find(product => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

}
