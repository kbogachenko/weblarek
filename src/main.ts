import './scss/styles.scss';

import { Catalog } from './components/models/catalog';
import { Cart } from './components/models/cart';
import { Buyer } from './components/models/buyer';
import { Communication } from './components/models/communication';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants.ts';

import { EventEmitter } from './components/base/Events';

import { Header } from './components/views/header';
import { Gallery } from './components/views/gallery';
import { Modal } from './components/views/modal';
import { Basket } from './components/views/basket';
import { FormOrder } from './components/views/formorder';
import { FormContacts } from './components/views/formcontacts';
import { Success } from './components/views/success';
import { CardCatalog } from './components/views/cardcatalog';
import { CardPreview } from './components/views/cardpreview';
import { CardBasket } from './components/views/cardbasket';

const api = new Api(API_URL);
const events = new EventEmitter();
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);
const communication = new Communication(api);

const headerContainer = document.querySelector('.header') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;

const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);

let currentPreviewElement: HTMLElement | null = null;

communication.getProducts()
    .then(data => catalog.saveProducts(data.items))
    .catch(err => console.error('Ошибка загрузки товаров:', err));

events.on('catalog:products:updated', () => {
    const products = catalog.getProducts();
    const cards = products.map(product => {
        const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
        const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardElement, events);
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        cardElement.dataset.id = product.id;
        return card.render();
    });
    gallery.catalog = cards;
});

events.on('cart:changed', () => {
    header.counter = cart.getItemCount();
});

events.on('card:selected', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
        const template = document.querySelector('#card-preview') as HTMLTemplateElement;
        const previewElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const preview = new CardPreview(previewElement, events);
        preview.title = product.title;
        preview.price = product.price;
        preview.category = product.category;
        preview.image = product.image;
        preview.text = product.description;
        preview.inCart = cart.hasItem(product.id);
        previewElement.dataset.id = product.id;
        currentPreviewElement = previewElement;
        modal.content = preview.render();
        modal.open();
    }
});

events.on('card:add', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
        cart.addItem(product);
    if (currentPreviewElement && currentPreviewElement.dataset.id === data.id) {
        const button = currentPreviewElement.querySelector('.card__button') as HTMLButtonElement;
        if (button) {
            button.textContent = 'Удалить из корзины';
            button.dataset.action = 'remove';
        }
    }
    }
});

events.on('card:remove', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
        cart.removeItem(product);
        if (currentPreviewElement && currentPreviewElement.dataset.id === data.id) {
            const button = currentPreviewElement.querySelector('.card__button') as HTMLButtonElement;
            if (button) {
                button.textContent = 'Купить';
                button.dataset.action = 'add';
            }
        }
    }
});


events.on('cardBasket:remove', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
        cart.removeItem(product);
        events.emit('basket:open');
    }
});

events.on('basket:open', () => {
    const items = cart.getItems();
    const template = document.querySelector('#basket') as HTMLTemplateElement;
    const basketElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const basket = new Basket(basketElement, events);
    
    const basketCards = items.map((item, index) => {
        const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardElement, events);
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        cardElement.dataset.id = item.id;
        return card.render();
    });
    
    basket.list = basketCards;
    basket.price = cart.getTotalPrice();
    basket.valid = items.length > 0;
    
    modal.content = basket.render();
    modal.open();
});

events.on('basket:submit', () => {
    const template = document.querySelector('#order') as HTMLTemplateElement;
    const formElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const form = new FormOrder(formElement, events);
    modal.content = form.render();
    modal.open();
});

events.on('order:card', () => buyer.setPayment('card'));
events.on('order:cash', () => buyer.setPayment('cash'));
events.on('order:address', (data: { address: string }) => buyer.setAddress(data.address));

events.on('order:submit', () => {
    const { payment, address } = buyer.getData();
    if (payment && address) {
        const template = document.querySelector('#contacts') as HTMLTemplateElement;
        const formElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const form = new FormContacts(formElement, events);
        modal.content = form.render();
        modal.open();
    }
});

events.on('contact:email', (data: { email: string }) => buyer.setEmail(data.email));
events.on('contact:phone', (data: { phone: string }) => buyer.setPhone(data.phone));

events.on('contact:submit', () => {
    const orderData = buyer.getData();
    const items = cart.getItems();
    const total = cart.getTotalPrice();
    
    if (orderData.email && orderData.phone) {
        communication.sendOrder({
            ...orderData,
            items: items.map(item => item.id),
            total
        })
            .then(() => {
                cart.clear();
                buyer.clear();
                modal.close();
                
                const template = document.querySelector('#success') as HTMLTemplateElement;
                const successElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
                const success = new Success(successElement, events);
                success.description = `Списано ${total} синапсов`;
                modal.content = success.render();
                modal.open();
            })
            .catch(err => console.error('Ошибка оформления заказа:', err));
    }
});

events.on('success:close', () => modal.close());