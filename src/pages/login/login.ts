/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
// const loginTemplate = require("./login.hbs?raw");
import loginTemplate from "./login.hbs?raw";
import Block, { Props, Children } from '../../common/core/Block';
import Button from "../../common/components/button/button";
import Input from "../../common/components/input/input";
import './login.scss';

interface ILoginProps extends Props {
    onLogin?: (event: Event | undefined) => void
}

const onLogin = (event: Event | undefined) => {
    if (!event) return;
    event.preventDefault();

    const dataForms: Record<string, string | false> = {};

    let isValid = true;
    Object.values(this.children).forEach(child => {
        if(child instanceof Input) {
            if(!child.validate()) {
                isValid = false
            }
            dataForms[child.props.name as string] = child.value()
        }
    })
    console.log("LOGIN DATA");
    console.table(dataForms);
    if(isValid) {
        window.location.href = "/main"
    }
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
                    onLogin(e)
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
