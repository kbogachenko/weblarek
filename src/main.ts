import './scss/styles.scss';

import { Catalog } from './components/models/catalog';
import { Cart } from './components/models/cart';
import { Buyer } from './components/models/buyer';
import { apiProducts } from "./utils/data";
import { Communication } from './components/models/communication';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants.ts';

const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();
const api = new Api(API_URL);
const communication = new Communication(api);

// Тестирование класса Catalog
console.log('=== ТЕСТИРОВАНИЕ КЛАССА CATALOG ===');
catalog.saveProducts(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getProducts());
console.log('Товар по ID:', catalog.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));
catalog.setSelectedProduct(apiProducts.items[0]);
console.log('Выбранный товар:', catalog.getSelectedProduct());

// Тестирование класса Cart
console.log('=== ТЕСТИРОВАНИЕ КЛАССА CART ===');
cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
console.log('Товары в корзине:', cart.getItems());
console.log('Количество товаров в корзине:', cart.getItemCount());
console.log('Общая стоимость товаров в корзине:', cart.getTotalPrice());
console.log('Есть ли товар с ID "1" в корзине:', cart.hasItem('1'));

cart.removeItem(apiProducts.items[0]);
console.log('Товары в корзине после удаления:', cart.getItems());
cart.clear();
console.log('Корзина после очистки:', cart.getItems());

// Тестирование класса Buyer
console.log('=== ТЕСТИРОВАНИЕ КЛАССА BUYER ===');
buyer.setEmail('test@example.com');
buyer.setPhone('+7 (999) 999-99-99');
buyer.setAddress('г. Москва, Красная Площадь, д. 1');
buyer.setPayment('card');

console.log('Данные покупателя:', buyer.getData());

// Тестирование класса Buyer, когда все данные корректные
const validationErrors = buyer.validate();
if (validationErrors) {
  console.log('Ошибки валидации:', validationErrors);
} else {
  console.log('Валидация пройдена успешно');
}

// Тестирование класса Buyer, когда все данные НЕкорректные
const wrongBuyer = new Buyer();
wrongBuyer.setEmail('');
wrongBuyer.setPhone('');
wrongBuyer.setAddress('');
wrongBuyer.setPayment(null);

const validationErrorsWrongBuyer = wrongBuyer.validate();
if (validationErrorsWrongBuyer) {
  console.log('Ошибки валидации:', validationErrorsWrongBuyer);
} else {
  console.log('Валидация пройдена успешно');
}

buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getData());

// Тестирование класса Communication
async function loadAndSaveProducts() {
  try {
    console.log('=== ЗАГРУЗКА ТОВАРОВ С СЕРВЕРА ===');
    const productsResponse = await communication.getProducts();
    catalog.saveProducts(productsResponse.items);
    console.log('Массив товаров из каталога (с сервера):', catalog.getProducts());
  } catch (error) {
    console.error('Ошибка при загрузке товаров с сервера:', error);
  }
}

loadAndSaveProducts();