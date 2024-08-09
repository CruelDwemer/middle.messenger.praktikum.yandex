/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
// const buttonTemplate = require("./button.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
import { default as buttonTemplate } from "./button.hbs?raw";
import Block, { Props } from '../../core/Block';
import './button.scss';

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
