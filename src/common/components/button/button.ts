import { default as buttonTemplate } from './button.hbs?raw';
import Block, { Props } from '../../core/Block';
import './button.scss';

interface ButtonProps extends Props {
  onClick?: (e: Event | undefined) => void | Promise<void>
}

export default class Button extends Block {
  constructor(props: ButtonProps) {
    super(props);
    this.props.events = {
      click: this.props.onClick || (() => {}),
    };
  }

  protected render(): string {
    return buttonTemplate;
  }
}
