import { IProductsResponse, IOrderRequest, IOrderResponse, IApi } from '../../types/index';

export class Communication {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  /** Получение списка товаров с сервера */
  async getProducts(): Promise<IProductsResponse> {
    return await this.api.get<IProductsResponse>('/product/');
  }

  /** Отправка данных заказа на сервер */
   async sendOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>('/order/', orderData);
  }
}