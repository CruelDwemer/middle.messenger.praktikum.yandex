import registerTemplate from './register.hbs?raw';
import Block from '../../common/core/Block';
import { Props, Children } from '../../common/core/BlockBase';
import Button from '../../common/components/button/button';
import Input from '../../common/components/inputField/inputField';
import onSubmit from '../../common/utils/formSubmit';
import Router, { PATH } from '../../common/core/Router';
import AuthController from '../../common/controllers/AuthController';
import handleError from '../../common/utils/handleError';

export default class RegisterPage extends Block {
  protected constructor(data: Props | Children = {}) {
    super({
      data,
      emailInput: new Input({
        name: 'email',
        classname: 'input-login',
        placeholder: 'Почта',
        validationRules: {
          regexp: new RegExp(/^[a-zA-Z\d._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/),
          regexpError: 'Неправильный формат email',
        },
      }),
      loginInput: new Input({
        name: 'login',
        classname: 'input-login',
        placeholder: 'Логин',
        validationRules: {
          minLength: 3,
          maxLength: 20,
          regexp: new RegExp(/^[a-zA-Z][a-zA-Z0-9]*([_-]?[a-zA-Z0-9])?$/),
          regexpError: "Допустимые символы - латиница, цифры, '_', '-'",
        },
      }),
      passwordInput: new Input({
        name: 'password',
        classname: 'input-login',
        placeholder: 'Пароль',
        type: 'password',
        validationRules: {
          minLength: 8,
          maxLength: 40,
          regexp: new RegExp(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/),
          regexpError: 'Допустимые символы - латиница, обязательно хотя бы одна заглавная буква и цифра',
        },
      }),
      firstNameInput: new Input({
        name: 'first_name',
        classname: 'input-login',
        placeholder: 'Имя',
        validationRules: {
          regexp: new RegExp(/^[A-Za-zА-Яа-я][A-Za-zА-Яа-я-]*$/),
          regexpError: 'Допустимые символы - латиница или кириллица с заглавной буквы',
        },
      }),
      secondNameInput: new Input({
        name: 'second_name',
        classname: 'input-login',
        placeholder: 'Фамилия',
        validationRules: {
          regexp: new RegExp(/^[A-Za-zА-Яа-я][A-Za-zА-Яа-я-]*$/),
          regexpError: 'Допустимые символы - латиница или кириллица с заглавной буквы',
        },
      }),
      phoneInput: new Input({
        name: 'phone',
        classname: 'input-password',
        placeholder: 'Телефон',
        validationRules: {
          regexp: new RegExp(/^\+?\d{10,15}$/),
          regexpError: 'От 10 до 15 цифр, может начинаться с +',
        },
      }),
      registrationButton: new Button({
        classname: 'filled',
        label: 'Зарегистрироваться',
        onClick: (e: Event | undefined) => {
          onSubmit(e, this.children, PATH.MAIN, 'REGISTRATION DATA', AuthController.createUser)
            .catch(handleError);
        },
      }),
      loginButton: new Button({
        classname: 'flat',
        label: 'Войти',
        onClick: () => Router.go(PATH.LOGIN),
      }),
    });
  }

  protected render(): string {
    return registerTemplate;
  }
}
