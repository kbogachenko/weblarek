import { Form } from './form';
import { IFormContact } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class FormContacts extends Form<IFormContact> {
    private events: IEvents;
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private isEmailFilled: boolean = false;
    private isPhoneFilled: boolean = false;
    private hasSubmitAttempt: boolean = false;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.isEmailFilled = this.emailInput.value.trim() !== '';
            this.events.emit('contact:email', { email: this.emailInput.value });
            if (this.hasSubmitAttempt && this.isEmailFilled && this.isPhoneFilled) {
                this.valid = true;
                this.errors = '';
            }
        });

        this.phoneInput.addEventListener('input', () => {
            this.isPhoneFilled = this.phoneInput.value.trim() !== '';
            this.events.emit('contact:phone', { phone: this.phoneInput.value });
            if (this.hasSubmitAttempt && this.isEmailFilled && this.isPhoneFilled) {
                this.valid = true;
                this.errors = '';
            }
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.hasSubmitAttempt = true;
            
            if (!this.isEmailFilled || !this.isPhoneFilled) {
                const errors: string[] = [];
                if (!this.isEmailFilled) errors.push('Необходимо указать E-mail');
                if (!this.isPhoneFilled) errors.push('Необходимо указать телефон');
                this.errors = errors.join('. ');
                this.valid = false;
            } else {
                this.errors = '';
                this.events.emit('contact:submit');
            }
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
        this.isEmailFilled = value.trim() !== '';
        if (this.hasSubmitAttempt && this.isEmailFilled && this.isPhoneFilled) {
            this.valid = true;
            this.errors = '';
        }
    }

    set phone(value: string) {
        this.phoneInput.value = value;
        this.isPhoneFilled = value.trim() !== '';
        if (this.hasSubmitAttempt && this.isEmailFilled && this.isPhoneFilled) {
            this.valid = true;
            this.errors = '';
        }
    }
}