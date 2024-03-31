import './login.scss';
import loginTmpl from './login.hbs?raw';
import Block, { Props, Children } from '../../common/core/Block';
import Button from "../../common/components/button/button";
import Input from "../../common/components/input/input";
// import { InputField } from '../../components/input-field/input-field';
// import Handlebars from "handlebars";

export default class LoginPage extends Block {
    protected constructor(data: Props | Children = {}) {

        super({
            data,
            onLogin: (event: Event | undefined) => {
                if (!event) return;
                event.preventDefault();

                const children = this.children;
                const dataForms: Record<string, string | false> = {};

                Object.values(children).forEach(child => {
                    if(child instanceof Input) {
                        console.log("login ts children", child)
                        dataForms[child.props.name] = child.value()
                    }
                })
                // children.forEach((child) => {
                //     console.log("login ts child", child)
                //     if (child instanceof Input) {
                //         dataForms[child.name] = child.value();
                //     }
                // });
                // eslint-disable-next-line no-console
                console.log("DATA", dataForms);
            },
            nameInput: new Input({ name: "login", classname: "input-login", placeholder: "Логин" }),
            passwordInput: new Input({ name: "password", classname: "input-password", placeholder: "Пароль" }),
            authButton: new Button({
                classname: "filled",
                label: "Авторизоваться",
                link: "/main",
                onClick: (e) => {
                    console.log(this)
                    this.props.onLogin(e)
                }
            }),
            noAccButton: new Button({
                classname: "flat",
                label: "Нет аккаунта?",
                link: "/register",
                onClick: () => {
                    console.log("yeah!!!")
                }
            })
        });
    }

    protected render(): string {
        return loginTmpl;
    }
}