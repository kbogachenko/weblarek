import { Card } from './card';
import { ICardPreview } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from "../../utils/constants";

export class CardPreview extends Card<ICardPreview> {
    private categoryElement: HTMLElement;
    private textElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private buttonElement: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            const id = this.container.dataset.id;
            const action = this.buttonElement.dataset.action;
            if (action === 'remove') {
                this.events.emit('card:remove', { id });
            } else {
                this.events.emit('card:add', { id });
            }
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        const categoryClassName = (categoryMap as any)[value];
        this.categoryElement.className = `card__category ${categoryClassName || 'card__category_other'}`;
    }

    set text(value: string) {
        this.textElement.textContent = value;
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value);
    }

    set inCart(value: boolean) {
        const priceText = this.priceElement.textContent;
            if (priceText === 'Бесценно') {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
            this.buttonElement.dataset.action = '';
        } else {
            this.buttonElement.disabled = false;
            this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
            this.buttonElement.dataset.action = value ? 'remove' : 'add';
        }
    }
}