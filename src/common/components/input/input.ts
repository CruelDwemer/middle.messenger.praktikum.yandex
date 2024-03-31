import template from './input.hbs?raw';

import Block, { Props } from '../../core/Block';

export interface IInput extends Block {
    value: () => string
}

export default class Input extends Block implements IInput {
    constructor(props: Props) {
        super(props);
        this.props.events = {
            click: this.props.onClick || (() => {})
        }
    }

    private _value() {
        if (this.element instanceof HTMLInputElement) {
            return this.element.value;
        }
        return '';
    }

    public value() {
        // if (!this.validate()) {
        //     return false;
        // }

        return this._value();
    }

    protected render(): string {
        return template
    }
}
