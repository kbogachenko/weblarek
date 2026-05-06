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
import { FormOrder } from './components/views/formOrder';
import { FormContacts } from './components/views/formContacts';
import { Success } from './components/views/success';
import { CardCatalog } from './components/views/cardCatalog';
import { CardPreview } from './components/views/cardPreview';
import { CardBasket } from './components/views/cardBasket';

import { cloneTemplate, ensureElement } from './utils/utils.ts';

const api = new Api(API_URL);
const events = new EventEmitter();
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);
const communication = new Communication(api);

const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement('.gallery');
const modalContainer = ensureElement('#modal-container');

const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);

const basketElement = cloneTemplate('#basket');
const basket = new Basket(basketElement, events);

communication.getProducts()
    .then(data => catalog.saveProducts(data.items))
    .catch(err => console.error('Ошибка загрузки товаров:', err));

events.on('catalog:products:updated', () => {
    const products = catalog.getProducts();
    const cards = products.map(product => {
        const cardElement = cloneTemplate('#card-catalog');
        cardElement.id = product.id;
        
        const card = new CardCatalog(cardElement, {
            onClick: () => events.emit('card:selected', { id: cardElement.id })
        });
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        return card.render();
    });
    gallery.catalog = cards;
});

let currentPreview: CardPreview | null = null;  

events.on('card:selected', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
        catalog.setSelectedProduct(product);
        const previewElement = cloneTemplate('#card-preview');
        previewElement.id = product.id;
        
        currentPreview = new CardPreview(previewElement, {
            onClick: () => { 
                events.emit('preview:toggle');
            }
        });
        
        currentPreview.title = product.title;
        currentPreview.price = product.price;
        currentPreview.category = product.category;
        currentPreview.image = product.image;
        currentPreview.text = product.description;
        currentPreview.inCart = cart.hasItem(product.id);
        
        modal.content = currentPreview.render();
        modal.open();
    }
});

events.on('preview:toggle', () => {
    const currentProduct = catalog.getSelectedProduct();
    if (currentProduct && currentProduct.price !== null) {
        if (cart.hasItem(currentProduct.id)) {
            cart.removeItem(currentProduct);
        } else {
            cart.addItem(currentProduct);
        }
    }
});

events.on('cart:changed', () => {
    header.counter = cart.getItemCount();
    
    if (currentPreview) {
        const product = catalog.getSelectedProduct();
        if (product) {
            currentPreview.inCart = cart.hasItem(product.id);
        }
    }
    
    const items = cart.getItems();
    const basketCards = items.map((item, index) => {
    const cardElement = cloneTemplate('#card-basket');
    cardElement.id = item.id;
        
    const card = new CardBasket(cardElement, {
        onClick: () => events.emit('cardBasket:remove', { id: cardElement.id })
    });
    card.title = item.title;
    card.price = item.price;
    card.index = index + 1;
    return card.render();
    });
    
    basket.list = basketCards;
    basket.price = cart.getTotalPrice();
    basket.valid = items.length > 0;
});

events.on('cardBasket:remove', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
        cart.removeItem(product);
        events.emit('basket:open');
    }
});

events.on('basket:open', () => {
    modal.content = basket.render();
    modal.open();
});

const formOrderElement = cloneTemplate('#order');
const formOrder = new FormOrder(formOrderElement, events);


events.on('basket:submit', () => {
    const buyerData = buyer.getData();

    formOrder.address = buyerData.address;
    formOrder.payment = buyerData.payment;
    formOrder.errors = '';
    formOrder.valid = true;
    
    modal.content = formOrder.render();
    modal.open();
});

events.on('order:card', () => {
    buyer.setPayment('card');
});

events.on('order:cash', () => {
    buyer.setPayment('cash');
});

events.on('order:address', (data: { address: string }) => {
    buyer.setAddress(data.address);
    formOrder.address = data.address;
});

events.on('buyer:changed', () => {
    const buyerData = buyer.getData();
    formOrder.address = buyerData.address; 
    formOrder.payment = buyerData.payment;
    formContact.phone = buyerData.phone;
    formContact.email = buyerData.email;
    validateOrderForm();
    validateContactForm();
});

const formContactElement = cloneTemplate('#contacts');
const formContact = new FormContacts(formContactElement, events);

events.on('order:submit', () => {
    modal.content = formContact.render();
});

events.on('contact:email', (data: { email: string }) => {
    buyer.setEmail(data.email);
    formContact.email = data.email;
});

events.on('contact:phone', (data: { phone: string }) => {
    buyer.setPhone(data.phone);
    formContact.phone = data.phone;
});

const successElement = cloneTemplate('#success');
const success = new Success(successElement, events);

events.on('contact:submit', () => {
    const orderData = buyer.getData();
    const items = cart.getItems();
    const total = cart.getTotalPrice();
    
    communication.sendOrder({
            ...orderData,
            items: items.map(item => item.id),
            total
        })
            .then(() => {
                cart.clear();
                buyer.clear();
                success.description = `Списано ${total} синапсов`;
                modal.content = success.render();
            })
            .catch(err => {
                console.error('Ошибка оформления заказа:', err);
                formContact.errors = 'Не удалось оформить заказ. Попробуйте снова.';
                formContact.valid = false;
            });
});

events.on('success:close', () => modal.close());

function validateOrderForm() {
    const errors = buyer.validate();
    const hasErrors = errors.payment || errors.address;

    let errorText = '';
    if (errors.payment) errorText += errors.payment + '. ';
    if (errors.address) errorText += errors.address + '. ';

    formOrder.errors = errorText;
    formOrder.valid = !hasErrors;
}

function validateContactForm() {
    const errors = buyer.validate();
    const hasErrors = errors.email || errors.phone;

    let errorText = '';
    if (errors.email) errorText += errors.email + '. ';
    if (errors.phone) errorText += errors.phone + '. ';

    formContact.errors = errorText;
    formContact.valid = !hasErrors;
}

