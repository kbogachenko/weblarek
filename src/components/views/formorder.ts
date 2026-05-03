import { Form } from './form';
import { IFormOrder, TPayment } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class FormOrder extends Form<IFormOrder> {
    private orderCardButton: HTMLButtonElement;
    private orderCashButton: HTMLButtonElement;
    private addressInputElement: HTMLInputElement;
    private events: IEvents;
    private isPaymentSelected: boolean = false;
    private isAddressFilled: boolean = false;
    private hasSubmitAttempt: boolean = false;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.orderCardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.orderCashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.events = events;

        this.orderCardButton.addEventListener('click', () => {
            this.orderCardButton.classList.add('button_alt-active');
            this.orderCashButton.classList.remove('button_alt-active');
            this.isPaymentSelected = true;
            this.events.emit('order:card');
            
            if (this.hasSubmitAttempt && this.isPaymentSelected && this.isAddressFilled) {
                this.valid = true;
                this.errors = '';
            }
        });

        this.orderCashButton.addEventListener('click', () => {
            this.orderCashButton.classList.add('button_alt-active');
            this.orderCardButton.classList.remove('button_alt-active');
            this.isPaymentSelected = true;
            this.events.emit('order:cash');

            if (this.hasSubmitAttempt && this.isPaymentSelected && this.isAddressFilled) {
                this.valid = true;
                this.errors = '';
            }
        });

        this.addressInputElement.addEventListener('input', () => {
            this.isAddressFilled = this.addressInputElement.value.trim() !== '';
            this.events.emit('order:address', { address: this.addressInputElement.value });

            if (this.hasSubmitAttempt && this.isPaymentSelected && this.isAddressFilled) {
                this.valid = true;
                this.errors = '';
            }
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.hasSubmitAttempt = true;
            
            const isValid = this.isPaymentSelected && this.isAddressFilled;
            
            if (!isValid) {
                const errors: string[] = [];
                if (!this.isPaymentSelected) errors.push('Необходимо выбрать способ оплаты');
                if (!this.isAddressFilled) errors.push('Необходимо указать адрес');
                this.errors = errors.join('. ');
                this.valid = false;
            } else {
                this.errors = '';
                this.events.emit('order:submit');
            }
        });
    }

    set address(address: string) {
        this.addressInputElement.value = address;
        this.isAddressFilled = address.trim() !== '';

        if (this.hasSubmitAttempt && this.isPaymentSelected && this.isAddressFilled) {
            this.valid = true;
            this.errors = '';
        }
    }

    set payment(value: TPayment) {
        this.orderCardButton.classList.remove('button_alt-active');
        this.orderCashButton.classList.remove('button_alt-active');

        if (value === 'card') {
            this.orderCardButton.classList.add('button_alt-active');
        } else if (value === 'cash') {
            this.orderCashButton.classList.add('button_alt-active');
        }
        this.isPaymentSelected = true;

        if (this.hasSubmitAttempt && this.isPaymentSelected && this.isAddressFilled) {
            this.valid = true;
            this.errors = '';
        }
    }
}