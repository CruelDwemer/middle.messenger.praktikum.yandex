/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
const sendButtonTemplate = require("./sendButton.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
// import sendButtonTemplate from "./sendButton.hbs?raw";
import Block, { Props } from '../../core/Block';

interface ButtonProps extends Props {
    onClick?: (e: Event | undefined) => void
}

export default class SendButton extends Block {
    constructor(props: ButtonProps) {
        super(props);
        this.props.events = {
            click: this.props.onClick || (() => {})
        }
    }

    protected render(): string {
        return sendButtonTemplate
    }
}
