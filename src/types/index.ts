export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// интерфейс для товара;
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// интерфейс для данных покупателя;
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>; 

// тип, описывающий доступные виды оплаты;
export type TPayment = 'card' | 'cash' | null;

// тип для объекта, отправляемого на сервер при оформлении заказа;
export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
}

// типы для объектов, принимаемых с сервера в разных запросах.
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}
