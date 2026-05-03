import { Card } from './card';
import { ICardCatalog } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from "../../utils/constants";

export class CardCatalog extends Card<ICardCatalog> {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.container.addEventListener('click', () => {
        const id = this.container.dataset.id;
        if (id) {
        this.events.emit('card:selected', { id });
    }
});
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        const categoryClassName = (categoryMap as any)[value];
        this.categoryElement.className = `card__category ${categoryClassName || 'card__category_other'}`;
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value);
    }
}
