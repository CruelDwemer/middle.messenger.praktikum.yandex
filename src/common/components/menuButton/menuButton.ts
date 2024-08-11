import { default as menuButtonTemplate } from './menuButton.hbs?raw';
import Block, { Props } from '../../core/Block';

interface ButtonProps extends Props {
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
