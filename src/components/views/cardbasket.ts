import { Card } from './card';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { ICardBasket, ICardActions } from '../../types';

export class CardBasket extends Card<ICardBasket> {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onClick) {
            this.deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(index: number) {
        this.indexElement.textContent = String(index);
    }
}