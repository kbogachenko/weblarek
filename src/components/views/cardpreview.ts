import { Card } from './card';
import { ICardPreview, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from "../../utils/constants";

export class CardPreview extends Card<ICardPreview> {
    private categoryElement: HTMLElement;
    private textElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private buttonElement: HTMLButtonElement;
    private actions?: ICardActions;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this.actions = actions;

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.actions?.onClick) {
                this.actions.onClick();
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
        } else {
            this.buttonElement.disabled = false;
            this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
        }
    }
}