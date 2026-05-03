import { Component } from '../base/Component';
import { ISuccess } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Success extends Component<ISuccess> {
    private descriptionElement: HTMLElement;
    private successButton: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.events = events;

        this.successButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set description(description: string) {
        this.descriptionElement.textContent = description;
    }
}