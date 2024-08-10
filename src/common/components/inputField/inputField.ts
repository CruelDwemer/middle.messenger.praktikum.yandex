/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
// const inputTemplate = require("./input.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
import inputFieldTemplate from './inputField.hbs?raw';
import Block, { Props } from '../../core/Block';
import './inputField.scss';
import InputErrorLine from '../inputErrorLine/inputErrorLine';
import Input, { IInput } from '../input/input';

export interface IInputField extends Block {
  value: () => string
}

interface IRules {
  minLength?: number,
  maxLength?: number,
  regexp?: RegExp,
  regexpError?: string
}

export interface InputFieldProps extends Props {
  name?: string,
  placeholder?: string,
  validationRules?: IRules,
  type?: string
  input?: IInput,
  inputClassname?: string
}

export default class InputField extends Block implements IInputField {
  private readonly input: IInput;

  private inputError: Block;

  constructor(props: InputFieldProps) {
    if (!props.type) {
      props.type = 'text';
    }

    let input;
    if (!props.input) {
      input = new Input({
        name: props.name || '',
        placeholder: props.placeholder || '',
        classname: props.inputClassname || '',
        onBlur: (event: Event | undefined) => {
          if (!event) {
            return;
          }
          event.preventDefault();
          this.validate();
        },
      });
    } else {
      input = props.input;
    }

    const inputError = new InputErrorLine({
      error: '',
    });

    super({
      ...props,
      input,
      inputError,
    });

    this.input = input;
    this.inputError = inputError;
  }

  private _value() {
    const input = this.input;
    if (input) {
      return input.value();
    }
    return '';
  }

  public value() {
    if (!this.validate()) {
      return '';
    }
    return this._value();
  }

  public resetValue() {
    const input = this.input;
    if (input.value()) {
      input.setProps({ value: '' });
    }
  }

  private _validate() {
    let hasErrors = false;
    const rules: IRules = this.props.validationRules as IRules;

    if (rules) {
      if ('minLength' in rules && rules.minLength) {
        if (this._value().length < rules.minLength) {
          hasErrors = true;
          this.inputError.props.error = `Минимально число символов - ${rules.minLength}`;
        }
      }
      if ('maxLength' in rules && rules.maxLength) {
        if (this._value().length > rules.maxLength) {
          hasErrors = true;
          this.inputError.props.error = `Минимально число символов - ${rules.maxLength}`;
        }
      }
      if (rules.regexp) {
        if (!rules.regexp.test(this._value())) {
          hasErrors = true;
          this.inputError.props.error = rules.regexpError || '';
        }
      }
    }

    if (!hasErrors && this.inputError.props.error) {
      this.inputError.props.error = '';
    }

    return !hasErrors;
  }

  public validate() {
    const isValid = this._validate();
    if (isValid) {
      this.input.applyRegularStyle();
    } else {
      this.input.applyErrorStyle();
    }
    return isValid;
  }

  protected render(): string {
    return inputFieldTemplate;
  }
}
