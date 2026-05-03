import { Component } from '../base/Component';
import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Modal extends Component<IModal> {
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('click', () => {
            this.close();
        });

        this.contentElement.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        }

    set content(value: HTMLElement) {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
        this.events.emit('modal:close');
    }
}