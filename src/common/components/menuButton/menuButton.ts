import { default as menuButtonTemplate } from './menuButton.hbs?raw';
import Block from '../../core/Block';
import { BlockDataType } from '../../core/BlockBase';

interface ButtonProps extends BlockDataType {
  onClick?: (e: Event | undefined) => void | Promise<void>
}

export default class MenuButton extends Block {
  constructor(props: ButtonProps) {
    super(props);
    this.props.events = {
      click: this.props.onClick || (() => {}),
    };
  }

  protected render(): string {
    return menuButtonTemplate;
  }
}
