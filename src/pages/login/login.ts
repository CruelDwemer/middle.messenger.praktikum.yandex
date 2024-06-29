/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
const loginTemplate = require("./login.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
// import loginTemplate from "./login.hbs?raw";
import Block, { Props, Children } from '../../common/core/Block';
import Button from "../../common/components/button/button";
import Input from "../../common/components/input/input";
import './login.scss';
import onLogin from "../../common/utils/formSubmit"

interface ILoginProps extends Props {
    onLogin?: (event: Event | undefined) => void
}

export default class LoginPage extends Block {
    protected constructor(data: ILoginProps | Children = {}) {
        super({
            data,
            loginInput: new Input({
                name: "login",
                classname: "input-login",
                placeholder: "Логин",
                validationRules: {
                    minLength: 3,
                    maxLength: 20,
                    regexp: new RegExp(/^[a-zA-Z][a-zA-Z0-9]*([_-]?[a-zA-Z0-9])?$/)
                }
            }),
            passwordInput: new Input({
                name: "password",
                classname: "input-password",
                placeholder: "Пароль",
                validationRules: {
                    minLength: 8,
                    maxLength: 40,
                    regexp: new RegExp(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
                }
            }),
            authButton: new Button({
                classname: "filled",
                label: "Авторизоваться",
                link: "/main",
                onClick: (e: Event | undefined): void => {
                    onLogin(e, this.children, "/main", "LOGIN DATA")
                }
            }),
            noAccButton: new Button({
                classname: "flat",
                label: "Нет аккаунта?",
                link: "/register"
            })
        });
    }

    protected render(): string {
        return loginTemplate;
    }
}
