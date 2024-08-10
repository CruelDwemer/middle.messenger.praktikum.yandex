import { default as loginTemplate } from './login.hbs?raw';
import Block, { Children, PropsWithChildrenType } from '../../common/core/Block';
import Button from '../../common/components/button/button';
import connect from '../../common/utils/connect';
import InputField from '../../common/components/inputField/inputField';
import './login.scss';
import onLogin from '../../common/utils/formSubmit';
import Router, { PATH } from '../../common/core/Router';
import AuthController from '../../common/controllers/AuthController';
import { State } from '../../common/core/Store';
import handleError from '../../common/utils/handleError';

interface ILoginProps extends PropsWithChildrenType {
  onLogin?: (event: Event | undefined) => void
}

class LoginPage extends Block {
  protected constructor(data: ILoginProps | Children = {}) {
    super({
      data,
      loginInput: new InputField({
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
      passwordInput: new InputField({
        name: 'password',
        classname: 'input-password',
        placeholder: 'Пароль',
        validationRules: {
          minLength: 8,
          maxLength: 40,
          regexp: new RegExp(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/),
          regexpError: 'Допустимые символы - латиница, обязательно хотя бы одна заглавная буква и цифра',
        },
      }),
      authButton: new Button({
        classname: 'filled',
        label: 'Авторизоваться',
        onClick: (e: Event | undefined): void => {
          onLogin(e, this.children, PATH.MAIN, 'LOGIN DATA', AuthController.login.bind(AuthController))
            .catch(handleError);
        },
      }),
      noAccButton: new Button({
        classname: 'flat',
        label: 'Нет аккаунта?',
        onClick: () => Router.go(PATH.REGISTER),
      }),
    });
  }

  static getStateToProps(state: State) {
    return state;
  }

  protected render(): string {
    return loginTemplate;
  }
}

export default connect(LoginPage);
