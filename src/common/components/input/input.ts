/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
// const inputTemplate = require("./input.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
import inputTemplate from './input.hbs?raw';
import Block, { Props } from '../../core/Block';
import './input.scss';

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

interface InputProps extends Props {
  placeholder?: string,
  validationRules?: IRules,
  onBlur?: (event: Event | undefined) => void,
  type?: string
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
