import { Form } from './form';
import { IFormOrder, TPayment } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class FormOrder extends Form<IFormOrder> {
    private orderCardButton: HTMLButtonElement;
    private orderCashButton: HTMLButtonElement;
    private addressInputElement: HTMLInputElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.orderCardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.orderCashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.events = events;

        this.orderCardButton.addEventListener('click', () => {
            this.events.emit('order:card', { payment: 'card' });
        });

        this.orderCashButton.addEventListener('click', () => {
            this.events.emit('order:cash', { payment: 'cash' });
        });

        this.addressInputElement.addEventListener('input', () => {
            this.events.emit('order:address', { address: this.addressInputElement.value });
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit('order:submit');
        });
    }

    set address(address: string) {
        this.addressInputElement.value = address;
    }

    set payment(value: TPayment) {
        this.orderCardButton.classList.remove('button_alt-active');
        this.orderCashButton.classList.remove('button_alt-active');

        if (value === 'card') {
            this.orderCardButton.classList.add('button_alt-active');
        } else if (value === 'cash') {
            this.orderCashButton.classList.add('button_alt-active');
        }
    }
}