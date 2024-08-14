import inputTemplate from './input.hbs?raw';
import Block from '../../core/Block';
import './input.scss';
import { BlockDataType } from '../../core/BlockBase';

export interface IInput extends Block {
  applyRegularStyle: () => void,
  applyErrorStyle: () => void,
  value: () => string
}

interface IRules {
  minLength?: number,
  maxLength?: number,
  regexp?: RegExp
}

export interface InputProps extends BlockDataType {
  placeholder?: string,
  validationRules?: IRules,
  onBlur?: (event: Event | undefined) => void,
  type?: string,
  name?: string,
  label?: string,
  onChange?: ((e: Event) => void) | ((e: Event) => Promise<void>),
  classname?: string,
  value?: string
}

export default class Input extends Block implements IInput {
  constructor(props: InputProps) {
    if (!props.type) {
      props.type = 'text';
    }
    if (!props.placeholder) {
      props.placeholder = '';
    }
    super(props);

    this.props.events = {
      blur: this.props.onBlur || (() => {}),
      change: this.props.onChange || (() => {}),
    };
  }

  private _value() {
    const input = this.element;
    if (input && input instanceof HTMLInputElement) {
      return input.value;
    }
    return '';
  }

  public value() {
    return this._value();
  }

  public applyRegularStyle() {
    this.getContent()!.classList.remove('input-error');
  }

  public applyErrorStyle() {
    this.getContent()!.classList.add('input-error');
  }

  protected render(): string {
    return inputTemplate;
  }
}
