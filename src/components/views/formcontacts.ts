import { Form } from './form';
import { IFormContact } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class FormContacts extends Form<IFormContact> {
    private events: IEvents;
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contact:email', { email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contact:phone', { phone: this.phoneInput.value });
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit('contact:submit');
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
        }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}