import { Api } from '../base/Api';
import { IProductsResponse, IOrderRequest, IOrderResponse } from '../../types/index';

export class Communication {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  /** Получение списка товаров с сервера */
  async getProducts(): Promise<IProductsResponse> {
    return await this.api.get('/product/');
  }

  /** Отправка данных заказа на сервер */
   async sendOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return await this.api.post('/order/', orderData);
  }
}