import { Component } from '../base/Component';
import { IForm } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Form<T extends IForm> extends Component<T> {
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.submitButton.disabled = false;
    }

    set errors(errors: string) {
        this.errorsElement.textContent = errors;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}