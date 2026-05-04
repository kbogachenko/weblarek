import { Card } from './card';
import { ICardCatalog, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from "../../utils/constants";

export class CardCatalog extends Card<ICardCatalog> {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private actions?: ICardActions;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this.actions = actions;

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.container.addEventListener('click', () => {
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

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value);
    }
}