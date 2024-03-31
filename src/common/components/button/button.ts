import './button.scss';
import button from './button.hbs';

import Block, { Props } from '../../core/Block';

interface ButtonProps extends Props {
    onClick?: (e: Event | undefined) => void
}

export default class Button extends Block {
    constructor(props: ButtonProps) {
        super(props);
        this.props.events = {
            click: this.props.onClick || (() => {})
        }
    }

    protected render(): string {
        return button
    }
}
