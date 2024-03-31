import './button.scss';
import tmplButton from './button.hbs?raw';

import Block, { Props } from '../../core/Block';

export default class Button extends Block {
    constructor(props: Props) {
        super(props);
        this.props.events = {
            click: this.props.onClick || (() => {})
        }
    }

    protected render(): string {
        return tmplButton
    }
}