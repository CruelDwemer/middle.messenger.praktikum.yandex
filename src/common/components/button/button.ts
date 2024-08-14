import { default as buttonTemplate } from './button.hbs?raw';
import Block from '../../core/Block';
import './button.scss';
import { BlockDataType } from '../../core/BlockBase';

interface ButtonProps extends BlockDataType {
  onClick?: (e: Event | undefined) => void | Promise<void>,
  classname?: string,
  label: string
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
