import { Component } from '../base/Component';
import { IBasket } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Basket extends Component<IBasket> {
    private listElement: HTMLElement;
    private priceElement: HTMLElement;
    private orderButton: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:submit');
        });
    }

    set list(list: HTMLElement[]) {
        if (list.length === 0) {
            this.listElement.innerHTML = '<div>Корзина пуста</div>';
        } else {
            this.listElement.replaceChildren(...list);
        }
    }

    set price(price: number | null) {
        if (price === null) {
            this.priceElement.textContent = 'Бесценно';
        } else {
            this.priceElement.textContent = `${price} синапсов`;
        }
    }

    set valid(value: boolean) {
        this.orderButton.disabled = !value;
    }
}