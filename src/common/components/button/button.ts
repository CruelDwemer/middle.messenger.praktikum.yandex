import './button.scss';
// import buttonTemplate from './button.hbs?raw';
const buttonTemplate = require("./button.hbs?raw")

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
        return buttonTemplate
    }
}
