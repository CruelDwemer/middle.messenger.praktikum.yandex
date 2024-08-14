import sendButtonTemplate from './sendButton.hbs?raw';
import Block from '../../core/Block';
import { Props } from '../../core/BlockBase';

interface ButtonProps extends Props {
  onClick?: (e: Event | undefined) => void,
  width?: string
}

export default class SendButton extends Block {
  constructor(props: ButtonProps) {
    super(props);
    this.props.events = {
      click: this.props.onClick || (() => {}),
    };
  }

  protected render(): string {
    return sendButtonTemplate;
  }
}
