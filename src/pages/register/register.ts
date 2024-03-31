import registerTmpl from './register.hbs?raw';
import Block, { Props, Children } from '../../common/core/Block';
import Button from "../../common/components/button/button";
import Input from "../../common/components/input/input";

export default class RegisterPage extends Block {
    protected constructor(data: Props | Children = {}) {
        super({
            data,
            onSubmit: (event: Event | undefined) => {
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
                console.log("REGISTRATION DATA");
                console.table(dataForms);
                if(isValid) {
                    window.location.href = "/main"
                }
            },
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
                    this.props.onSubmit(e)
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
        return registerTmpl;
    }
}
