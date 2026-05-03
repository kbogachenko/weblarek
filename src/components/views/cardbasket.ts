import { Card } from './card';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { ICardBasket } from '../../types';

export class CardBasket extends Card<ICardBasket> {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit('cardBasket:remove', { id });
            }
        });
    }

    set index(index: number) {
        this.indexElement.textContent = String(index);
    }
}