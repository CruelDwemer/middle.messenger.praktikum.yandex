/*
*  сделано через require, чтобы обойти ошибку "cannot find module 'hbs?raw' or its corresponding type declarations"
* */
const registerTemplate = require("./register.hbs?raw");
/*
*  ниже закомментировано, так как локально возникает ошибка "Uncaught ReferenceError: require is not defined"
*  поэтому локально используется import при сборке
* */
// import registerTemplate from "./register.hbs?raw";
import Block, { Props, Children } from '../../common/core/Block';
import Button from "../../common/components/button/button";
import Input from "../../common/components/input/input";
import onSubmit from "../../common/utils/formSubmit"

export default class RegisterPage extends Block {
    protected constructor(data: Props | Children = {}) {
        super({
            data,
            emailInput: new Input({
                name: "email",
                classname: "input-login",
                placeholder: "Почта",
                validationRules: {
                    regexp: new RegExp(/^[a-zA-Z\d._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/)
                }
            }),
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
                classname: "input-login",
                placeholder: "Пароль",
                type: "password",
                validationRules: {
                    minLength: 8,
                    maxLength: 40,
                    regexp: new RegExp(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
                }
            }),
            firstNameInput: new Input({
                name: "first_name",
                classname: "input-login",
                placeholder: "Имя",
                validationRules: {
                    regexp: new RegExp(/^[A-Za-zА-Яа-я][A-Za-zА-Яа-я-]*$/)
                }
            }),
            secondNameInput: new Input({
                name: "second_name",
                classname: "input-login",
                placeholder: "Фамилия",
                validationRules: {
                    regexp: new RegExp(/^[A-Za-zА-Яа-я][A-Za-zА-Яа-я-]*$/)
                }
            }),
            phoneInput: new Input({
                name: "phone",
                classname: "input-password",
                placeholder: "Телефон",
                validationRules: {
                    regexp: new RegExp(/^\+?\d{10,15}$/)
                }
            }),
            registrationButton: new Button({
                classname: "filled",
                label: "Зарегистрироваться",
                link: "/main",
                onClick: (e: Event | undefined) => {
                    onSubmit(e, this.children, "/main", "REGISTRATION DATA")
                }
            }),
            loginButton: new Button({
                classname: "flat",
                label: "Войти",
                link: "/login"
            })
        });
    }

    protected render(): string {
        return registerTemplate;
    }
}
